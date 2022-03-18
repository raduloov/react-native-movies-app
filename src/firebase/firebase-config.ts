import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyA1VdWgIh0n1ZbQpg7nkwhkJAwfCVE5vvw',
  authDomain: 'react-native-movies-app-41bcd.firebaseapp.com',
  projectId: 'react-native-movies-app-41bcd',
  storageBucket: 'react-native-movies-app-41bcd.appspot.com',
  messagingSenderId: '487756680759',
  appId: '1:487756680759:web:d67a695049b52bdb2579b2'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
