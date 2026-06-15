import fs from 'fs';
import path from 'path';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  badge: string | null;
  image: string;
  category: string;
  ingredients: string[];
  prepSteps: string[];
  discount?: {
    type: 'percent' | 'fixed';
    value: number;
    expiryDate?: string;
  } | null;
}

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  governorate: string;
  notes: string;
  items: OrderItem[];
  total: number;
  paymentMethod: 'card' | 'wallet' | 'cod';
  status: 'pending' | 'preparing' | 'shipping' | 'delivered' | 'cancelled';
  createdAt: string;
}

interface DatabaseSchema {
  products: Product[];
  orders: Order[];
}

// In Vercel serverless, __dirname is the compiled function dir; fall back gracefully
const DB_DIR = process.env.DB_DIR
  ? process.env.DB_DIR
  : path.join(__dirname, '../data');
const DB_FILE = path.join(DB_DIR, 'db.json');

const defaultProducts: Product[] = [
  {
    id: 1,
    name: "Classic Smash Burger Box",
    description: "البرجر الكلاسيكي الأصيل — لحمة سميكة مع جبن أمريكي",
    price: 189,
    badge: null,
    image: "🍔",
    category: "classic",
    ingredients: ["لحمة بقر 180g", "جبن أمريكي", "خس", "طماطم", "بصل مكرمل", "صوص Burger Box الخاص"],
    prepSteps: ["سخن المقلاة على نار عالية", "حط اللحمة واسحقها بالمقلاة 3 دقايق", "اقلبها وحط الجبن فوقها", "ركّب السندوتش وبالهنا"]
  },
  {
    id: 2,
    name: "Spicy Crispy Box",
    description: "برجر حار وقرمشي — مش لضعاف القلب",
    price: 219,
    badge: "🌶️ حار",
    image: "🔥",
    category: "spicy",
    ingredients: ["لحمة دجاج مقلية", "صوص فلفل حار", "كول سلو", "مخلل جالبينيو", "خبز بريوش"],
    prepSteps: ["سخن الزيت على 180 درجة", "قلي الدجاج 6-8 دقايق", "صفّيه وركّب السندوتش"]
  },
  {
    id: 3,
    name: "Premium Wagyu Box",
    description: "تجربة راقية مع لحمة واغيو الفاخرة",
    price: 349,
    badge: "⭐ Premium",
    image: "👑",
    category: "premium",
    ingredients: ["لحمة واغيو 200g", "جبن تريفل", "أفوكادو", "أروجولا", "صوص ترياكي", "خبز بريوش أسود"],
    prepSteps: ["سخن الجريل على نار متوسطة-عالية", "اشوي اللحمة 4 دقايق كل جهة", "استنّيها ترتاح دقيقتين قبل التقديم"]
  },
  {
    id: 4,
    name: "Double Smash Box",
    description: "ضعف اللحم، ضعف المتعة",
    price: 259,
    badge: "🔥 الأكثر مبيعاً",
    image: "💪",
    category: "classic",
    ingredients: ["لحمتين بقر 150g", "جبن شيدر مزدوج", "بيض مقلي", "بيكون", "صوص Burger Box Supreme"],
    prepSteps: ["اعمل الخطوات نفس Classic Smash", "أضف البيض المقلي فوق الجبن", "ركّب الطبقتين"]
  },
  {
    id: 5,
    name: "BBQ Smoky Box",
    description: "برجر بنكهة الشواء والدخان الأصيل",
    price: 229,
    badge: null,
    image: "💨",
    category: "classic",
    ingredients: ["لحمة بقر 200g", "صوص BBQ مدخن", "بصل مكرمل", "جبن سموك", "خيار مخلل"],
    prepSteps: ["شوّي اللحمة على نار متوسطة 5 دقايق كل جهة", "ادهن صوص BBQ آخر دقيقة", "ركّب مع البصل المكرمل"]
  },
  {
    id: 6,
    name: "Veggie Power Box",
    description: "بوكس نباتي مش هتحس إنك بتفوّت حاجة",
    price: 169,
    badge: "🌱 نباتي",
    image: "🥦",
    category: "premium",
    ingredients: ["باتي فطر بورتوبيلو", "جبن موزاريلا", "فلفل مشوي", "بيستو", "خبز سياباتا"],
    prepSteps: ["شوّي الفطر على نار عالية دقيقتين كل جهة", "حط الجبن وغطّيه لحظة", "ركّب مع الفلفل والبيستو"]
  }
];

export function initDB() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData: DatabaseSchema = {
      products: defaultProducts,
      orders: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

export function readDB(): DatabaseSchema {
  initDB();
  const raw = fs.readFileSync(DB_FILE, 'utf-8');
  return JSON.parse(raw);
}

export function writeDB(data: DatabaseSchema) {
  initDB();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}
