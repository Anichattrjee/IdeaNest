// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "techtalker-fdd3f.firebaseapp.com",
  projectId: "techtalker-fdd3f",
  storageBucket: "techtalker-fdd3f.appspot.com",
  messagingSenderId: "932104391648",
  appId: "1:932104391648:web:f0cb74c8baaea7106a7985"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);