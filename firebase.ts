// Import các hàm cần thiết
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // <--- BỔ SUNG QUAN TRỌNG

// Cấu hình Firebase của sếp (Đã chuẩn)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Debug Config (Chỉ in ra console để check, không lộ key nhạy cảm nếu không cần thiết)
console.log("Firebase Config Loaded:", {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  apiKeyExists: !!firebaseConfig.apiKey // Check xem có key không
});

// 1. Khởi động Firebase
export const app = initializeApp(firebaseConfig);

// 2. Khởi động Kho dữ liệu & Xuất ra để dùng (Đây là cái sếp thiếu)
export const db = getFirestore(app);

// 3. Khởi động Auth & Xuất ra
import { getAuth } from "firebase/auth";
export const auth = getAuth(app);