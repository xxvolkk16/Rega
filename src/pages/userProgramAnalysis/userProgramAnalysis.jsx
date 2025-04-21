import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, getDocs, getDoc, doc, where } from "firebase/firestore";
import { firestore, storage } from "../../firebase";
import { ref, getDownloadURL } from "firebase/storage";
import Navbar from "../../Components/navbar.jsx";
import "./userProgramAnalysis.css";

const UserProgramAnalysis = () => {
  const [analysisData, setAnalysisData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ใช้ cache สำหรับเก็บ URL ของรูปภาพ
  const imageCache = new Map();

  const getImageWithFallback = async (imageName) => {
    if (!imageName) return '/img/placeholder-image.jpg';

    // ตรวจสอบว่ามีรูปในแคชหรือไม่
    if (imageCache.has(imageName)) {
      return imageCache.get(imageName);
    }

    try {
      // ลองดึงจาก folder Yogapose ก่อน
      const url = await getDownloadURL(ref(storage, `Yogapose/${imageName}`));
      imageCache.set(imageName, url);
      return url;
    } catch (error) {
      try {
        // ถ้าไม่พบใน Yogapose ให้ลองดึงจาก folder Program
        const url = await getDownloadURL(ref(storage, `Program/${imageName}`));
        imageCache.set(imageName, url);
        return url;
      } catch (secondError) {
        try {
          // ลองดึงจาก root folder
          const url = await getDownloadURL(ref(storage, imageName));
          imageCache.set(imageName, url);
          return url;
        } catch (thirdError) {
          console.error(`Failed to load image ${imageName} from all locations`, thirdError);
          return '/img/placeholder-image.jpg';
        }
      }
    }
  };

  // ฟังก์ชันคำนวณแบบเดียวกับที่ใช้ใน userPoseAnalysis
  const calculateProgramAverage = async (programRef) => {
    try {
      // ดึงข้อมูล YogaPoseHistory ที่เกี่ยวข้องกับโปรแกรมนี้
      const historyRef = collection(firestore, "YogaPoseHistory");
      const historyQuery = query(historyRef, where("Program", "==", programRef));
      const historySnapshot = await getDocs(historyQuery);

      if (historySnapshot.empty) {
        return {
          averageScore: 0,
          poseCount: 0,
          userCount: 0,
          playCount: 0
        };
      }

      // สร้าง map เก็บข้อมูลคะแนนของแต่ละท่า
      const poseScores = new Map();
      const poseRefsToFetch = new Set();
      const users = new Set();

      // ประมวลผลข้อมูลประวัติและรวบรวม refs ของท่าที่ต้องดึง
      historySnapshot.forEach(doc => {
        const historyData = doc.data();
        
        if (historyData.Pose_id) {
          // เก็บ reference ของท่าโยคะที่ต้องดึง
          const poseRef = historyData.Pose_id;
          const poseId = poseRef.id;
          poseRefsToFetch.add(poseRef);

          // เพิ่มคะแนนและจำนวนครั้ง
          if (!poseScores.has(poseId)) {
            poseScores.set(poseId, {
              totalScore: historyData.Pose_score || 0,
              count: 1
            });
          } else {
            const currentData = poseScores.get(poseId);
            poseScores.set(poseId, {
              totalScore: currentData.totalScore + (historyData.Pose_score || 0),
              count: currentData.count + 1
            });
          }

          // เก็บข้อมูล user
          if (historyData.User) {
            users.add(historyData.User.id);
          }
        }
      });

      // ดึงข้อมูลท่าโยคะทั้งหมดพร้อมกัน
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

      // จัดเตรียมข้อมูลท่าทั้งหมด
      const analysisResults = [];
      let totalPlayCount = 0;
      
      poseScores.forEach((scoreData, poseId) => {
        const poseData = poseDataMap.get(poseId);
        
        if (poseData) {
          // คำนวณค่าเฉลี่ย
          const averageScore = scoreData.count > 0 ? scoreData.totalScore / scoreData.count : 0;
          
          analysisResults.push({
            id: poseId,
            name: poseData.Name || 'ไม่ระบุชื่อท่า',
            averageScore,
            count: scoreData.count
          });
          
          totalPlayCount += scoreData.count;
        }
      });

      // เรียงตามคะแนนจากมากไปน้อย
      analysisResults.sort((a, b) => b.averageScore - a.averageScore);

      // คำนวณค่าเฉลี่ยแบบเดียวกับที่ใช้ใน userPoseAnalysis
      const programAverage = analysisResults.length > 0
        ? analysisResults.reduce((sum, pose) => sum + pose.averageScore, 0) / analysisResults.length
        : 0;
      
      // แสดงข้อมูลในคอนโซลเพื่อตรวจสอบ
      console.log(`โปรแกรม: ${programRef.id}, คะแนนเฉลี่ย: ${programAverage.toFixed(2)}`);
      analysisResults.forEach(pose => {
        console.log(`- ท่า: ${pose.name}, คะแนน: ${pose.averageScore.toFixed(2)}, จำนวนครั้ง: ${pose.count}`);
      });

      return {
        averageScore: programAverage,
        poseCount: poseScores.size,
        userCount: users.size,
        playCount: totalPlayCount
      };
    } catch (error) {
      console.error("Error calculating program average:", error);
      return {
        averageScore: 0,
        poseCount: 0,
        userCount: 0,
        playCount: 0
      };
    }
  };

  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        // 1. ดึงข้อมูลโปรแกรมทั้งหมด
        const programsRef = collection(firestore, "Yoga Program");
        const programsSnapshot = await getDocs(programsRef);
        
        if (programsSnapshot.empty) {
          setAnalysisData([]);
          setLoading(false);
          return;
        }

        console.log("เริ่มประมวลผลโปรแกรมโยคะทั้งหมด...");

        // 2. ประมวลผลข้อมูลทุกโปรแกรม
        const programPromises = programsSnapshot.docs.map(async (programDoc) => {
          const programData = programDoc.data();
          const programRef = doc(firestore, "Yoga Program", programDoc.id);
          
          console.log(`กำลังประมวลผลโปรแกรม: ${programData.Name || programDoc.id}`);
          
          // ดึงรูปภาพ
          const imageUrl = await getImageWithFallback(programData.Picture);
          
          // คำนวณข้อมูลโดยใช้วิธีเดียวกับ userPoseAnalysis
          const analysisResult = await calculateProgramAverage(programRef);
          
          return {
            programData: {
              ...programData,
              id: programDoc.id,
              Picture: imageUrl
            },
            ...analysisResult
          };
        });
        
        // รอให้ประมวลผลทุกโปรแกรมเสร็จ
        const results = await Promise.all(programPromises);
        
        // เรียงลำดับตามค่าเฉลี่ยจากมากไปน้อย
        results.sort((a, b) => b.averageScore - a.averageScore);
        
        console.log("สรุปผลการประมวลผลโปรแกรมทั้งหมด:");
        results.forEach(item => {
          console.log(`${item.programData.Name}: ${Math.round(item.averageScore)}% (ท่า: ${item.poseCount}, ผู้ใช้: ${item.userCount}, ครั้ง: ${item.playCount})`);
        });
        
        setAnalysisData(results);
      } catch (error) {
        console.error("Error fetching analysis data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, []);

  const getOverlayClass = (score) => {
    if (score >= 60) return 'upa-overlay-green';
    if (score >= 40) return 'upa-overlay-yellow';
    return 'upa-overlay-red';
  };

  if (loading) {
    return (
      <div className="upa-loading">กำลังโหลด...</div>
    );
  }

  return (
    <div className="upa-page">
      <Navbar />
      <div className="upa-content">
        <h1 className="upa-title">Analysis All Yoga Program</h1>
        
        <div className="upa-grid">
          {analysisData.length > 0 ? (
            analysisData.map((item) => (
              <div 
                key={item.programData.id} 
                className="upa-card"
                onClick={() => navigate('/userPoseAnalysis', { 
                  state: { programId: item.programData.id } 
                })}
                style={{ cursor: 'pointer' }}
              >
                <img 
                  src={item.programData.Picture}
                  alt={item.programData.Name}
                  className="upa-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/img/placeholder-image.jpg';
                  }}
                />
                <div className={`upa-overlay ${getOverlayClass(item.averageScore)}`}>
                  <h2 className="upa-program-title">{item.programData.Name}</h2>
                  <div className="upa-program-score">{Math.round(item.averageScore)}</div>
                  <div className="upa-user-info">
                    ผู้ใช้: {item.userCount} คน<br />
                    {/* จำนวนท่า: {item.poseCount} ท่า<br />
                    จำนวนครั้ง: {item.playCount} ครั้ง */}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="upa-no-data">ไม่พบข้อมูลโปรแกรม</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProgramAnalysis;