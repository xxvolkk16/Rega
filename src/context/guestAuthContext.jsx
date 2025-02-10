import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, firestore } from '../firebase'; // นำเข้า auth และ firestore จาก firebase.jsx
import { doc, getDoc } from 'firebase/firestore'; // ฟังก์ชันที่ใช้ดึงข้อมูลจาก Firestore

const GuestContext = createContext();

export const GuestProvider = ({ children }) => {
  const [guestName, setGuestName] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log("User UID:", user.uid); // ตรวจสอบว่า uid ถูกต้อง
        try {
          const userDocRef = doc(firestore, "User", user.uid); // ดึงข้อมูลเอกสารจาก Firestore
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("Username from Firestore:", userData.username); // เช็คว่า username ถูกดึงมา
            setGuestName(userData.username); // อัปเดต guestName ด้วย username ที่ดึงมาจาก Firestore
          } else {
            console.log("No such document in Firestore!");
          }
        } catch (error) {
          console.error("Error fetching Firestore document:", error);
        }
      } else {
        // กรณีที่ไม่มีผู้ใช้ล็อกอิน (guest)
        const storedGuestName = localStorage.getItem('guestName');
        if (storedGuestName) {
          setGuestName(storedGuestName);
        } else {
          const newGuestName = `Guest_${Date.now()}`;
          localStorage.setItem('guestName', newGuestName);
          setGuestName(newGuestName);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    guestName,
    loading,
  };

  return <GuestContext.Provider value={value}>{!loading && children}</GuestContext.Provider>;
};

export const useGuest = () => useContext(GuestContext);
