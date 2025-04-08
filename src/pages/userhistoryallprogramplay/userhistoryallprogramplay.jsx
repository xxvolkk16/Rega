// // pages/userhistoryallprogramplay/userhistoryallprogramplay.jsx
// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
// import { firestore } from "../../firebase";
// import Navbar from "../../Components/navbar.jsx";
// import "./userhistoryallprogramplay.css";
// import path from 'path';

// const UserHistoryAllProgramPlay = () => {
//   const [historyData, setHistoryData] = useState([]);
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const userId = location.state?.userId;

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
//     const fetchHistoryData = async () => {
//       if (!userId) {
//         console.log("ไม่พบ userId");
//         navigate('/');
//         return;
//       }

//       try {
//         const userRef = doc(firestore, "Users", userId);
        
//         const historyQuery = query(
//           collection(firestore, "YogaProgramHistory"),
//           where("User", "==", userRef)
//         );
        
//         const querySnapshot = await getDocs(historyQuery);
//         console.log("จำนวนประวัติที่พบ:", querySnapshot.size);

//         const histories = [];
        
//         for (const docSnapshot of querySnapshot.docs) {
//           const historyData = docSnapshot.data();
          
//           // ดึงข้อมูลโปรแกรมโดยใช้ Reference
//           let programData = null;
//           if (historyData.Program_id) {
//             try {
//               const programRef = historyData.Program_id; 
//               const programSnap = await getDoc(programRef);
              
//               if (programSnap.exists()) {
//                 programData = programSnap.data();
//                 programData.id = programSnap.id;
//                 programData.Picture = getLocalImage(programData.Picture) || programData.Picture;
//                 console.log("ข้อมูลโปรแกรม:", programData);
//               }
//             } catch (error) {
//               console.error("เกิดข้อผิดพลาดในการดึงข้อมูลโปรแกรม:", error);
//             }
//           }

//           histories.push({
//             id: docSnapshot.id,
//             ...historyData,
//             programData
//           });
//         }

//         const programMap = {};

//         histories.forEach((history) => {
//           if (history.programData) {
//             const programId = history.programData.id;
//             if (!programMap[programId] || (history.Date && programMap[programId].Date.toDate() < history.Date.toDate())) {
//               programMap[programId] = history;
//             }
//           }
//         });

//         const uniqueHistories = Object.values(programMap);

//         uniqueHistories.sort((a, b) => {
//           const dateA = a.Date?.toDate() || new Date(0);
//           const dateB = b.Date?.toDate() || new Date(0);
//           return dateB - dateA;
//         });

//         setHistoryData(uniqueHistories);

//       } catch (error) {
//         console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHistoryData();
//   }, [userId, navigate]);

//   const formatDate = (timestamp) => {
//     if (!timestamp) return 'ไม่ระบุ';
//     try {
//       if (timestamp.toDate) {
//         return timestamp.toDate().toLocaleString('th-TH', {
//           year: 'numeric',
//           month: 'numeric',
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

//  // Update the UserHistoryAllProgramPlay component's JSX
// return (
//   <div className="history-list-page">
//     <Navbar />
//     <div className="history-list-content">
//       <h1 className="history-list-title">ประวัติการเล่น</h1>
      
//       <div className="history-list-user-info">
//         <p><strong>USERID:</strong> {userId}</p>
//         <p><strong>Username:</strong> {userData?.username || 'N/A'}</p>
//         <p><strong>Created At:</strong> {formatDate(userData?.createdAt)}</p>
//         <p><strong>Role:</strong> {userData?.Role || 'User'}</p>
//       </div>

//       <div className="history-list-grid">
//         {historyData.length > 0 ? (
//           historyData.map((item) => (
//             <div key={item.id} className="history-list-card">
//               <div className="program-image">
//                 <img 
//                   src={item.programData?.Picture} 
//                   alt={item.programData?.Name || 'รูปโปรแกรม'} 
//                   onError={(e) => {
//                     e.target.onerror = null;
//                     e.target.src = '/img/placeholder-image.jpg';
//                   }}
//                 />
//               </div>
//               <div className="program-info">
//                 <h3>{item.programData?.Name || "ไม่ระบุชื่อโปรแกรม"}</h3>
//                 <p className="timestamp">
//                   เล่นล่าสุดเมื่อ: {formatDate(item.Date)}
//                 </p>
//                 <button 
//                   className="detail-button"
//                   onClick={() => {
//                     if (item.programData?.id) {
//                       navigate('/userhistoryallprogramplaydetails', { 
//                         state: { 
//                           userId: userId, 
//                           programId: item.programData.id 
//                         } 
//                       });
//                     }
//                   }}
//                 >
//                   ดูรายละเอียดเพิ่มเติม
//                 </button>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="no-history">
//             <p>ไม่พบประวัติการเล่น</p>
//           </div>
//         )}
//       </div>
//     </div>
//   </div>
// );
// };

// export default UserHistoryAllProgramPlay;


// pages/userhistoryallprogramplay/userhistoryallprogramplay.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { firestore, storage } from "../../firebase";
import { ref, getDownloadURL } from "firebase/storage";
import Navbar from "../../Components/navbar.jsx";
import "./userhistoryallprogramplay.css";

const UserHistoryAllProgramPlay = () => {
  const [historyData, setHistoryData] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;

  const getImageFromStorage = async (imageName) => {
    try {
      // ดึงรูปภาพจาก Firebase Storage
      const storageRef = ref(storage, `Yogapose/${imageName}`);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      console.error("Error loading image from storage:", imageName, error);
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
          setUserData(userSnap.data());
        } else {
          console.log("ไม่พบข้อมูลผู้ใช้ใน Firestore");
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    const fetchHistoryData = async () => {
      if (!userId) {
        console.log("ไม่พบ userId");
        navigate('/');
        return;
      }

      try {
        const userRef = doc(firestore, "Users", userId);
        
        const historyQuery = query(
          collection(firestore, "YogaProgramHistory"),
          where("User", "==", userRef)
        );
        
        const querySnapshot = await getDocs(historyQuery);
        console.log("จำนวนประวัติที่พบ:", querySnapshot.size);

        const histories = [];
        
        for (const docSnapshot of querySnapshot.docs) {
          const historyData = docSnapshot.data();
          
          // ดึงข้อมูลโปรแกรมโดยใช้ Reference
          let programData = null;
          if (historyData.Program_id) {
            try {
              const programRef = historyData.Program_id; 
              const programSnap = await getDoc(programRef);
              
              if (programSnap.exists()) {
                programData = programSnap.data();
                programData.id = programSnap.id;
                // ดึงรูปภาพจาก Firebase Storage
                programData.Picture = await getImageFromStorage(programData.Picture);
                console.log("ข้อมูลโปรแกรม:", programData);
              }
            } catch (error) {
              console.error("เกิดข้อผิดพลาดในการดึงข้อมูลโปรแกรม:", error);
            }
          }

          histories.push({
            id: docSnapshot.id,
            ...historyData,
            programData
          });
        }

        const programMap = {};

        histories.forEach((history) => {
          if (history.programData) {
            const programId = history.programData.id;
            if (!programMap[programId] || (history.Date && programMap[programId].Date.toDate() < history.Date.toDate())) {
              programMap[programId] = history;
            }
          }
        });

        const uniqueHistories = Object.values(programMap);

        uniqueHistories.sort((a, b) => {
          const dateA = a.Date?.toDate() || new Date(0);
          const dateB = b.Date?.toDate() || new Date(0);
          return dateB - dateA;
        });

        setHistoryData(uniqueHistories);

      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryData();
  }, [userId, navigate]);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'ไม่ระบุ';
    try {
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleString('th-TH', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) + ' น.';
      }
      return new Date(timestamp).toLocaleString('th-TH');
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการแปลงวันที่:", error);
      return 'ไม่ระบุ';
    }
  };

  if (loading) {
    return <div className="loading">กำลังโหลด...</div>;
  }

  // Update the UserHistoryAllProgramPlay component's JSX
  return (
    <div className="history-list-page">
      <Navbar />
      <div className="history-list-content">
        <h1 className="history-list-title">ประวัติการเล่น</h1>
        
        <div className="history-list-user-info">
          <p><strong>USERID:</strong> {userId}</p>
          <p><strong>Username:</strong> {userData?.username || 'N/A'}</p>
          <p><strong>Created At:</strong> {formatDate(userData?.createdAt)}</p>
          <p><strong>Role:</strong> {userData?.Role || 'User'}</p>
        </div>

        <div className="history-list-grid">
          {historyData.length > 0 ? (
            historyData.map((item) => (
              <div key={item.id} className="history-list-card">
                <div className="program-image">
                  <img 
                    src={item.programData?.Picture} 
                    alt={item.programData?.Name || 'รูปโปรแกรม'} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/img/placeholder-image.jpg';
                    }}
                  />
                </div>
                <div className="program-info">
                  <h3>{item.programData?.Name || "ไม่ระบุชื่อโปรแกรม"}</h3>
                  <p className="timestamp">
                    เล่นล่าสุดเมื่อ: {formatDate(item.Date)}
                  </p>
                  <button 
                    className="detail-button"
                    onClick={() => {
                      if (item.programData?.id) {
                        navigate('/userhistoryallprogramplaydetails', { 
                          state: { 
                            userId: userId, 
                            programId: item.programData.id 
                          } 
                        });
                      }
                    }}
                  >
                    ดูรายละเอียดเพิ่มเติม
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-history">
              <p>ไม่พบประวัติการเล่น</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserHistoryAllProgramPlay;