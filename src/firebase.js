import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAL9gogI3x0fvoDMIH7X4iKZ5Kf1wd_5qY",
  authDomain: "global-prime-5abc4.firebaseapp.com",
  projectId: "global-prime-5abc4",
  storageBucket: "global-prime-5abc4.firebasestorage.app",
  messagingSenderId: "441792033678",
  appId: "1:441792033678:web:c87e9594037b8a0db22adf",
  measurementId: "G-ZZZQWBCJJ4"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
