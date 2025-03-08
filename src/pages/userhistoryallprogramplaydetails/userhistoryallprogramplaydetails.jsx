// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
// import { firestore } from "../../firebase";
// import Navbar from "../../Components/navbar.jsx";
// import "./userhistoryallprogramplaydetails.css";

// const UserHistoryAllProgramPlayDetails = () => {
//   const [poseHistoryData, setPoseHistoryData] = useState([]);
//   const [groupedPoseHistory, setGroupedPoseHistory] = useState([]);
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

//   // Group history data by pose ID
//   const groupHistoryByPoseId = (historyData) => {
//     const groupedMap = {};
    
//     historyData.forEach(entry => {
//       if (!groupedMap[entry.poseId]) {
//         groupedMap[entry.poseId] = {
//           poseId: entry.poseId,
//           poseName: entry.poseName,
//           poseImage: entry.poseImage,
//           attempts: []
//         };
//       }
      
//       groupedMap[entry.poseId].attempts.push({
//         id: entry.id,
//         score: entry.score,
//         date: entry.date
//       });
//     });
    
//     // Convert map to array and sort by latest attempt date
//     return Object.values(groupedMap).sort((a, b) => {
//       const dateA = a.attempts[0].date?.toDate() || new Date(0);
//       const dateB = b.attempts[0].date?.toDate() || new Date(0);
//       return dateB - dateA; // Sort by most recent attempt
//     });
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
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//     };

//     fetchUserData();
//   }, [userId]);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!userId || !programId) {
//         navigate('/');
//         return;
//       }

//       try {
//         // Fetch program data
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

//         // Create user reference for queries
//         const userDoc = doc(firestore, "Users", userId);

//         // Fetch pose history data related to this program for this user
//         const poseHistoryRef = collection(firestore, "YogaPoseHistory");
//         const historyQuery = query(
//           poseHistoryRef, 
//           where("Program", "==", programDoc),
//           where("User", "==", userDoc)
//         );
        
//         const historySnapshot = await getDocs(historyQuery);

//         // Array to store all history entries
//         const historyEntries = [];

//         // Process each history record
//         for (const docSnapshot of historySnapshot.docs) {
//           const historyData = docSnapshot.data();
          
//           if (historyData.Pose_id) {
//             try {
//               // Get pose details
//               const poseRef = historyData.Pose_id;
//               const poseSnap = await getDoc(poseRef);
              
//               if (poseSnap.exists()) {
//                 const poseData = poseSnap.data();
                
//                 // Add the history entry with pose data
//                 historyEntries.push({
//                   id: docSnapshot.id,
//                   poseId: poseSnap.id,
//                   poseName: poseData.Name || 'ไม่ระบุชื่อท่า',
//                   poseImage: getLocalImage(poseData.Picture) || poseData.Picture,
//                   score: historyData.Pose_score || 0,
//                   date: historyData.Date || null
//                 });
//               }
//             } catch (error) {
//               console.error("Error fetching pose data:", error);
//             }
//           }
//         }

//         // Sort by date (newest first)
//         historyEntries.sort((a, b) => {
//           const dateA = a.date?.toDate() || new Date(0);
//           const dateB = b.date?.toDate() || new Date(0);
//           return dateB - dateA;
//         });

//         setPoseHistoryData(historyEntries);
        
//         // Group history data by pose ID
//         const grouped = groupHistoryByPoseId(historyEntries);
//         setGroupedPoseHistory(grouped);
//       } catch (error) {
//         console.error("Error fetching data:", error);
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
//           year: 'numeric',
//           hour: '2-digit',
//           minute: '2-digit'
//         }) + ' น.';
//       }
//       return new Date(timestamp).toLocaleString('th-TH');
//     } catch (error) {
//       return 'ไม่ระบุ';
//     }
//   };

//   const getScoreColor = (score) => {
//     if (score >= 80) return 'green-score';
//     if (score >= 60) return 'yellow-score';
//     if (score >= 40) return 'orange-score';
//     return 'red-score';
//   };

//   if (loading) {
//     return <div className="pega-loading">กำลังโหลด...</div>;
//   }

//   return (
//     <div className="pega-history-page">
//       <Navbar />
//       <div 
//         className="pega-history-content"
//         style={{
//           backgroundImage: programData?.Picture ? `url(${programData.Picture})` : 'none'
//         }}
//       >
//         <div className="pega-history-overlay">
//           <div className="pega-history-header">
//             <h2>ประวัติการเล่น</h2>
            
//             <div className="pega-user-info">
//               <h2>USERID: {userData?.id || 'N/A'}</h2>
//               <p>Username: {userData?.username || 'N/A'}</p>
//               <p>Created At: {formatDate(userData?.createdAt)}</p>
//               <p>Role: {userData?.role || 'User'}</p>
//             </div>
//           </div>
          
//           <div className="pega-program-card">
//             <img 
//               src={programData?.Picture} 
//               alt={programData?.Name}
//               className="pega-program-thumbnail"
//               onError={(e) => {
//                 e.target.onerror = null;
//                 e.target.src = '/img/placeholder-image.jpg';
//               }}
//             />
//             <div className="pega-program-details">
//               <h3>{programData?.Name || 'N/A'}</h3>
//               <p>จำนวนท่าโยคะที่เล่น: {groupedPoseHistory.length} ท่า</p>
//               <p>จำนวนครั้งที่เล่นทั้งหมด: {poseHistoryData.length} ครั้ง</p>
//             </div>
//           </div>
          
//           {/* Grouped Pose History List */}
//           <div className="grouped-pose-list">
//             {groupedPoseHistory.length > 0 ? (
//               groupedPoseHistory.map((poseGroup) => (
//                 <div key={poseGroup.poseId} className="pose-group-card">
//                   <div className="pose-group-header">
//                     <div className="pose-group-image">
//                       <img 
//                         src={poseGroup.poseImage}
//                         alt={poseGroup.poseName}
//                         onError={(e) => {
//                           e.target.onerror = null;
//                           e.target.src = '/img/placeholder-image.jpg';
//                         }}
//                       />
//                     </div>
//                     <div className="pose-group-title">
//                       <h3>{poseGroup.poseName}</h3>
//                       <p>จำนวนครั้งที่เล่น: {poseGroup.attempts.length} ครั้ง</p>
//                     </div>
//                   </div>
                  
//                   <div className="pose-attempts-container">
//                     {poseGroup.attempts.map((attempt, index) => (
//                       <div 
//                         key={attempt.id}
//                         className={`pose-attempt-card ${getScoreColor(attempt.score)}`}
//                       >
//                         <div className="attempt-number">#{index + 1}</div>
//                         <div className="attempt-details">
//                           <div className="attempt-score">{Math.round(attempt.score)}%</div>
//                           <div className="attempt-date">{formatDate(attempt.date)}</div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="no-history-message">
//                 <p>ไม่พบประวัติการเล่นท่าโยคะ</p>
//               </div>
//             )}
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
import Navbar from "../../Components/navbar.jsx";
import "./userhistoryallprogramplaydetails.css";

const UserHistoryAllProgramPlayDetails = () => {
  const [poseHistoryGroups, setPoseHistoryGroups] = useState({});
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
        // ดึงข้อมูลโปรแกรม
        const programDoc = doc(firestore, "Yoga Program", programId);
        const programSnap = await getDoc(programDoc);
        if (programSnap.exists()) {
          const data = programSnap.data();
          setProgramData({
            id: programSnap.id,
            ...data,
            poseCount: data.poseCount || 5, // จำนวนท่าในโปรแกรม (ถ้าไม่มีใช้ค่าเริ่มต้น 5)
            totalPlays: 30, // จำนวนครั้งที่เล่นทั้งหมด (สมมติข้อมูล)
            Picture: getLocalImage(data.Picture) || data.Picture
          });
        }

        // สร้างอ้างอิงผู้ใช้สำหรับคิวรี่
        const userDoc = doc(firestore, "Users", userId);

        // ดึงข้อมูลประวัติท่าโยคะที่เกี่ยวข้องกับโปรแกรมนี้สำหรับผู้ใช้นี้
        const poseHistoryRef = collection(firestore, "YogaPoseHistory");
        const historyQuery = query(
          poseHistoryRef, 
          where("Program", "==", programDoc),
          where("User", "==", userDoc)
        );
        
        const poseHistorySnapshot = await getDocs(historyQuery);

        // Map เพื่อจัดกลุ่มตามชื่อท่า
        const poseGroups = {};

        // ประมวลผลข้อมูลประวัติท่า
        for (const docSnapshot of poseHistorySnapshot.docs) {
          const historyData = docSnapshot.data();
          
          if (historyData.Pose_id) {
            try {
              // ดึงข้อมูลท่า
              const poseRef = historyData.Pose_id;
              const poseSnap = await getDoc(poseRef);
              
              if (poseSnap.exists()) {
                const poseData = poseSnap.data();
                const poseName = poseData.Name || 'ไม่ระบุชื่อท่า';
                
                // สร้างกลุ่มท่าถ้ายังไม่มี
                if (!poseGroups[poseName]) {
                  poseGroups[poseName] = {
                    poseName: poseName,
                    poseId: poseSnap.id,
                    poseImage: getLocalImage(poseData.Picture) || poseData.Picture,
                    sessionCount: 0,
                    sessions: []
                  };
                }
                
                // เพิ่มข้อมูลเซสชัน
                poseGroups[poseName].sessions.push({
                  id: docSnapshot.id,
                  date: historyData.Date,
                  score: historyData.Pose_score || 0
                });
                poseGroups[poseName].sessionCount = poseGroups[poseName].sessions.length;
              }
            } catch (error) {
              console.error("เกิดข้อผิดพลาดในการดึงข้อมูลท่า:", error);
            }
          }
        }

        // เรียงลำดับเซสชันตามวันที่ (ล่าสุดก่อน)
        Object.keys(poseGroups).forEach(poseName => {
          poseGroups[poseName].sessions.sort((a, b) => {
            const dateA = a.date?.toDate() || new Date(0);
            const dateB = b.date?.toDate() || new Date(0);
            return dateB - dateA;
          });
        });

        setPoseHistoryGroups(poseGroups);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
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

  const formatThaiDate = (timestamp) => {
    if (!timestamp) return 'ไม่ระบุ';
    try {
      if (timestamp.toDate) {
        const date = timestamp.toDate();
        return `${date.getDate()} ${['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'][date.getMonth()]} ${date.getFullYear() + 543} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')} น.`;
      }
      return 'ไม่ระบุ';
    } catch (error) {
      return 'ไม่ระบุ';
    }
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
              <h3>{programData?.Name || 'โปรแกรมโยคะ'}</h3>
              <p>จำนวนท่าโยคะที่เล่น: {programData?.poseCount || 5} ท่า</p>
              <p>จำนวนครั้งที่เล่นทั้งหมด: {programData?.totalPlays || 30} ครั้ง</p>
            </div>
          </div>
          
          {/* แสดงประวัติท่าโยคะ */}
          <div className="pose-history-container">
            {Object.values(poseHistoryGroups).map((poseGroup) => (
              <div key={poseGroup.poseId} className="pose-detail-section">
                <div className="pose-header">
                  <img 
                    src={poseGroup.poseImage} 
                    alt={poseGroup.poseName}
                    className="pose-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/img/placeholder-image.jpg';
                    }}
                  />
                </div>
                <div className="pose-content">
                  <h3 className="pose-title">{poseGroup.poseName}</h3>
                  <p className="pose-count">จำนวนครั้งที่เล่น: {poseGroup.sessionCount} ครั้ง</p>
                  
                  <div className="pose-sessions">
                    {poseGroup.sessions.map((session, index) => (
                      <div key={session.id} className="pose-session-row">
                        <div className="session-number">#{index + 1}</div>
                        <div 
  className="session-score"
  ref={(el) => {
    if (el) {
      const scoreValue = Math.round(session.score);
      if (scoreValue >= 60) {
        el.style.color = '#4CAF50'; // Green
      } else if (scoreValue >= 40) {
        el.style.color = '#FFC107'; // Yellow/Orange
      } else {
        el.style.color = '#F44336'; // Red
      }
    }
  }}
>
  {Math.round(session.score)}%
</div>
                        <div className="session-date">{formatThaiDate(session.date)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHistoryAllProgramPlayDetails;