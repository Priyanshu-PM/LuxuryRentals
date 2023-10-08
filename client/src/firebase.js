// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries



// Your web app's Firebase configuration
const firebaseConfig = {

  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,

  authDomain: "luxury-rentals-ec407.firebaseapp.com",
  projectId: "luxury-rentals-ec407",
  storageBucket: "luxury-rentals-ec407.appspot.com",
  messagingSenderId: "910496317803",
  appId: "1:910496317803:web:a562a20b8367ff45200c2e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);