
import { initializeApp } from "https://esm.sh/firebase@10.8.0/app";
import { getDatabase, ref, onValue, set, push, update, get } from "https://esm.sh/firebase@10.8.0/database";

const firebaseConfig = {
  // ملاحظة: يفضل وضع هذه البيانات في متغيرات بيئة (Environment Variables)
  apiKey: "AIzaSyAs-DEMO-KEY", 
  authDomain: "akly-plus.firebaseapp.com",
  databaseURL: "https://akly-plus-default-rtdb.firebaseio.com",
  projectId: "akly-plus",
  storageBucket: "akly-plus.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

let db: any = null;
try {
  const app = initializeApp(firebaseConfig);
  db = getDatabase(app);
} catch (e) {
  console.warn("Firebase initialization failed. Using local simulation.");
}

// خدمة المزامنة الحية للبيانات
export const dbService = {
  // جلب البيانات مرة واحدة
  getOnce: async (path: string) => {
    if (!db) return null;
    const snapshot = await get(ref(db, path));
    return snapshot.exists() ? snapshot.val() : null;
  },

  // الاستماع للتغييرات (مهم جداً للطلبات الجديدة)
  subscribe: (path: string, callback: (data: any) => void) => {
    if (!db) return () => {};
    const dataRef = ref(db, path);
    return onValue(dataRef, (snapshot) => {
      callback(snapshot.val());
    });
  },

  // حفظ أو تحديث بيانات
  save: async (path: string, data: any) => {
    if (!db) {
      // Fallback to localStorage if Firebase is not connected
      const existing = JSON.parse(localStorage.getItem(path) || '[]');
      localStorage.setItem(path, JSON.stringify(data));
      return;
    }
    await set(ref(db, path), data);
  },

  // إضافة عنصر جديد (مثل طلب جديد)
  push: async (path: string, data: any) => {
    if (!db) return null;
    const listRef = ref(db, path);
    const newItemRef = push(listRef);
    await set(newItemRef, { ...data, id: newItemRef.key });
    return newItemRef.key;
  },

  // تحديث جزئي (مثل حالة الطلب)
  update: async (path: string, data: any) => {
    if (!db) return;
    await update(ref(db, path), data);
  }
};
