// import React from "react";
// import "./home.css"
// import Navbar from "../../Components/navbar.jsx";
// import mybackground from '../../picture/officesyndrome.png';
// import Picset from '../../Components/picset/picset.jsx'; // ปรับเส้นทางให้ถูกต้อง


// const Home = () => {
//     return (
//       <div className="home-container">
//         <Navbar />
//         <div className="content-container">
//           {/* เพิ่ม Picset ด้านซ้าย */}
//           <div className="picset-container">
//             <Picset />
//           </div>
//           {/* เนื้อหาส่วนอื่น */}
//           <div className="text-content">
//                      <div className="background">
//                  <img src={mybackground} alt="" className="banner-img"/>
//          </div>
//             <div className="titlepain">
//               <h1 className="headpain">OFFICE SYNDROME</h1>
//               <p>
//                 ทำกิจวัตรที่ช่วยยืดเหยียดกล้ามเนื้อเพื่อลดอาการปวดจากการใช้
//                 เวลานานๆ ในการนั่งทำงาน
//               </p>
//               <button className="detail-button">อ่านรายละเอียดเพิ่มเติม</button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };
  
//   export default Home;



// import React, { useEffect, useState } from "react";
// import "./home.css";
// import Navbar from "../../Components/navbar.jsx";
// import mybackground from '../../picture/officesyndrome.png';
// import Picset from '../../Components/picset/picset.jsx';
// import { useUserAuth } from "../../context/userAuthContext.jsx"; // นำเข้า context ของผู้ใช้
// import { useNavigate } from 'react-router-dom';
// import { auth } from "../../firebase"; // นำเข้า firebase auth

// const Home = () => {
//   const { user } = useUserAuth(); // ดึงข้อมูลของผู้ใช้จาก context
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true); // สถานะ loading เพื่อรอเช็คข้อมูล

//   useEffect(() => {
//     // ฟังก์ชันตรวจสอบผู้ใช้ล็อกอินจาก Firebase
//     const checkUserStatus = () => {
//       // ตรวจสอบสถานะผู้ใช้จาก Firebase Auth
//       auth.onAuthStateChanged((user) => {
//         if (!user) {
//           navigate("/login"); // ถ้าไม่มีผู้ใช้ ให้เปลี่ยนไปที่หน้า login
//         } else {
//           // ดึง login timestamp จาก localStorage
//           const loginTimestamp = localStorage.getItem('loginTimestamp');
//           const currentTime = Date.now();

//           // ถ้าไม่มี timestamp หรือเกิน 1 ชั่วโมงแล้ว ให้เปลี่ยนไปที่หน้า login
//           if (!loginTimestamp || currentTime - loginTimestamp > 3600000) {
//             navigate("/login");
//           }
//         }
//         setLoading(false); // หยุดสถานะ loading เมื่อเช็คเสร็จ
//       });
//     };

//     checkUserStatus();
//   }, [navigate]);

//   if (loading) {
//     return <div>Loading...</div>; // แสดงหน้าจอ loading ขณะรอตรวจสอบข้อมูลผู้ใช้
//   }

//   return (
//     <div className="home-container">
//       <Navbar />
//       <div className="content-container">
//         <div className="picset-container">
//           <Picset />
//         </div>
//         <div className="text-content">
//           <div className="background">
//             <img src={mybackground} alt="" className="banner-img" />
//           </div>
//           <div className="titlepain">
//             <h1 className="headpain">OFFICE SYNDROME</h1>
//             <p>ทำกิจวัตรที่ช่วยยืดเหยียดกล้ามเนื้อเพื่อลดอาการปวดจากการใช้เวลานานๆ ในการนั่งทำงาน</p>
//             <button className="detail-button">อ่านรายละเอียดเพิ่มเติม</button>
//           </div>
//           {user && (
//             <div className="user-info">
//               <p>Logged in as: {user.email}</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;
import React, { useEffect, useState } from "react";
import "./home.css";
import Navbar from "../../Components/navbar.jsx";
import mybackground from '../../picture/officesyndrome.png';
import Picset from '../../Components/picset/picset.jsx';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from "../../firebase"; // นำเข้า firebase auth และ firestore
import { doc, getDoc } from "firebase/firestore"; // ฟังก์ชันสำหรับดึงข้อมูล Firestore

const Home = () => {
  const [user, setUser] = useState(null); // เก็บสถานะผู้ใช้
  const [username, setUsername] = useState(''); // เก็บชื่อผู้ใช้
  const [guestName, setGuestName] = useState('Guest'); // เก็บชื่อผู้ใช้ที่ไม่ได้ล็อกอิน
  const [loading, setLoading] = useState(true); // สถานะ loading เพื่อรอเช็คข้อมูล
  const navigate = useNavigate();

  useEffect(() => {
    // ฟังก์ชันตรวจสอบสถานะการล็อกอินของผู้ใช้
    const checkUserStatus = async () => {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          // ผู้ใช้ล็อกอินแล้ว
          setUser(user);

          // ดึงข้อมูล username จาก Firestore
          try {
            const userRef = doc(firestore, "User", user.uid); // ใช้ UID ของผู้ใช้ใน Firestore
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              setUsername(userSnap.data().username); // ตั้งค่า username จาก Firestore
            } else {
              console.log("No such document!");
            }
          } catch (error) {
            console.error("Error fetching username:", error);
          }
        } else {
          // ถ้าผู้ใช้ไม่ได้ล็อกอิน ให้ตั้งชื่อ guest จาก LocalStorage หรือค่าเริ่มต้น
          const storedGuestName = localStorage.getItem('guestName');
          if (storedGuestName) {
            setGuestName(storedGuestName);
          } else {
            const newGuestName = `Guest_${Date.now()}`; // สร้างชื่อ guest ใหม่
            localStorage.setItem('guestName', newGuestName); // บันทึกชื่อ guest ลง localStorage
            setGuestName(newGuestName);
          }
          setUser(null);
        }
        setLoading(false); // หยุดสถานะ loading เมื่อเช็คเสร็จ
      });
    };

    checkUserStatus();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // แสดงหน้าจอ loading ขณะรอตรวจสอบข้อมูลผู้ใช้
  }

  return (
    <div className="home-container">
      <Navbar />
      <div className="content-container">
        <div className="picset-container">
          <Picset />
        </div>
        <div className="text-content">
          <div className="background">
            <img src={mybackground} alt="" className="banner-img" />
          </div>
          <div className="titlepain">
            <h1 className="headpain">OFFICE SYNDROME</h1>
            <p>ทำกิจวัตรที่ช่วยยืดเหยียดกล้ามเนื้อเพื่อลดอาการปวดจากการใช้เวลานานๆ ในการนั่งทำงาน</p>
            <button className="detail-button">อ่านรายละเอียดเพิ่มเติม</button>
          </div>

          {/* แสดงข้อมูลผู้ใช้ถ้าล็อกอินแล้ว */}
          {user ? (
            <div className="user-info">
              <p>Logged in as: {username || user.email}</p> {/* แสดง username ถ้ามี หรือแสดง email */}
            </div>
          ) : (
            <div className="guest-info">
              <p>สวัสดี {guestName}!</p> {/* แสดงชื่อ guest จาก LocalStorage */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
