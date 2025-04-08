// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { collection, query, getDocs, doc, getDoc } from "firebase/firestore";
// import { firestore } from "../../firebase";
// import Navbar from "../../Components/navbar.jsx";
// import "./userProgramAnalysis.css";

// const UserProgramAnalysis = () => {
//   const [analysisData, setAnalysisData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const getLocalImage = (imageName) => {
//     try {
//       return new URL(`../../img/${imageName}`, import.meta.url).href;
//     } catch (error) {
//       console.error("Error loading image:", imageName, error);
//       return '/img/placeholder-image.jpg';
//     }
//   };

//   useEffect(() => {
//     const fetchAnalysisData = async () => {
//       try {
//         const historyQuery = query(collection(firestore, "YogaProgramHistory"));
//         const historySnapshot = await getDocs(historyQuery);
//         const programScores = {};

//         for (const docSnapshot of historySnapshot.docs) {
//           const historyData = docSnapshot.data();
          
//           if (historyData.Program_id && historyData.Ovr_score) {
//             try {
//               const programRef = historyData.Program_id;
//               const programSnap = await getDoc(programRef);
              
//               if (programSnap.exists()) {
//                 const programId = programSnap.id;
//                 const programData = programSnap.data();

//                 if (!programScores[programId]) {
//                   programScores[programId] = {
//                     programData: {
//                       ...programData,
//                       id: programId,
//                       Picture: getLocalImage(programData.Picture) || programData.Picture
//                     },
//                     totalScore: 0,
//                     count: 0
//                   };
//                 }

//                 programScores[programId].totalScore += historyData.Ovr_score;
//                 programScores[programId].count += 1;
//               }
//             } catch (error) {
//               console.error("Error fetching program data:", error);
//             }
//           }
//         }

//         const analysisResults = Object.values(programScores).map(program => ({
//           ...program,
//           averageScore: program.totalScore / program.count
//         }));

//         analysisResults.sort((a, b) => b.averageScore - a.averageScore);
//         setAnalysisData(analysisResults);
//       } catch (error) {
//         console.error("Error fetching analysis data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAnalysisData();
//   }, []);

//   const getOverlayClass = (score) => {
//     if (score >= 70) return 'overlay-green';
//     if (score >= 50) return 'overlay-yellow';
//     return 'overlay-red';
//   };

//   if (loading) {
//     return (
//       <div className="loading">กำลังโหลด...</div>
//     );
//   }

//   return (
//     <div className="analysis-page">
//       <Navbar />
//       <div className="analysis-content">
//         <h1 className="analysis-title">Analysis All Yoga Program</h1>
        
//         <div className="analysis-grid">
//           {analysisData.length > 0 ? (
//             analysisData.map((item) => (
//               <div 
//                 key={item.programData.id} 
//                 className="program-card"
//                 onClick={() => navigate('/userPoseAnalysis', { 
//                   state: { programId: item.programData.id } 
//                 })}
//                 style={{ cursor: 'pointer' }}
//               >
//                 <img 
//                   src={item.programData.Picture}
//                   alt={item.programData.Name}
//                   className="program-image"
//                   onError={(e) => {
//                     e.target.onerror = null;
//                     e.target.src = '/img/placeholder-image.jpg';
//                   }}
//                 />
//                 <div className={`program-overlay ${getOverlayClass(item.averageScore)}`}>
//                   <h2 className="program-title">{item.programData.Name}</h2>
//                   <div className="program-score">{Math.round(item.averageScore)}</div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="no-data">ไม่พบข้อมูลโปรแกรม</div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserProgramAnalysis;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, getDocs, doc, getDoc } from "firebase/firestore";
import { firestore, storage } from "../../firebase";
import { ref, getDownloadURL } from "firebase/storage";
import Navbar from "../../Components/navbar.jsx";
import "./userProgramAnalysis.css";

const UserProgramAnalysis = () => {
  const [analysisData, setAnalysisData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    const fetchAnalysisData = async () => {
      try {
        const historyQuery = query(collection(firestore, "YogaProgramHistory"));
        const historySnapshot = await getDocs(historyQuery);
        const programScores = {};

        for (const docSnapshot of historySnapshot.docs) {
          const historyData = docSnapshot.data();
          
          if (historyData.Program_id && historyData.Ovr_score) {
            try {
              const programRef = historyData.Program_id;
              const programSnap = await getDoc(programRef);
              
              if (programSnap.exists()) {
                const programId = programSnap.id;
                const programData = programSnap.data();

                if (!programScores[programId]) {
                  // ดึงรูปภาพจาก Firebase Storage
                  const programImage = await getImageFromStorage(programData.Picture);
                  
                  programScores[programId] = {
                    programData: {
                      ...programData,
                      id: programId,
                      Picture: programImage || programData.Picture
                    },
                    totalScore: 0,
                    count: 0
                  };
                }

                programScores[programId].totalScore += historyData.Ovr_score;
                programScores[programId].count += 1;
              }
            } catch (error) {
              console.error("Error fetching program data:", error);
            }
          }
        }

        const analysisResults = Object.values(programScores).map(program => ({
          ...program,
          averageScore: program.totalScore / program.count
        }));

        analysisResults.sort((a, b) => b.averageScore - a.averageScore);
        setAnalysisData(analysisResults);
      } catch (error) {
        console.error("Error fetching analysis data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, []);

  const getOverlayClass = (score) => {
    if (score >= 70) return 'overlay-green';
    if (score >= 50) return 'overlay-yellow';
    return 'overlay-red';
  };

  if (loading) {
    return (
      <div className="loading">กำลังโหลด...</div>
    );
  }

  return (
    <div className="analysis-page">
      <Navbar />
      <div className="analysis-content">
        <h1 className="analysis-title">Analysis All Yoga Program</h1>
        
        <div className="analysis-grid">
          {analysisData.length > 0 ? (
            analysisData.map((item) => (
              <div 
                key={item.programData.id} 
                className="program-card"
                onClick={() => navigate('/userPoseAnalysis', { 
                  state: { programId: item.programData.id } 
                })}
                style={{ cursor: 'pointer' }}
              >
                <img 
                  src={item.programData.Picture}
                  alt={item.programData.Name}
                  className="program-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/img/placeholder-image.jpg';
                  }}
                />
                <div className={`program-overlay ${getOverlayClass(item.averageScore)}`}>
                  <h2 className="program-title">{item.programData.Name}</h2>
                  <div className="program-score">{Math.round(item.averageScore)}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data">ไม่พบข้อมูลโปรแกรม</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProgramAnalysis;






























