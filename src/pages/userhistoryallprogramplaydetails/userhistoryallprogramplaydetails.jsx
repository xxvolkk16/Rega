// // pages/userhistoryallprogramplaydetails/userhistoryallprogramplaydetails.jsx
// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
// import { firestore } from "../../firebase";
// import Navbar from "../../Components/navbar.jsx";
// import "./userhistoryallprogramplaydetails.css";

// const UserHistoryAllProgramPlayDetails = () => {
//   const [historyData, setHistoryData] = useState([]);
//   const [programData, setProgramData] = useState(null);
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const location = useLocation();
//   const navigate = useNavigate();
  
//   const { userId, programId } = location.state || {};

//   // เพิ่มฟังก์ชัน getLocalImage เหมือนในไฟล์ต้นแบบ
//   const getLocalImage = (imageName) => {
//     try {
//       return new URL(`../../img/${imageName}`, import.meta.url).href;
//     } catch (error) {
//       console.error("Error loading image:", imageName, error);
//       return '/img/placeholder-image.jpg';
//     }
//   };

//   // ดึงข้อมูล user แยกออกมาเหมือนในไฟล์ต้นแบบ
//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (!userId) return;

//       try {
//         const userRef = doc(firestore, "users", userId);
//         const userSnap = await getDoc(userRef);
        
//         if (userSnap.exists()) {
//           setUserData(userSnap.data());
//         } else {
//           console.log("ไม่พบข้อมูลผู้ใช้ใน Firestore");
//         }
//       } catch (error) {
//         console.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:", error);
//       }
//     };

//     fetchUserData();
//   }, [userId]);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!userId || !programId) {
//         console.log("ไม่พบ userId หรือ programId");
//         navigate('/');
//         return;
//       }

//       try {
//         // 1. ดึงข้อมูลโปรแกรม
//         const programDoc = doc(firestore, "Yoga Program", programId);
//         const programSnap = await getDoc(programDoc);
//         if (programSnap.exists()) {
//           const programDataTemp = programSnap.data();
//           setProgramData({
//             id: programSnap.id,
//             ...programDataTemp,
//             Picture: getLocalImage(programDataTemp.Picture) || programDataTemp.Picture // ใช้ getLocalImage กับรูปโปรแกรม
//           });
//         }

//         // 2. ดึงประวัติการเล่นทั้งหมด
//         const userDoc = doc(firestore, "Users", userId);
//         const historyQuery = query(
//           collection(firestore, "YogaProgramHistory"),
//           where("User", "==", userDoc),
//           where("Program_id", "==", programDoc)
//         );

//         const querySnapshot = await getDocs(historyQuery);
//         const histories = [];

//         querySnapshot.forEach((doc) => {
//           const data = doc.data();
//           histories.push({
//             id: doc.id,
//             ...data,
//             Date: data.Date,
//             Ovr_score: data.Ovr_score
//           });
//         });

//         // เรียงลำดับตามวันที่เล่นล่าสุด
//         histories.sort((a, b) => {
//           const dateA = a.Date?.toDate() || new Date(0);
//           const dateB = b.Date?.toDate() || new Date(0);
//           return dateB - dateA;
//         });

//         setHistoryData(histories);
//       } catch (error) {
//         console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [userId, programId, navigate]);

//   const formatDate = (timestamp) => {
//     if (!timestamp) return 'ไม่ระบุ';
//     try {
//       if (timestamp.toDate) {
//         return timestamp.toDate().toLocaleString('th-TH', {
//           year: 'numeric',
//           month: 'long',
//           day: 'numeric',
//           hour: '2-digit',
//           minute: '2-digit'
//         }) + ' น.';
//       }
//       return new Date(timestamp).toLocaleString('th-TH');
//     } catch (error) {
//       console.error("เกิดข้อผิดพลาดในการแปลงวันที่:", error);
//       return 'ไม่ระบุ';
//     }
//   };

//   if (loading) {
//     return <div className="loading">กำลังโหลด...</div>;
//   }

//   return (
//     <div className="history-details-page">
//       <Navbar />
//       <div className="history-details-content">
//         <div className="header-section">
//           <button 
//             className="back-button"
//             onClick={() => navigate(-1)}
//           >
//             ย้อนกลับ
//           </button>
//           <h1>ประวัติการเล่นโปรแกรม</h1>
//         </div>

//         <div className="program-info-section">
//           <h2>{programData?.Name || "ไม่ระบุชื่อโปรแกรม"}</h2>
//           <div className="program-image">
//             <img 
//               src={programData?.Picture} 
//               alt={programData?.Name} 
//               onError={(e) => {
//                 e.target.onerror = null;
//                 e.target.src = '/img/placeholder-image.jpg';
//               }}
//             />
//           </div>
//           <p className="program-description">{programData?.Description || "ไม่มีคำอธิบาย"}</p>
//         </div>

//         <div className="user-info-section">
//           <h3>ข้อมูลผู้เล่น</h3>
//           <p><strong>ชื่อผู้ใช้:</strong> {userData?.username || 'N/A'}</p>
//           <p><strong>จำนวนครั้งที่เล่น:</strong> {historyData.length} ครั้ง</p>
//           <p><strong>คะแนนเฉลี่ย:</strong> {
//             historyData.length > 0 
//               ? (historyData.reduce((sum, history) => sum + (history.Ovr_score || 0), 0) / historyData.length).toFixed(2)
//               : 'N/A'
//           }</p>
//         </div>

//         <div className="history-list">
//           <h3>ประวัติการเล่นทั้งหมด</h3>
//           {historyData.length > 0 ? (
//             <div className="history-cards">
//               {historyData.map((history, index) => (
//                 <div key={history.id} className="history-card">
//                   <h4>ครั้งที่ {historyData.length - index}</h4>
//                   <p><strong>วันที่เล่น:</strong> {formatDate(history.Date)}</p>
//                   <p><strong>คะแนน:</strong> {history.Ovr_score?.toFixed(2) || 'ไม่ระบุ'}</p>
//                   {history.Comment && (
//                     <p><strong>หมายเหตุ:</strong> {history.Comment}</p>
//                   )}
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="no-history">
//               <p>ยังไม่มีประวัติการเล่น</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserHistoryAllProgramPlayDetails;

// // userhistoryallprogramplaydetails.jsx
// // userhistoryallprogramplaydetails.jsx
// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
// import { firestore } from "../../firebase";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
// import Navbar from "../../Components/navbar.jsx";
// import "./userhistoryallprogramplaydetails.css"

// const UserHistoryAllProgramPlayDetails = () => {
//   const [historyData, setHistoryData] = useState([]);
//   const [programData, setProgramData] = useState(null);
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const location = useLocation();
//   const navigate = useNavigate();
  
//   const { userId, programId } = location.state || {};

//   const getLocalImage = (imageName) => {
//     try {
//       return new URL(`../../img/${imageName}`, import.meta.url).href;
//     } catch (error) {
//       console.error("Error loading image:", imageName, error);
//       return '/img/placeholder-image.jpg';
//     }
//   };

//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (!userId) return;

//       try {
//         const userRef = doc(firestore, "users", userId);
//         const userSnap = await getDoc(userRef);
        
//         if (userSnap.exists()) {
//           setUserData({
//             id: userSnap.id,
//             ...userSnap.data()
//           });
//         } else {
//           console.log("ไม่พบข้อมูลผู้ใช้ใน Firestore");
//         }
//       } catch (error) {
//         console.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:", error);
//       }
//     };

//     fetchUserData();
//   }, [userId]);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!userId || !programId) {
//         console.log("ไม่พบ userId หรือ programId");
//         navigate('/');
//         return;
//       }

//       try {
//         // ดึงข้อมูลโปรแกรม
//         const programDoc = doc(firestore, "Yoga Program", programId);
//         const programSnap = await getDoc(programDoc);
//         if (programSnap.exists()) {
//           const data = programSnap.data();
//           setProgramData({
//             id: programSnap.id,
//             ...data,
//             Picture: getLocalImage(data.Picture) || data.Picture
//           });
//         }

//         // ดึงประวัติการเล่น
//         const userDoc = doc(firestore, "Users", userId);
//         const historyQuery = query(
//           collection(firestore, "YogaProgramHistory"),
//           where("User", "==", userDoc),
//           where("Program_id", "==", programDoc)
//         );

//         const querySnapshot = await getDocs(historyQuery);
//         const histories = [];

//         querySnapshot.forEach((doc) => {
//           const data = doc.data();
//           histories.push({
//             id: doc.id,
//             ...data
//           });
//         });

//         // เรียงลำดับตามวันที่เล่นล่าสุด
//         histories.sort((a, b) => {
//           const dateA = a.Date?.toDate() || new Date(0);
//           const dateB = b.Date?.toDate() || new Date(0);
//           return dateB - dateA;
//         });

//         setHistoryData(histories);
//       } catch (error) {
//         console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [userId, programId, navigate]);

//   const formatDate = (timestamp) => {
//     if (!timestamp) return 'ไม่ระบุ';
//     try {
//       if (timestamp.toDate) {
//         return timestamp.toDate().toLocaleString('th-TH', {
//           day: 'numeric',
//           month: 'short',
//           hour: '2-digit',
//           minute: '2-digit'
//         });
//       }
//       return new Date(timestamp).toLocaleString('th-TH');
//     } catch (error) {
//       return 'ไม่ระบุ';
//     }
//   };

//   const prepareChartData = () => {
//     return historyData.slice(-5).map(item => ({
//       date: formatDate(item.Date),
//       score: item.Ovr_score || 0
//     }));
//   };

//   if (loading) {
//     return <div className="loading">กำลังโหลด...</div>;
//   }

//   // Update the UserHistoryAllProgramPlayDetails component's JSX
// return (
//     <div className="history-details-page">
//       <Navbar />
//       <div 
//         className="history-details-content"
//         style={{
//           backgroundImage: programData?.Picture ? `url(${programData.Picture})` : 'none'
//         }}
//       >
//         <div className="history-details-overlay">
//           <div className="history-details-header">
//             <div className="history-details-user-info">
//               <h2>USERID: {userData?.id}</h2>
//               <p>Username: {userData?.username}</p>
//               <p>Created At: {formatDate(userData?.createdAt)}</p>
//               <p>Role: {userData?.role || 'User'}</p>
//             </div>
//           </div>
  
//           <div className="history-details-program">
//             <img 
//               src={programData?.Picture} 
//               alt={programData?.Name}
//               className="program-thumbnail"
//               onError={(e) => {
//                 e.target.onerror = null;
//                 e.target.src = '/img/placeholder-image.jpg';
//               }}
//             />
//             <div className="program-details">
//               <h3>{programData?.Name}</h3>
//               <p>วันที่เล่น: {historyData[0] ? formatDate(historyData[0].Date) : 'N/A'}</p>
//             </div>
//           </div>
  
//           <div className="history-details-graph">
//             <ResponsiveContainer width="100%" height={400}>
//               <LineChart data={prepareChartData()}>
//                 <CartesianGrid 
//                   horizontal={true}
//                   vertical={false}
//                   stroke="rgba(255, 255, 255, 0.1)" 
//                 />
//                 <XAxis 
//                   dataKey="date" 
//                   axisLine={false}
//                   tickLine={false}
//                   tick={{ fill: '#ffffff90', fontSize: 12 }}
//                 />
//                 <YAxis 
//                   domain={[0, 100]}
//                   axisLine={false}
//                   tickLine={false}
//                   tick={{ fill: '#ffffff90', fontSize: 12 }}
//                   ticks={[0, 20, 40, 60, 80, 100]}
//                 />
//                 <Line 
//                   type="monotone" 
//                   dataKey="score" 
//                   stroke="#fff" 
//                   strokeWidth={2}
//                   dot={{ fill: '#fff', stroke: '#fff', strokeWidth: 2, r: 4 }}
//                   activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserHistoryAllProgramPlayDetails;

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { firestore } from "../../firebase";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import Navbar from "../../Components/navbar.jsx";
import "./userhistoryallprogramplaydetails.css";

const UserHistoryAllProgramPlayDetails = () => {
  const [historyData, setHistoryData] = useState([]);
  const [programData, setProgramData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { userId, programId } = location.state || {};

  const getLocalImage = (imageName) => {
    try {
      return new URL(`../../img/${imageName}`, import.meta.url).href;
    } catch (error) {
      console.error("Error loading image:", imageName, error);
      return '/img/placeholder-image.jpg';
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        const userRef = doc(firestore, "users", userId);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          setUserData({
            id: userSnap.id,
            ...userSnap.data()
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId || !programId) {
        navigate('/');
        return;
      }

      try {
        // Fetch program data
        const programDoc = doc(firestore, "Yoga Program", programId);
        const programSnap = await getDoc(programDoc);
        if (programSnap.exists()) {
          const data = programSnap.data();
          setProgramData({
            id: programSnap.id,
            ...data,
            Picture: getLocalImage(data.Picture) || data.Picture
          });
        }

        // Fetch history data
        const userDoc = doc(firestore, "Users", userId);
        const historyQuery = query(
          collection(firestore, "YogaProgramHistory"),
          where("User", "==", userDoc),
          where("Program_id", "==", programDoc)
        );

        const querySnapshot = await getDocs(historyQuery);
        const histories = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          histories.push({
            id: doc.id,
            ...data
          });
        });

        // Sort by date ascending (oldest to newest)
        histories.sort((a, b) => {
          const dateA = a.Date?.toDate() || new Date(0);
          const dateB = b.Date?.toDate() || new Date(0);
          return dateA - dateB;
        });

        setHistoryData(histories);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, programId, navigate]);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'ไม่ระบุ';
    try {
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleString('th-TH', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) + ' น.';
      }
      return new Date(timestamp).toLocaleString('th-TH');
    } catch (error) {
      return 'ไม่ระบุ';
    }
  };

  const formatDateForChart = (timestamp) => {
    if (!timestamp) return 'ไม่ระบุ';
    try {
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleString('th-TH', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
      }
      return new Date(timestamp).toLocaleString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return 'ไม่ระบุ';
    }
  };

  const prepareChartData = () => {
    // เลือก 5 รายการล่าสุดและจัดเรียงจากเก่าไปใหม่
    return historyData.slice(-5).map(item => ({
      date: formatDateForChart(item.Date),
      score: item.Ovr_score || 0
    }));
  };

  if (loading) {
    return <div className="pega-loading">กำลังโหลด...</div>;
  }

  return (
    <div className="pega-history-page">
      <Navbar />
      <div 
        className="pega-history-content"
        style={{
          backgroundImage: programData?.Picture ? `url(${programData.Picture})` : 'none'
        }}
      >
        <div className="pega-history-overlay">
          <div className="pega-history-header">
            <h2>ประวัติการเล่น</h2>
            
            <div className="pega-user-info">
              <h2>USERID: {userData?.id || 'N/A'}</h2>
              <p>Username: {userData?.username || 'N/A'}</p>
              <p>Created At: {formatDate(userData?.createdAt)}</p>
              <p>Role: {userData?.role || 'User'}</p>
            </div>
          </div>
          
          <div className="pega-program-card">
            <img 
              src={programData?.Picture} 
              alt={programData?.Name}
              className="pega-program-thumbnail"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/img/placeholder-image.jpg';
              }}
            />
            <div className="pega-program-details">
              <h3>{programData?.Name || 'N/A'}</h3>
              <p>สิ้นสุดเมื่อ: {historyData[historyData.length - 1] ? formatDate(historyData[historyData.length - 1].Date) : 'N/A'}</p>
            </div>
          </div>
          
          <div className="pega-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={prepareChartData()}>
                <CartesianGrid 
                  horizontal={true}
                  vertical={false}
                  stroke="rgba(255, 255, 255, 0.1)" 
                />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#ffffff90', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#ffffff90', fontSize: 12 }}
                  ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#ffffff" 
                  strokeWidth={2}
                  dot={{ fill: '#fff', stroke: '#fff', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHistoryAllProgramPlayDetails;