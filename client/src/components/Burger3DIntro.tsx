import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface Burger3DIntroProps {
  onComplete: () => void;
}

interface AnimObj {
  mesh: THREE.Object3D;
  assembledPos: THREE.Vector3;
  explodedPos: THREE.Vector3;
  boxPos: THREE.Vector3;
  assembledRot: THREE.Euler;
  explodedRot: THREE.Euler;
  boxRot: THREE.Euler;
  scale: number;
}

export const Burger3DIntro: React.FC<Burger3DIntroProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  const handleSkip = useCallback(() => {
    sessionStorage.setItem('burgo_intro_played', 'true');
    onCompleteRef.current();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // ── RENDERER ──────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    renderer.setClearColor(0x0a0f1d);
    container.appendChild(renderer.domElement);

    // ── SCENE & CAMERA ────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.055);

    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 2.5, 11);
    camera.lookAt(0, 1, 0);

    // ── ORBIT CONTROLS ────────────────────────────────────────────
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enableZoom = false;
    controls.maxPolarAngle = Math.PI / 1.8;
    controls.minPolarAngle = Math.PI / 4;
    controls.target.set(0, 1, 0);

    // ── LIGHTING ──────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    const keyLight = new THREE.DirectionalLight(0xfffbeb, 2.2);
    keyLight.position.set(6, 10, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.0); // cool blue rim
    rimLight.position.set(-6, 3, -5);
    scene.add(rimLight);

    const grillGlow = new THREE.PointLight(0xf97316, 5.0, 20); // warm orange grill bottom
    grillGlow.position.set(0, -4, 0);
    scene.add(grillGlow);

    // ── PARTICLE FIELD (floating embers/sparkles) ─────────────────
    const particleCount = 180;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pPos[i * 3 + 0] = (Math.random() - 0.5) * 20;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0xf59e0b, size: 0.05, transparent: true, opacity: 0.55 });
    scene.add(new THREE.Points(pGeo, pMat));

    // ── BURGO BOX (procedural – no GLB needed) ───────────────────
    const boxGroup = new THREE.Group();
    boxGroup.position.set(0, -4.2, 0);
    scene.add(boxGroup);

    const darkSlate = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.75, metalness: 0.15 });
    const innerSlate = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6, metalness: 0.2 });

    // Tray
    const tray = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.18, 3.4), darkSlate);
    tray.position.set(0, -0.5, 0);
    tray.receiveShadow = true;
    boxGroup.add(tray);
    // Walls
    [[-2.2, 0, 0, 0.12, 1.1, 3.4], [2.2, 0, 0, 0.12, 1.1, 3.4],
     [0, 0, -1.65, 4.6, 1.1, 0.12], [0, 0, 1.65, 4.6, 1.1, 0.12]].forEach(([x, y, z, w, h, d]) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), darkSlate);
      m.position.set(x as number, y as number, z as number); m.castShadow = true;
      boxGroup.add(m);
    });
    // Dividers
    [-0.7, 0.7].forEach(x => {
      const d = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.9, 3.2), innerSlate);
      d.position.set(x, -0.05, 0); boxGroup.add(d);
    });
    // Lid (opened backward)
    const logoTex = new THREE.TextureLoader().load('/ref/IMG-20260615-WA0025.jpg');
    logoTex.colorSpace = THREE.SRGBColorSpace;
    const lidMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6, metalness: 0.2, map: logoTex });
    const lid = new THREE.Mesh(new THREE.BoxGeometry(4.6, 3.4, 0.1), lidMat);
    lid.geometry.translate(0, 1.7, 0); // pivot at bottom hinge
    lid.position.set(0, 0, -1.65);
    lid.rotation.x = -Math.PI / 1.5; // open ~120°
    lid.castShadow = true;
    boxGroup.add(lid);

    // ── GLTF LOADER ───────────────────────────────────────────────
    const loader = new GLTFLoader();
    const MODEL_BASE = '/models/food/';

    const loadModel = (name: string): Promise<THREE.Object3D> =>
      new Promise((resolve, reject) => {
        loader.load(
          `${MODEL_BASE}${name}`,
          (gltf) => {
            gltf.scene.traverse((child) => {
              if ((child as THREE.Mesh).isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });
            resolve(gltf.scene);
          },
          undefined,
          reject
        );
      });

    const animObjects: AnimObj[] = [];
    let assembledBurger: THREE.Object3D | null = null;
    let rafId: number;
    let startTime = 0;
    let animReady = false;

    // ── LOAD ALL MODELS ───────────────────────────────────────────
    const modelDefs: { file: string; count: number; scale: number; assembledY: number; explodeRadius: number; explodeY: number; boxX: number; boxYStart: number; boxYStep: number; boxZ: number; }[] = [
      { file: 'meat-patty.glb',   count: 6, scale: 1.2,  assembledY: 0.0,  explodeRadius: 2.4, explodeY: 1.2,  boxX: 0,     boxYStart: -0.5, boxYStep: 0.18, boxZ: 0 },
      { file: 'cheese-cut.glb',   count: 6, scale: 1.1,  assembledY: 0.4,  explodeRadius: 2.0, explodeY: 0.3,  boxX: 1.35,  boxYStart: -0.5, boxYStep: 0.07, boxZ: 0.4 },
      { file: 'tomato-slice.glb', count: 4, scale: 1.0,  assembledY: 0.7,  explodeRadius: 2.2, explodeY: -0.5, boxX: -1.35, boxYStart: -0.5, boxYStep: 0.12, boxZ: 0.5 },
      { file: 'onion-half.glb',   count: 4, scale: 0.9,  assembledY: 0.9,  explodeRadius: 1.8, explodeY: -1.2, boxX: -1.35, boxYStart: -0.4, boxYStep: 0.14, boxZ: -0.5 },
      { file: 'cup-saucer.glb',   count: 2, scale: 0.55, assembledY: 0.5,  explodeRadius: 2.6, explodeY: -1.8, boxX: 1.35,  boxYStart: -0.3, boxYStep: 0.3,  boxZ: -0.5 },
    ];

    const totalModels = modelDefs.length + 1; // +1 for assembled burger
    let loaded = 0;
    const tick = () => { loaded++; setLoadProgress(Math.round((loaded / totalModels) * 100)); };

    Promise.all([
      // Assembled burger model (shown in stage 1)
      loadModel('burger-cheese.glb').then(s => { assembledBurger = s; s.scale.setScalar(1.8); s.position.set(0, 1.2, 0); scene.add(s); tick(); }),
      // Individual ingredient models
      ...modelDefs.map(def =>
        loadModel(def.file).then(template => {
          tick();
          for (let i = 0; i < def.count; i++) {
            const inst = template.clone();
            inst.scale.setScalar(def.scale);
            const angle = (i / def.count) * Math.PI * 2;
            const r = def.explodeRadius;

            const aPos = new THREE.Vector3((Math.random() - 0.5) * 0.5, def.assembledY, (Math.random() - 0.5) * 0.5);
            const ePos = new THREE.Vector3(Math.cos(angle) * r, def.explodeY + (Math.random() * 0.5 - 0.25), Math.sin(angle) * r);
            const bPos = new THREE.Vector3(def.boxX, def.boxYStart + i * def.boxYStep, def.boxZ);

            const aRot = new THREE.Euler(0, angle, 0);
            const eRot = new THREE.Euler((Math.random() - 0.5) * 0.5, angle + Math.PI, (Math.random() - 0.5) * 0.4);
            const bRot = new THREE.Euler(0, 0, 0);

            inst.position.copy(aPos);
            inst.rotation.copy(aRot);
            inst.visible = false;
            scene.add(inst);

            animObjects.push({ mesh: inst, assembledPos: aPos, explodedPos: ePos, boxPos: bPos, assembledRot: aRot, explodedRot: eRot, boxRot: bRot, scale: def.scale });
          }
        })
      )
    ])
    .then(() => {
      startTime = Date.now();
      animReady = true;
    })
    .catch(console.error);

    // ── ANIMATE ───────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let introDone = false;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Animate particles drift
      const positions = pGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        positions.setY(i, positions.getY(i) + 0.003);
        if (positions.getY(i) > 8) positions.setY(i, -8);
      }
      positions.needsUpdate = true;

      // Animate grill glow pulse
      grillGlow.intensity = 4.5 + Math.sin(t * 3) * 1.0;

      if (!animReady) { controls.update(); renderer.render(scene, camera); return; }

      const elapsed = (Date.now() - startTime) / 1000;

      // ── STAGE 1: 0 – 1.5s  Assembled burger ──────────────────
      if (elapsed < 1.5) {
        if (assembledBurger) {
          assembledBurger.visible = true;
          assembledBurger.position.y = 1.2 + Math.sin(elapsed * 2.5) * 0.12;
          assembledBurger.rotation.y = elapsed * 0.5;
        }
        animObjects.forEach(o => { o.mesh.visible = false; });
      }
      // ── STAGE 2: 1.5 – 3.0s  Explode ────────────────────────
      else if (elapsed < 3.0) {
        if (assembledBurger) assembledBurger.visible = false;
        const p = Math.min((elapsed - 1.5) / 1.5, 1);
        const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; // ease in-out quad

        animObjects.forEach((o, idx) => {
          o.mesh.visible = true;
          o.mesh.position.lerpVectors(o.assembledPos, o.explodedPos, eased);
          o.mesh.position.y += Math.sin(elapsed * 3 + idx * 0.8) * 0.04;
          const qA = new THREE.Quaternion().setFromEuler(o.assembledRot);
          const qE = new THREE.Quaternion().setFromEuler(o.explodedRot);
          o.mesh.quaternion.slerpQuaternions(qA, qE, eased);
        });
      }
      // ── STAGE 3: 3.0 – 5.0s  Pack into box ──────────────────
      else if (elapsed < 5.0) {
        const p = Math.min((elapsed - 3.0) / 2.0, 1);
        // Cubic ease-out for satisfying "snap into place"
        const eased = 1 - Math.pow(1 - p, 3);

        animObjects.forEach((o) => {
          // Target position is box position PLUS the box's world offset
          const worldBoxPos = o.boxPos.clone();
          worldBoxPos.y += boxGroup.position.y; // compensate for box Y offset
          o.mesh.position.lerpVectors(o.explodedPos, worldBoxPos, eased);
          const qE = new THREE.Quaternion().setFromEuler(o.explodedRot);
          const qB = new THREE.Quaternion().setFromEuler(o.boxRot);
          o.mesh.quaternion.slerpQuaternions(qE, qB, eased);
        });

        // Camera slowly descends to view box being filled
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, -0.5, 0.015);
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, 9, 0.015);
        controls.target.y = THREE.MathUtils.lerp(controls.target.y, -1.5, 0.015);
      }
      // ── STAGE 4: 5.0 – 6.5s  Fade out ───────────────────────
      else if (elapsed < 6.5) {
        if (!fadeOut) setFadeOut(true);
      }
      // ── DONE ─────────────────────────────────────────────────
      else if (!introDone) {
        introDone = true;
        onCompleteRef.current();
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // ── RESIZE ────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[9999] transition-opacity duration-1000 ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      style={{ background: '#0a0f1d' }}
    >
      {/* WebGL Canvas */}
      <div ref={containerRef} className="absolute inset-0" />

      {/* Loading bar */}
      {loadProgress < 100 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
          <img src="/ref/IMG-20260615-WA0025.jpg" alt="BURGO" className="w-20 h-20 rounded-full object-contain shadow-2xl ring-2 ring-amber-500/40 mb-6 animate-badge-pop" />
          <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
          <p className="mt-3 text-amber-400 text-xs font-bold tracking-widest uppercase">
            Loading 3D Models... {loadProgress}%
          </p>
        </div>
      )}

      {/* Brand overlay (shown after loading) */}
      {loadProgress === 100 && !fadeOut && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex flex-col items-center">
          <img src="/ref/IMG-20260615-WA0025.jpg" alt="BURGO" className="w-14 h-14 rounded-full object-contain shadow-xl ring-2 ring-amber-500/30 mb-2" />
          <span className="text-white font-extrabold text-lg tracking-widest uppercase drop-shadow-lg">BURGO BOX</span>
          <span className="text-amber-500 text-[10px] font-bold tracking-widest uppercase mt-0.5">Premium Burger Experience</span>
        </div>
      )}

      {/* Skip button */}
      <button
        onClick={handleSkip}
        className="absolute bottom-8 right-8 z-20 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-amber-500/50 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all backdrop-blur-md cursor-pointer"
      >
        Skip ➔
      </button>
    </div>
  );
};
