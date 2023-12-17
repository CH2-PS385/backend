import 'dotenv/config';
import { initializeApp,  cert }  from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
const serviceAccount = process.env.SERVICE_ACCOUNT_PATH;
const DATABASE_URL = process.env.DATABASE_URL;

initializeApp({
  databaseURL: DATABASE_URL,
  credential: cert(serviceAccount)
});

export const db = getFirestore();