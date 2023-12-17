const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH;
const serviceAccount = require(serviceAccountPath);
const DATABASE_URL = process.env.DATABASE_URL;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: DATABASE_URL,
  });

const db = admin.firestore();

module.exports = db;