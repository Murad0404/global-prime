import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAL9gogI3x0fvoDMIH7X4iKZ5Kf1wd_5qY",
  authDomain: "global-prime-5abc4.firebaseapp.com",
  projectId: "global-prime-5abc4",
  storageBucket: "global-prime-5abc4.firebasestorage.app",
  messagingSenderId: "441792033678",
  appId: "1:441792033678:web:c87e9594037b8a0db22adf",
  measurementId: "G-ZZZQWBCJJ4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrate() {
  try {
    const data = JSON.parse(fs.readFileSync('db.json', 'utf-8'));
    const products = data.products || [];
    
    console.log(`Migrating ${products.length} products...`);
    for (const p of products) {
      const id = String(p.id);
      delete p.id; // Don't save id in doc body unnecessarily
      await setDoc(doc(db, 'products', id), p);
      console.log(`Saved product ${id}: ${p.name}`);
    }
    
    const heroSlides = data.heroSlides || [];
    console.log(`Migrating ${heroSlides.length} heroSlides...`);
    for (const s of heroSlides) {
      const id = String(s.id);
      delete s.id;
      await setDoc(doc(db, 'heroSlides', id), s);
      console.log(`Saved slide ${id}`);
    }
    
    console.log('Migration complete!');
    process.exit(0);
  } catch (e) {
    console.error('Migration failed:', e);
    process.exit(1);
  }
}

migrate();
