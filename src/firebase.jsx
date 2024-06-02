import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCJdP-Kf7iTuv9qGCBI4-oYZ82n_AGeazA",
  authDomain: "my-crypto-app-28915.firebaseapp.com",
  projectId: "my-crypto-app-28915",
  storageBucket: "my-crypto-app-28915.appspot.com",
  messagingSenderId: "805019241056",
  appId: "1:805019241056:web:2b9b454f0d1b9356935105",
  measurementId: "G-4ZMEN143PE"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth();

export { app, auth };
