// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider } from "firebase/auth";  // นำเข้า Authentication และ GoogleAuthProvider
// import { getAnalytics } from "firebase/analytics";
// import { getDatabase } from "firebase/database";  // นำเข้า Realtime Database

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAIAAz_WbarBDJRC-X7sF-S48cjG8vVpUg",
//   authDomain: "regaproject-c2cf7.firebaseapp.com",
//   databaseURL: "https://regaproject-c2cf7-default-rtdb.asia-southeast1.firebasedatabase.app", // ใส่ databaseURL สำหรับ Realtime Database
//   projectId: "regaproject-c2cf7",
//   storageBucket: "regaproject-c2cf7.appspot.com",
//   messagingSenderId: "175514363636",
//   appId: "1:175514363636:web:dab7a1aa89523bb8f620a1",
//   measurementId: "G-885MPYYY13"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// // Initialize Firebase Authentication and set up Google Auth Provider
// const auth = getAuth(app);  // ใช้งาน Authentication
// const provider = new GoogleAuthProvider();  // ใช้ Google Auth Provider สำหรับการล็อกอิน

// // Initialize Firebase Realtime Database
// const database = getDatabase(app);  // เพิ่มการใช้งาน Realtime Database

// // ส่งออก auth, provider และ database เพื่อใช้ในไฟล์อื่น
// export { auth, provider, database };






// นำเข้าฟังก์ชันที่คุณต้องการจาก SDK ที่คุณใช้งาน 
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";  // นำเข้า Authentication และ GoogleAuthProvider
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";  // นำเข้า Firestore

// การตั้งค่า Firebase ของเว็บแอปของคุณ
const firebaseConfig = {
  apiKey: "AIzaSyAIAAz_WbarBDJRC-X7sF-S48cjG8vVpUg", 
  authDomain: "regaproject-c2cf7.firebaseapp.com",
  projectId: "regaproject-c2cf7",
  storageBucket: "regaproject-c2cf7.appspot.com",
  messagingSenderId: "175514363636",
  appId: "1:175514363636:web:dab7a1aa89523bb8f620a1",
  measurementId: "G-885MPYYY13"
};

// เริ่มต้นใช้งาน Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// เริ่มต้นใช้งาน Firebase Authentication และตั้งค่า Google Auth Provider
const auth = getAuth(app);  // ใช้งาน Authentication
const provider = new GoogleAuthProvider();  // ใช้ Google Auth Provider สำหรับการล็อกอิน

// เริ่มต้นใช้งาน Firestore
const firestore = getFirestore(app);  // ใช้ Firestore แทน Realtime Database

// ส่งออก auth, provider และ firestore เพื่อใช้ในไฟล์อื่น ๆ
export { auth, provider, firestore };
