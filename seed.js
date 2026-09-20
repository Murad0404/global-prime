import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import fs from "fs";
import path from "path";

// Add your config here
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
const storage = getStorage(app);

const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function seed() {
  const dataPath = path.join(process.cwd(), 'data.json');
  if (!fs.existsSync(dataPath)) {
    console.log("data.json topilmadi!");
    return;
  }

  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  console.log(`Jami ${data.length} ta mahsulot topildi. Boshlaymiz...`);

  // Barcha kategoriyalarni to'plash
  const uniqueCategories = [...new Set(data.map(p => p.category))];
  console.log("Kategoriyalar:", uniqueCategories);

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    console.log(`[${i+1}/${data.length}] Yuklanmoqda: ${item.name}`);

    let imageUrl = "";
    if (item.localImage && fs.existsSync(item.localImage)) {
      try {
        const fileBuffer = fs.readFileSync(item.localImage);
        const fileName = `products/${Date.now()}_${path.basename(item.localImage)}`;
        const storageRef = ref(storage, fileName);
        
        // Upload
        const snapshot = await uploadBytes(storageRef, fileBuffer, { contentType: 'image/jpeg' });
        imageUrl = await getDownloadURL(snapshot.ref);
        console.log(`  Rasm yuklandi: ${imageUrl}`);
      } catch (err) {
        console.error(`  Rasm yuklashda xatolik:`, err);
      }
    }

    try {
      await addDoc(collection(db, "products"), {
        name: item.name || "",
        russianName: item.russianName || "",
        price: item.price || "0",
        oldPrice: item.oldPrice || "",
        category: item.category || "Boshqa",
        description: item.description || "",
        features: item.features || [],
        stockStatus: item.stockStatus || "in_stock",
        image1: imageUrl,
        image2: "",
        image3: "",
        createdAt: new Date().toISOString()
      });
      console.log(`  Mahsulot bazaga saqlandi!`);
    } catch (err) {
      console.error(`  Mahsulot saqlashda xatolik:`, err);
    }
    
    await delay(500); // 0.5s kutish, Firebase bloklab qo'ymasligi uchun
  }

  console.log("Barcha mahsulotlar muvaffaqiyatli yuklandi!");
  process.exit(0);
}

seed();
