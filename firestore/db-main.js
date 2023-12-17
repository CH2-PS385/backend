const db = require('./firebase'); 

const usersCollection = db.collection('users');
const plannerCollection = db.collection('planner');

const menu = plannerCollection.doc('menu');
menu.set({
  callories: '',
  carbs: '',
  fat: '',
  label: [''],
  menu_name: '',
  protein: '',
});

const plan = plannerCollection.doc('plan');
plan.set({
  callories: '',
  category: '',
  menu_name: '',
  status: '',
});

const waterTracking = plannerCollection.doc('water_tracking');
waterTracking.set({
  amount: [''],
  date: db.Timestamp.fromDate(new Date()),
  total_amount: '',
});

const account = usersCollection.doc('account');
account.set({
  email: '',
  password: '',
  username: '',
});

const userPreferences = usersCollection.doc('user_preferences');
userPreferences.set({
  age: '',
  allergies: [''],
  gender: '',
  height: '',
  weight: '',
});