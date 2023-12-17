const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./firestore/ch2-ps385-7b79db54c90c.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://console.cloud.google.com/firestore/databases/-default-/data/panel/?project=ch2-ps385',
});

const db = admin.firestore();

module.exports = db;