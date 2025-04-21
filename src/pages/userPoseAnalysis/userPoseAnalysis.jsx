// // pages/userPoseAnalysis/userPoseAnalysis.jsx
// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
// import { firestore, storage } from "../../firebase";
// import { ref, getDownloadURL } from "firebase/storage";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
// import Navbar from "../../Components/navbar.jsx";
// import "./userPoseAnalysis.css";

// const UserPoseAnalysis = () => {
//   const [poseAnalysisData, setPoseAnalysisData] = useState([]);
//   const [programData, setProgramData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const programId = location.state?.programId;

//   // เปลี่ยนจาก getLocalImage เป็น getImageFromStorage
//   const getImageFromStorage = async (imageName) => {
//     try {
//       // ดึงรูปภาพจาก Firebase Storage
//       const storageRef = ref(storage, `Yogapose/${imageName}`);
//       const url = await getDownloadURL(storageRef);
//       return url;
//     } catch (error) {
//       console.error("Error loading image from storage:", imageName, error);
//       return '/img/placeholder-image.jpg';
//     }
//   };

//   useEffect(() => {
//     const fetchPoseAnalysisData = async () => {
//       if (!programId) {
//         console.log("ไม่พบ programId");
//         navigate('/');
//         return;
//       }

//       try {
//         // 1. ดึงข้อมูลโปรแกรม
//         const programRef = doc(firestore, "Yoga Program", programId);
//         const programSnap = await getDoc(programRef);
        
//         if (programSnap.exists()) {
//           const data = programSnap.data();
//           // ดึงรูปภาพจาก Firebase Storage
//           const programImage = await getImageFromStorage(data.Picture);
//           setProgramData({
//             id: programSnap.id,
//             ...data,
//             Picture: programImage || data.Picture
//           });
//         }

//         // 2. ดึงข้อมูล YogaPoseHistory ที่เกี่ยวข้องกับโปรแกรมนี้
//         const historyRef = collection(firestore, "YogaPoseHistory");
//         const historyQuery = query(historyRef, where("Program", "==", programRef));
//         const historySnapshot = await getDocs(historyQuery);

//         // สร้าง map เก็บข้อมูลคะแนนของแต่ละท่า
//         const poseScores = {};
//         const monthlyScores = {};

//         // 3. ประมวลผลข้อมูลประวัติ
//         for (const doc of historySnapshot.docs) {
//           const historyData = doc.data();
          
//           if (historyData.Pose_id && historyData.Date) {
//             const date = historyData.Date.toDate();
//             const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

//             // เก็บคะแนนรายเดือน
//             if (!monthlyScores[monthKey]) {
//               monthlyScores[monthKey] = { total: 0, count: 0 };
//             }
//             monthlyScores[monthKey].total += historyData.Pose_score || 0;
//             monthlyScores[monthKey].count += 1;

//             try {
//               const poseRef = historyData.Pose_id;
//               const poseSnap = await getDoc(poseRef);
              
//               if (poseSnap.exists()) {
//                 const poseId = poseSnap.id;
//                 const poseData = poseSnap.data();

//                 // เริ่มเก็บข้อมูลท่าใหม่
//                 if (!poseScores[poseId]) {
//                   // ดึงรูปภาพของท่าจาก Firebase Storage
//                   const posePicture = await getImageFromStorage(poseData.Picture);
                  
//                   poseScores[poseId] = {
//                     poseData: {
//                       id: poseId,
//                       ...poseData,
//                       Picture: posePicture || poseData.Picture
//                     },
//                     totalScore: 0,
//                     count: 0
//                   };
//                 }

//                 // บันทึกคะแนน
//                 poseScores[poseId].totalScore += historyData.Pose_score || 0;
//                 poseScores[poseId].count += 1;
//               }
//             } catch (error) {
//               console.error("เกิดข้อผิดพลาดในการดึงข้อมูลท่า:", error);
//             }
//           }
//         }

//         // 4. คำนวณค่าเฉลี่ยรายเดือน
//         const monthlyAverages = Object.entries(monthlyScores)
//           .map(([month, data]) => ({
//             month,
//             score: data.total / data.count
//           }))
//           .sort((a, b) => a.month.localeCompare(b.month))
//           .slice(-5);

//         // 5. จัดเตรียมข้อมูลท่าทั้งหมด
//         const analysisResults = Object.entries(poseScores).map(([id, data]) => ({
//           id,
//           name: data.poseData.Name || 'ไม่ระบุชื่อท่า',
//           picture: data.poseData.Picture,
//           averageScore: data.count > 0 ? data.totalScore / data.count : 0
//         }));

//         // เรียงตามคะแนนจากมากไปน้อย
//         analysisResults.sort((a, b) => b.averageScore - a.averageScore);

//         // บันทึกข้อมูลลง state
//         setPoseAnalysisData({
//           poses: analysisResults,
//           monthlyData: monthlyAverages
//         });

//       } catch (error) {
//         console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPoseAnalysisData();
//   }, [programId, navigate]);

//   const getScoreColor = (score) => {
//     if (score >= 80) return 'green-score';
//     if (score >= 60) return 'yellow-score';
//     if (score >= 40) return 'orange-score';
//     return 'red-score';
//   };

//   if (loading) {
//     return <div className="loading">กำลังโหลด...</div>;
//   }

//   const programAverage = poseAnalysisData?.poses?.length > 0
//     ? poseAnalysisData.poses.reduce((sum, pose) => sum + pose.averageScore, 0) / poseAnalysisData.poses.length
//     : 0;

//   return (
//     <div className="pose-analysis-page">
//       <Navbar />
//       <div className="pose-analysis-content">
//         {/* Program Header with Score */}
//         <div className="program-header-card">
//           <div className="program-image-container">
//             <img 
//               src={programData?.Picture} 
//               alt={programData?.Name} 
//               onError={(e) => {
//                 e.target.onerror = null;
//                 e.target.src = '/img/placeholder-image.jpg';
//               }}
//             />
//           </div>
//           <div className="program-score-container">
//             <div className="program-score">
//               {Math.round(programAverage)}
//             </div>
//           </div>
//           <h1>{programData?.Name || 'โปรแกรมโยคะ'}</h1>
//         </div>

//         {/* Monthly Progress Graph */}
//         <div className="graph-card">
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={poseAnalysisData?.monthlyData}>
//               <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
//               <XAxis 
//                 dataKey="month" 
//                 tick={{ fill: '#fff' }}
//                 height={60}
//                 angle={-45}
//                 textAnchor="end"
//               />
//               <YAxis 
//                 domain={[0, 100]}
//                 tick={{ fill: '#fff' }}
//                 ticks={[0, 20, 40, 60, 80, 100]}
//               />
//               <Line 
//                 type="monotone" 
//                 dataKey="score" 
//                 stroke="#fff" 
//                 strokeWidth={2}
//                 dot={{ fill: '#fff', strokeWidth: 2 }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Pose Score Grid */}
//         <div className="pose-score-grid">
//           {poseAnalysisData?.poses?.map((pose) => (
//             <div 
//               key={pose.id} 
//               className={`pose-score-card ${getScoreColor(pose.averageScore)}`}
//             >
//               {pose.picture && (
//                 <div className="pose-image">
//                   <img 
//                     src={pose.picture}
//                     alt={pose.name}
//                     onError={(e) => {
//                       e.target.onerror = null;
//                       e.target.src = '/img/placeholder-image.jpg';
//                     }}
//                   />
//                 </div>
//               )}
//               <div className="pose-score-value">
//                 {Math.round(pose.averageScore)}%
//               </div>
//               <div className="pose-name">{pose.name}</div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserPoseAnalysis;



// // pages/userPoseAnalysis/userPoseAnalysis.jsx
// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
// import { firestore, storage } from "../../firebase";
// import { ref, getDownloadURL } from "firebase/storage";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
// import Navbar from "../../Components/navbar.jsx";
// import "./userPoseAnalysis.css";

// const UserPoseAnalysis = () => {
//   const [poseAnalysisData, setPoseAnalysisData] = useState({
//     poses: [],
//     monthlyData: []
//   });
//   const [programData, setProgramData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const programId = location.state?.programId;

//   // ใช้ cache สำหรับเก็บ URL ของรูปภาพ
//   const imageCache = new Map();

//   const getImageFromStorage = async (imageName) => {
//     // ตรวจสอบว่ามีรูปในแคชหรือไม่
//     if (imageCache.has(imageName)) {
//       return imageCache.get(imageName);
//     }

//     try {
//       const storageRef = ref(storage, `Yogapose/${imageName}`);
//       const url = await getDownloadURL(storageRef);
//       // เก็บ URL ลงในแคช
//       imageCache.set(imageName, url);
//       return url;
//     } catch (error) {
//       console.error("Error loading image from storage:", imageName, error);
//       const placeholderUrl = '/img/placeholder-image.jpg';
//       imageCache.set(imageName, placeholderUrl);
//       return placeholderUrl;
//     }
//   };

//   useEffect(() => {
//     const fetchPoseAnalysisData = async () => {
//       if (!programId) {
//         console.log("ไม่พบ programId");
//         navigate('/');
//         return;
//       }

//       try {
//         // 1. ดึงข้อมูลโปรแกรม
//         const programRef = doc(firestore, "Yoga Program", programId);
//         const programSnap = await getDoc(programRef);
        
//         let programDataWithImage = null;
//         if (programSnap.exists()) {
//           const data = programSnap.data();
//           // ดึงรูปภาพจาก Firebase Storage แยกออกมา (จะทำพร้อมกับการดึงข้อมูลอื่นๆ)
//           programDataWithImage = {
//             id: programSnap.id,
//             ...data,
//             Picture: data.Picture // เก็บชื่อรูปไว้ก่อน จะดึง URL จริงทีหลัง
//           };
//         }

//         // 2. ดึงข้อมูล YogaPoseHistory ที่เกี่ยวข้องกับโปรแกรมนี้
//         const historyRef = collection(firestore, "YogaPoseHistory");
//         const historyQuery = query(historyRef, where("Program", "==", programRef));
//         const historySnapshot = await getDocs(historyQuery);

//         // สร้าง map เก็บข้อมูลคะแนนของแต่ละท่า
//         const poseScores = new Map();
//         const monthlyScores = new Map();
//         const poseRefsToFetch = new Set();

//         // 3. ประมวลผลข้อมูลประวัติและรวบรวม refs ของท่าที่ต้องดึง
//         historySnapshot.forEach(doc => {
//           const historyData = doc.data();
          
//           if (historyData.Pose_id && historyData.Date) {
//             const date = historyData.Date.toDate();
//             const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

//             // เก็บคะแนนรายเดือน
//             if (!monthlyScores.has(monthKey)) {
//               monthlyScores.set(monthKey, { total: 0, count: 0 });
//             }
//             const monthData = monthlyScores.get(monthKey);
//             monthlyScores.set(monthKey, {
//               total: monthData.total + (historyData.Pose_score || 0),
//               count: monthData.count + 1
//             });

//             // เก็บ reference ของท่าโยคะที่ต้องดึง
//             const poseRef = historyData.Pose_id;
//             const poseId = poseRef.id;
//             poseRefsToFetch.add(poseRef);

//             // เพิ่มคะแนนและจำนวนครั้ง
//             if (!poseScores.has(poseId)) {
//               poseScores.set(poseId, {
//                 totalScore: historyData.Pose_score || 0,
//                 count: 1,
//                 poseRef
//               });
//             } else {
//               const currentData = poseScores.get(poseId);
//               poseScores.set(poseId, {
//                 ...currentData,
//                 totalScore: currentData.totalScore + (historyData.Pose_score || 0),
//                 count: currentData.count + 1
//               });
//             }
//           }
//         });

//         // 4. ดึงข้อมูลท่าโยคะทั้งหมดพร้อมกัน
//         const poseFetchPromises = Array.from(poseRefsToFetch).map(async (poseRef) => {
//           try {
//             const poseSnap = await getDoc(poseRef);
//             return {
//               ref: poseRef,
//               data: poseSnap.exists() ? { ...poseSnap.data(), id: poseSnap.id } : null
//             };
//           } catch (error) {
//             console.error(`Error fetching pose ${poseRef.id}:`, error);
//             return { ref: poseRef, data: null };
//           }
//         });

//         // รอให้ดึงข้อมูลท่าทั้งหมดเสร็จ
//         const poseResults = await Promise.all(poseFetchPromises);

//         // สร้าง Map ของข้อมูลท่า
//         const poseDataMap = new Map();
//         poseResults.forEach(result => {
//           if (result.data) {
//             poseDataMap.set(result.ref.id, result.data);
//           }
//         });

//         // 5. รวบรวมชื่อรูปภาพที่ต้องดึง
//         const imageNamesToFetch = new Set();
        
//         // เพิ่มรูปโปรแกรม
//         if (programDataWithImage && programDataWithImage.Picture) {
//           imageNamesToFetch.add(programDataWithImage.Picture);
//         }
        
//         // เพิ่มรูปของท่าต่างๆ
//         poseDataMap.forEach(poseData => {
//           if (poseData.Picture) {
//             imageNamesToFetch.add(poseData.Picture);
//           }
//         });

//         // 6. ดึงรูปภาพทั้งหมดพร้อมกัน
//         const imagePromises = Array.from(imageNamesToFetch).map(async (imageName) => {
//           try {
//             const url = await getImageFromStorage(imageName);
//             return { imageName, url };
//           } catch (error) {
//             console.error(`Error fetching image ${imageName}:`, error);
//             return { imageName, url: '/img/placeholder-image.jpg' };
//           }
//         });

//         // รอให้ดึงรูปภาพทั้งหมดเสร็จ
//         const imageResults = await Promise.all(imagePromises);

//         // สร้าง Map ของ URL รูปภาพ
//         const imageUrlMap = new Map();
//         imageResults.forEach(result => {
//           imageUrlMap.set(result.imageName, result.url);
//         });

//         // 7. อัปเดตข้อมูลโปรแกรมด้วย URL รูปภาพ
//         if (programDataWithImage) {
//           setProgramData({
//             ...programDataWithImage,
//             Picture: imageUrlMap.get(programDataWithImage.Picture) || '/img/placeholder-image.jpg'
//           });
//         }

//         // 8. คำนวณค่าเฉลี่ยรายเดือน
//         const monthlyAverages = Array.from(monthlyScores.entries())
//           .map(([month, data]) => ({
//             month,
//             score: data.total / data.count
//           }))
//           .sort((a, b) => a.month.localeCompare(b.month))
//           .slice(-5);

//         // 9. จัดเตรียมข้อมูลท่าทั้งหมด
//         const analysisResults = [];
//         poseScores.forEach((scoreData, poseId) => {
//           const poseData = poseDataMap.get(poseId);
          
//           if (poseData) {
//             // คำนวณค่าเฉลี่ย
//             const averageScore = scoreData.totalScore / scoreData.count;
            
//             analysisResults.push({
//               id: poseId,
//               name: poseData.Name || 'ไม่ระบุชื่อท่า',
//               picture: imageUrlMap.get(poseData.Picture) || '/img/placeholder-image.jpg',
//               averageScore
//             });
//           }
//         });

//         // เรียงตามคะแนนจากมากไปน้อย
//         analysisResults.sort((a, b) => b.averageScore - a.averageScore);

//         // บันทึกข้อมูลลง state
//         setPoseAnalysisData({
//           poses: analysisResults,
//           monthlyData: monthlyAverages
//         });

//       } catch (error) {
//         console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPoseAnalysisData();
//   }, [programId, navigate]);

//   const getScoreColor = (score) => {
//     if (score >= 80) return 'green-score';
//     if (score >= 60) return 'yellow-score';
//     if (score >= 40) return 'orange-score';
//     return 'red-score';
//   };

//   if (loading) {
//     return <div className="loading">กำลังโหลด...</div>;
//   }

//   const programAverage = poseAnalysisData?.poses?.length > 0
//     ? poseAnalysisData.poses.reduce((sum, pose) => sum + pose.averageScore, 0) / poseAnalysisData.poses.length
//     : 0;

//   return (
//     <div className="pose-analysis-page">
//       <Navbar />
//       <div className="pose-analysis-content">
//         {/* Program Header with Score */}
//         <div className="program-header-card">
//           <div className="program-image-container">
//             <img 
//               src={programData?.Picture} 
//               alt={programData?.Name} 
//               onError={(e) => {
//                 e.target.onerror = null;
//                 e.target.src = '/img/placeholder-image.jpg';
//               }}
//             />
//           </div>
//           <div className="program-score-container">
//             <div className="program-score">
//               {Math.round(programAverage)}
//             </div>
//           </div>
//           <h1>{programData?.Name || 'โปรแกรมโยคะ'}</h1>
//         </div>

//         {/* Monthly Progress Graph */}
//         <div className="graph-card">
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={poseAnalysisData?.monthlyData}>
//               <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
//               <XAxis 
//                 dataKey="month" 
//                 tick={{ fill: '#fff' }}
//                 height={60}
//                 angle={-45}
//                 textAnchor="end"
//               />
//               <YAxis 
//                 domain={[0, 100]}
//                 tick={{ fill: '#fff' }}
//                 ticks={[0, 20, 40, 60, 80, 100]}
//               />
//               <Line 
//                 type="monotone" 
//                 dataKey="score" 
//                 stroke="#fff" 
//                 strokeWidth={2}
//                 dot={{ fill: '#fff', strokeWidth: 2 }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Pose Score Grid */}
//         <div className="pose-score-grid">
//           {poseAnalysisData?.poses?.map((pose) => (
//             <div 
//               key={pose.id} 
//               className={`pose-score-card ${getScoreColor(pose.averageScore)}`}
//             >
//               {pose.picture && (
//                 <div className="pose-image">
//                   <img 
//                     src={pose.picture}
//                     alt={pose.name}
//                     onError={(e) => {
//                       e.target.onerror = null;
//                       e.target.src = '/img/placeholder-image.jpg';
//                     }}
//                   />
//                 </div>
//               )}
//               <div className="pose-score-value">
//                 {Math.round(pose.averageScore)}%
//               </div>
//               <div className="pose-name">{pose.name}</div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserPoseAnalysis;


// pages/userPoseAnalysis/userPoseAnalysis.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { firestore, storage } from "../../firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import Navbar from "../../Components/navbar.jsx";
import "./userPoseAnalysis.css";

const UserPoseAnalysis = () => {
  const [poseAnalysisData, setPoseAnalysisData] = useState({
    poses: [],
    monthlyData: []
  });
  const [programData, setProgramData] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const programId = location.state?.programId;

  // ใช้ cache สำหรับเก็บ URL ของรูปภาพ
  const imageCache = new Map();

  const getImageFromStorage = async (imageName) => {
    // ตรวจสอบว่ามีรูปในแคชหรือไม่
    if (imageCache.has(imageName)) {
      return imageCache.get(imageName);
    }

    try {
      const storageRef = ref(storage, `Yogapose/${imageName}`);
      const url = await getDownloadURL(storageRef);
      // เก็บ URL ลงในแคช
      imageCache.set(imageName, url);
      return url;
    } catch (error) {
      console.error("Error loading image from storage:", imageName, error);
      const placeholderUrl = '/img/placeholder-image.jpg';
      imageCache.set(imageName, placeholderUrl);
      return placeholderUrl;
    }
  };

  useEffect(() => {
    const fetchPoseAnalysisData = async () => {
      if (!programId) {
        console.log("ไม่พบ programId");
        navigate('/');
        return;
      }

      try {
        // 1. ดึงข้อมูลโปรแกรม
        const programRef = doc(firestore, "Yoga Program", programId);
        const programSnap = await getDoc(programRef);
        
        let programDataWithImage = null;
        if (programSnap.exists()) {
          const data = programSnap.data();
          // ดึงรูปภาพจาก Firebase Storage แยกออกมา (จะทำพร้อมกับการดึงข้อมูลอื่นๆ)
          programDataWithImage = {
            id: programSnap.id,
            ...data,
            Picture: data.Picture // เก็บชื่อรูปไว้ก่อน จะดึง URL จริงทีหลัง
          };
        }

        // 2. ดึงข้อมูล YogaPoseHistory ที่เกี่ยวข้องกับโปรแกรมนี้
        const historyRef = collection(firestore, "YogaPoseHistory");
        const historyQuery = query(historyRef, where("Program", "==", programRef));
        const historySnapshot = await getDocs(historyQuery);

        // สร้าง map เก็บข้อมูลคะแนนของแต่ละท่า
        const poseScores = new Map();
        const monthlyScores = new Map();
        const poseRefsToFetch = new Set();

        // 3. ประมวลผลข้อมูลประวัติและรวบรวม refs ของท่าที่ต้องดึง
        historySnapshot.forEach(doc => {
          const historyData = doc.data();
          
          if (historyData.Pose_id && historyData.Date) {
            const date = historyData.Date.toDate();
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            // เก็บคะแนนรายเดือน
            if (!monthlyScores.has(monthKey)) {
              monthlyScores.set(monthKey, { total: 0, count: 0 });
            }
            const monthData = monthlyScores.get(monthKey);
            monthlyScores.set(monthKey, {
              total: monthData.total + (historyData.Pose_score || 0),
              count: monthData.count + 1
            });

            // เก็บ reference ของท่าโยคะที่ต้องดึง
            const poseRef = historyData.Pose_id;
            const poseId = poseRef.id;
            poseRefsToFetch.add(poseRef);

            // เพิ่มคะแนนและจำนวนครั้ง
            if (!poseScores.has(poseId)) {
              poseScores.set(poseId, {
                totalScore: historyData.Pose_score || 0,
                count: 1,
                poseRef
              });
            } else {
              const currentData = poseScores.get(poseId);
              poseScores.set(poseId, {
                ...currentData,
                totalScore: currentData.totalScore + (historyData.Pose_score || 0),
                count: currentData.count + 1
              });
            }
          }
        });

        // แสดงข้อมูลคะแนนรายเดือนดิบก่อนการคำนวณ
        console.log("=== ข้อมูลคะแนนรายเดือนดิบ ===");
        monthlyScores.forEach((data, month) => {
          console.log(`เดือน: ${month}, คะแนนรวม: ${data.total}, จำนวนครั้ง: ${data.count}`);
        });

        // 4. ดึงข้อมูลท่าโยคะทั้งหมดพร้อมกัน
        const poseFetchPromises = Array.from(poseRefsToFetch).map(async (poseRef) => {
          try {
            const poseSnap = await getDoc(poseRef);
            return {
              ref: poseRef,
              data: poseSnap.exists() ? { ...poseSnap.data(), id: poseSnap.id } : null
            };
          } catch (error) {
            console.error(`Error fetching pose ${poseRef.id}:`, error);
            return { ref: poseRef, data: null };
          }
        });

        // รอให้ดึงข้อมูลท่าทั้งหมดเสร็จ
        const poseResults = await Promise.all(poseFetchPromises);

        // สร้าง Map ของข้อมูลท่า
        const poseDataMap = new Map();
        poseResults.forEach(result => {
          if (result.data) {
            poseDataMap.set(result.ref.id, result.data);
          }
        });

        // 5. รวบรวมชื่อรูปภาพที่ต้องดึง
        const imageNamesToFetch = new Set();
        
        // เพิ่มรูปโปรแกรม
        if (programDataWithImage && programDataWithImage.Picture) {
          imageNamesToFetch.add(programDataWithImage.Picture);
        }
        
        // เพิ่มรูปของท่าต่างๆ
        poseDataMap.forEach(poseData => {
          if (poseData.Picture) {
            imageNamesToFetch.add(poseData.Picture);
          }
        });

        // 6. ดึงรูปภาพทั้งหมดพร้อมกัน
        const imagePromises = Array.from(imageNamesToFetch).map(async (imageName) => {
          try {
            const url = await getImageFromStorage(imageName);
            return { imageName, url };
          } catch (error) {
            console.error(`Error fetching image ${imageName}:`, error);
            return { imageName, url: '/img/placeholder-image.jpg' };
          }
        });

        // รอให้ดึงรูปภาพทั้งหมดเสร็จ
        const imageResults = await Promise.all(imagePromises);

        // สร้าง Map ของ URL รูปภาพ
        const imageUrlMap = new Map();
        imageResults.forEach(result => {
          imageUrlMap.set(result.imageName, result.url);
        });

        // 7. อัปเดตข้อมูลโปรแกรมด้วย URL รูปภาพ
        if (programDataWithImage) {
          setProgramData({
            ...programDataWithImage,
            Picture: imageUrlMap.get(programDataWithImage.Picture) || '/img/placeholder-image.jpg'
          });
        }

        // 8. คำนวณค่าเฉลี่ยรายเดือน
        const monthlyAverages = Array.from(monthlyScores.entries())
          .map(([month, data]) => {
            // คำนวณค่าเฉลี่ย
            const average = data.total / data.count;
            // แสดงข้อมูลในแต่ละเดือนพร้อมค่าเฉลี่ย
            console.log(`เดือน: ${month}, คะแนนรวม: ${data.total}, จำนวนครั้ง: ${data.count}, ค่าเฉลี่ย: ${average.toFixed(2)}`);
            return {
              month,
              score: average
            };
          })
          .sort((a, b) => a.month.localeCompare(b.month))
          .slice(-5);

        // แสดงข้อมูลที่เรียงแล้วและตัดเหลือ 5 เดือนล่าสุด
        console.log("=== ข้อมูลรายเดือนที่จะแสดงในกราฟ (5 เดือนล่าสุด) ===");
        monthlyAverages.forEach(item => {
          console.log(`เดือน: ${item.month}, คะแนนเฉลี่ย: ${item.score.toFixed(2)}`);
        });

        // 9. จัดเตรียมข้อมูลท่าทั้งหมด
        const analysisResults = [];
        poseScores.forEach((scoreData, poseId) => {
          const poseData = poseDataMap.get(poseId);
          
          if (poseData) {
            // คำนวณค่าเฉลี่ย
            const averageScore = scoreData.totalScore / scoreData.count;
            
            analysisResults.push({
              id: poseId,
              name: poseData.Name || 'ไม่ระบุชื่อท่า',
              picture: imageUrlMap.get(poseData.Picture) || '/img/placeholder-image.jpg',
              averageScore
            });
          }
        });

        // เรียงตามคะแนนจากมากไปน้อย
        analysisResults.sort((a, b) => b.averageScore - a.averageScore);

        // แสดงข้อมูลท่าโยคะที่เรียงลำดับแล้ว
        console.log("=== ข้อมูลคะแนนเฉลี่ยของแต่ละท่า (เรียงจากมากไปน้อย) ===");
        analysisResults.forEach(pose => {
          console.log(`ชื่อท่า: ${pose.name}, คะแนนเฉลี่ย: ${pose.averageScore.toFixed(2)}`);
        });

        // แสดงค่าเฉลี่ยรวมของโปรแกรม
        if (analysisResults.length > 0) {
          const avgTotal = analysisResults.reduce((sum, pose) => sum + pose.averageScore, 0) / analysisResults.length;
          console.log(`ค่าเฉลี่ยรวมของโปรแกรม: ${avgTotal.toFixed(2)}`);
        }

        // บันทึกข้อมูลลง state
        setPoseAnalysisData({
          poses: analysisResults,
          monthlyData: monthlyAverages
        });

      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPoseAnalysisData();
  }, [programId, navigate]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'green-score';
    if (score >= 60) return 'yellow-score';
    if (score >= 40) return 'orange-score';
    return 'red-score';
  };

  if (loading) {
    return <div className="loading">กำลังโหลด...</div>;
  }

  const programAverage = poseAnalysisData?.poses?.length > 0
    ? poseAnalysisData.poses.reduce((sum, pose) => sum + pose.averageScore, 0) / poseAnalysisData.poses.length
    : 0;

  console.log("คะแนนเฉลี่ยรวมของโปรแกรมที่คำนวณในการ render:", programAverage.toFixed(2));

  return (
    <div className="pose-analysis-page">
      <Navbar />
      <div className="pose-analysis-content">
        {/* Program Header with Score */}
        <div className="program-header-card">
          <div className="program-image-container">
            <img 
              src={programData?.Picture} 
              alt={programData?.Name} 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/img/placeholder-image.jpg';
              }}
            />
          </div>
          <div className="program-score-container">
            <div className="program-score">
              {Math.round(programAverage)}
            </div>
          </div>
          <h1>{programData?.Name || 'โปรแกรมโยคะ'}</h1>
        </div>

        {/* Monthly Progress Graph */}
        <div className="graph-card">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={poseAnalysisData?.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#fff' }}
                height={60}
                angle={-45}
                textAnchor="end"
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fill: '#fff' }}
                ticks={[0, 20, 40, 60, 80, 100]}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#fff" 
                strokeWidth={2}
                dot={{ fill: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pose Score Grid */}
        <div className="pose-score-grid">
          {poseAnalysisData?.poses?.map((pose) => (
            <div 
              key={pose.id} 
              className={`pose-score-card ${getScoreColor(pose.averageScore)}`}
            >
              {pose.picture && (
                <div className="pose-image">
                  <img 
                    src={pose.picture}
                    alt={pose.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/img/placeholder-image.jpg';
                    }}
                  />
                </div>
              )}
              <div className="pose-score-value">
                {Math.round(pose.averageScore)}%
              </div>
              <div className="pose-name">{pose.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserPoseAnalysis;