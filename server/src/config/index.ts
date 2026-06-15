import dotenv from 'dotenv';
import path from 'path';

// Load .env from workspace root
dotenv.config({ path: path.join(__dirname, '../../../.env') });

export const PORT = process.env.PORT || 5000;
export const JWT_SECRET = process.env.JWT_SECRET || 'burger-box-super-secret-key-2026';
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'BurgerBox2025!';

export const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY || 'YOUR_API_KEY_HERE';
export const PAYMOB_INTEGRATION_ID = parseInt(process.env.PAYMOB_INTEGRATION_ID || '0', 10);
export const PAYMOB_IFRAME_ID = parseInt(process.env.PAYMOB_IFRAME_ID || '0', 10);
