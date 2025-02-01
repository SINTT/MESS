import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAjTEK2SUhGFf1Iic4JKnQ8PXV_HTP56aY",
  authDomain: "mess-55fb4.firebaseapp.com",
  databaseURL: "https://mess-55fb4-default-rtdb.firebaseio.com",
  projectId: "mess-55fb4",
  storageBucket: "mess-55fb4.appspot.com",
  messagingSenderId: "481633610255",
  appId: "1:481633610255:web:895b5e00f11a03f0ac117a",
  measurementId: "G-GVT7QB73GE"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);