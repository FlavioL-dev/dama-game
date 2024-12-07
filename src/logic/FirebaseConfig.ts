// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const FirebaseConfig = {
  apiKey: "AIzaSyA8wfzL6vLOOzwzGNjtx46FmdbDyBPA2Do",

  authDomain: "dama-data.firebaseapp.com",

  projectId: "dama-data",

  storageBucket: "dama-data.firebasestorage.app",

  messagingSenderId: "530376008031",

  appId: "1:530376008031:web:9083ab0a7bfa7f2b2256ea",

  measurementId: "G-G4CN80DESM",
};

// Initialize Firebase

const app = initializeApp(FirebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const firestore = getFirestore(app);
export { auth, provider, firestore };
