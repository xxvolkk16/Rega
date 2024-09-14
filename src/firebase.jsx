// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";  // นำเข้า Authentication และ GoogleAuthProvider
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIAAz_WbarBDJRC-X7sF-S48cjG8vVpUg",
  authDomain: "regaproject-c2cf7.firebaseapp.com",
  projectId: "regaproject-c2cf7",
  storageBucket: "regaproject-c2cf7.appspot.com",
  messagingSenderId: "175514363636",
  appId: "1:175514363636:web:dab7a1aa89523bb8f620a1",
  measurementId: "G-885MPYYY13"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and set up Google Auth Provider
const auth = getAuth(app);  // ใช้งาน Authentication
const provider = new GoogleAuthProvider();  // ใช้ Google Auth Provider สำหรับการล็อกอิน

// ส่งออก auth และ provider เพื่อใช้ในไฟล์อื่น
export { auth, provider };
