
import { initializeApp } from "https://esm.sh/firebase@10.8.0/app";
import { getDatabase, ref, onValue, set, push, update, get } from "https://esm.sh/firebase@10.8.0/database";

/**
 * تم تحديث الإعدادات بناءً على بيانات مشروعك: aklyplus
 */

const firebaseConfig = {
  apiKey: "AIzaSyAaLJFkriLUqrqxt_nrj-IiE_1R0ikfx0g",
  authDomain: "aklyplus.firebaseapp.com",
  databaseURL: "https://aklyplus-default-rtdb.firebaseio.com",
  projectId: "aklyplus",
  storageBucket: "aklyplus.firebasestorage.app",
  messagingSenderId: "727820766037",
  appId: "1:727820766037:web:ddf1205b5d3cb5d2877ddc",
  measurementId: "G-27LJ95L1CL"
};

let db: any = null;

try {
  const app = initializeApp(firebaseConfig);
  db = getDatabase(app);
  console.log("✅ متصل الآن بسحابة Firebase (مشروع AklyPlus)");
} catch (e) {
  console.error("❌ فشل في تهيئة Firebase:", e);
}

export const dbService = {
  // جلب البيانات مرة واحدة
  getOnce: async (path: string) => {
    if (!db) return JSON.parse(localStorage.getItem(`akly_db_${path}`) || 'null');
    try {
      const snapshot = await get(ref(db, path));
      return snapshot.exists() ? snapshot.val() : null;
    } catch (e) {
      return null;
    }
  },

  // الاشتراك الحي في البيانات (التحديث التلقائي)
  subscribe: (path: string, callback: (data: any) => void) => {
    if (!db) {
      const localData = JSON.parse(localStorage.getItem(`akly_db_${path}`) || 'null');
      callback(localData);
      return () => {};
    }
    const dataRef = ref(db, path);
    return onValue(dataRef, (snapshot) => {
      const val = snapshot.val();
      // حفظ نسخة احتياطية محلية للطوارئ
      localStorage.setItem(`akly_db_${path}`, JSON.stringify(val));
      callback(val);
    });
  },

  // حفظ البيانات مباشرة
  save: async (path: string, data: any) => {
    if (!db) {
      localStorage.setItem(`akly_db_${path}`, JSON.stringify(data));
      return;
    }
    await set(ref(db, path), data);
  },

  // إضافة عنصر جديد للقائمة (تلقائي المعرف)
  push: async (path: string, data: any) => {
    if (!db) {
      const existing = JSON.parse(localStorage.getItem(`akly_db_${path}`) || '{}');
      const id = `local-${Date.now()}`;
      existing[id] = { ...data, id };
      localStorage.setItem(`akly_db_${path}`, JSON.stringify(existing));
      return id;
    }
    const listRef = ref(db, path);
    const newItemRef = push(listRef);
    const id = newItemRef.key;
    await set(newItemRef, { ...data, id });
    return id;
  },

  // تحديث جزئي للبيانات (تغيير حالة طلب أو تحديث رصيد)
  update: async (path: string, data: any) => {
    if (!db) {
      const parts = path.split('/');
      const root = parts[0];
      const existing = JSON.parse(localStorage.getItem(`akly_db_${root}`) || '{}');
      localStorage.setItem(`akly_db_${root}`, JSON.stringify({ ...existing, ...data }));
      return;
    }
    await update(ref(db, path), data);
  }
};
