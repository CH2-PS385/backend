const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./firestore/ch2-ps385-7b79db54c90c.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://console.cloud.google.com/firestore/databases/-default-/data/panel/?project=ch2-ps385',
});

const db = admin.firestore();

const usersCollection = db.collection('users');
const plannerCollection = db.collection('planner');


// Create a 'menu' document in the 'planner' collection
const menu = plannerCollection.doc('menu');
menu.set({
  callories: '',
  carbs: '',
  fat: '',
  label: [''],
  menu_name: '',
  protein: '',
});

// Create a 'planner' document in the 'planner' collection
const plan = plannerCollection.doc('plan');
plan.set({
  callories: '',
  category: '',
  menu_name: '',
  status: '',
});

// Create a 'water_tracking' document in the 'planner' collection
const waterTracking = plannerCollection.doc('water_tracking');
waterTracking.set({
  amount: [''],
  date: admin.firestore.Timestamp.fromDate(new Date()),
  total_amount: '',
});

// Create an 'account' document in the 'users' collection
const account = usersCollection.doc('account');
account.set({
  email: '',
  password: '',
  username: '',
});

// Create a 'user_preferences' document in the 'users' collection
const userPreferences = usersCollection.doc('user_preferences');
userPreferences.set({
  age: '',
  allergies: [''],
  gender: '',
  height: '',
  weight: '',
});