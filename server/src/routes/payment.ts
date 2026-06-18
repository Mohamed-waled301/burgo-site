import { Router } from 'express';
import { PAYMOB_API_KEY, PAYMOB_INTEGRATION_ID, PAYMOB_IFRAME_ID } from '../config';

const router = Router();

router.post('/paymob-checkout', async (req, res) => {
  const { orderId, amount, customerInfo } = req.body;

  if (!orderId || !amount || !customerInfo) {
    return res.status(400).json({ error: 'معلومات الطلب والمبلغ والعميل مطلوبة للدفع' });
  }

  // Detect dummy credentials or missing setups
  const isDummyConfig = 
    PAYMOB_API_KEY === 'YOUR_API_KEY_HERE' || 
    !PAYMOB_API_KEY || 
    PAYMOB_INTEGRATION_ID === 0 || 
    PAYMOB_IFRAME_ID === 0;

  if (isDummyConfig) {
    // Return simulated payment URL
    const simulatedToken = `simulated_token_${Math.floor(Math.random() * 1000000)}`;
    const simulatedIframeUrl = `/checkout/payment-simulator?payment_token=${simulatedToken}&order_id=${orderId}&amount=${amount}`;
    
    return res.json({ 
      iframeUrl: simulatedIframeUrl, 
      simulated: true,
      message: 'تم تفعيل بوابة الدفع التجريبية لعدم إدخال مفاتيح Paymob' 
    });
  }

  try {
    // 1. Authenticate with Paymob
    const authResponse = await fetch('https://accept.paymob.com/api/auth/tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: PAYMOB_API_KEY })
    });
    
    if (!authResponse.ok) {
      throw new Error('Paymob Auth Failed');
    }
    
    const authData = await authResponse.json() as { token: string };
    const authValToken = authData.token;

    // 2. Register Order on Paymob
    const orderResponse = await fetch('https://accept.paymob.com/api/ecommerce/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_token: authValToken,
        delivery_needed: 'false',
        amount_cents: Math.round(amount * 100),
        currency: 'EGP',
        items: []
      })
    });

    if (!orderResponse.ok) {
      throw new Error('Paymob Order Registration Failed');
    }
    
    const orderData = await orderResponse.json() as { id: number };
    const paymobOrderId = orderData.id;

    // 3. Generate Payment Key
    const nameParts = customerInfo.name.split(' ');
    const firstName = nameParts[0] || 'Customer';
    const lastName = nameParts.slice(1).join(' ') || 'Box';
    
    const paymentKeyResponse = await fetch('https://accept.paymob.com/api/acceptance/payment_keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_token: authValToken,
        amount_cents: Math.round(amount * 100),
        expiration: 3600,
        order_id: paymobOrderId,
        billing_data: {
          apartment: 'NA',
          floor: 'NA',
          street: customerInfo.address,
          building: 'NA',
          shipping_method: 'PKG',
          postal_code: 'NA',
          city: customerInfo.governorate,
          country: 'EG',
          last_name: lastName,
          state: customerInfo.governorate,
          first_name: firstName,
          email: 'customer@burgo.com',
          phone_number: customerInfo.phone
        },
        currency: 'EGP',
        integration_id: PAYMOB_INTEGRATION_ID
      })
    });

    if (!paymentKeyResponse.ok) {
      throw new Error('Paymob Payment Key Generation Failed');
    }
    
    const paymentKeyData = await paymentKeyResponse.json() as { token: string };
    const paymentToken = paymentKeyData.token;

    const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentToken}`;
    
    return res.json({ iframeUrl, simulated: false });

  } catch (error: any) {
    console.error('Paymob Integration Error:', error.message);
    
    // Fail-safe fallback: let user checkout in sandbox mode rather than breaking the UI
    const simulatedToken = `simulated_token_fallback_${Math.floor(Math.random() * 1000000)}`;
    const simulatedIframeUrl = `/checkout/payment-simulator?payment_token=${simulatedToken}&order_id=${orderId}&amount=${amount}`;
    
    return res.json({ 
      iframeUrl: simulatedIframeUrl, 
      simulated: true, 
      error: 'فشل الاتصال بـ Paymob، تم استخدام البوابة التجريبية' 
    });
  }
});

export default router;
