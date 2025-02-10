// pages/userPoseAnalysis/userPoseAnalysis.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { firestore } from "../../firebase";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import Navbar from "../../Components/navbar.jsx";
import "./userPoseAnalysis.css";

const UserPoseAnalysis = () => {
  const [poseAnalysisData, setPoseAnalysisData] = useState([]);
  const [programData, setProgramData] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const programId = location.state?.programId;

  // เพิ่มฟังก์ชัน getLocalImage ตามตัวอย่าง
  const getLocalImage = (imageName) => {
    try {
      return new URL(`../../img/${imageName}`, import.meta.url).href;
    } catch (error) {
      console.error("Error loading image:", imageName, error);
      return '/img/placeholder-image.jpg';
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
        
        if (programSnap.exists()) {
          const data = programSnap.data();
          setProgramData({
            id: programSnap.id,
            ...data,
            Picture: getLocalImage(data.Picture) || data.Picture
          });
        }

        // 2. ดึงข้อมูล YogaPoseHistory ที่เกี่ยวข้องกับโปรแกรมนี้
        const historyRef = collection(firestore, "YogaPoseHistory");
        const historyQuery = query(historyRef, where("Program", "==", programRef));
        const historySnapshot = await getDocs(historyQuery);

        // สร้าง map เก็บข้อมูลคะแนนของแต่ละท่า
        const poseScores = {};
        const monthlyScores = {};

        // 3. ประมวลผลข้อมูลประวัติ
        for (const doc of historySnapshot.docs) {
          const historyData = doc.data();
          
          if (historyData.Pose_id && historyData.Date) {
            const date = historyData.Date.toDate();
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            // เก็บคะแนนรายเดือน
            if (!monthlyScores[monthKey]) {
              monthlyScores[monthKey] = { total: 0, count: 0 };
            }
            monthlyScores[monthKey].total += historyData.Pose_score || 0;
            monthlyScores[monthKey].count += 1;

            try {
              const poseRef = historyData.Pose_id;
              const poseSnap = await getDoc(poseRef);
              
              if (poseSnap.exists()) {
                const poseId = poseSnap.id;
                const poseData = poseSnap.data();

                // เริ่มเก็บข้อมูลท่าใหม่
                if (!poseScores[poseId]) {
                  poseScores[poseId] = {
                    poseData: {
                      id: poseId,
                      ...poseData,
                      Picture: getLocalImage(poseData.Picture) || poseData.Picture
                    },
                    totalScore: 0,
                    count: 0
                  };
                }

                // บันทึกคะแนน
                poseScores[poseId].totalScore += historyData.Pose_score || 0;
                poseScores[poseId].count += 1;
              }
            } catch (error) {
              console.error("เกิดข้อผิดพลาดในการดึงข้อมูลท่า:", error);
            }
          }
        }

        // 4. คำนวณค่าเฉลี่ยรายเดือน
        const monthlyAverages = Object.entries(monthlyScores)
          .map(([month, data]) => ({
            month,
            score: data.total / data.count
          }))
          .sort((a, b) => a.month.localeCompare(b.month))
          .slice(-5);

        // 5. จัดเตรียมข้อมูลท่าทั้งหมด
        const analysisResults = Object.entries(poseScores).map(([id, data]) => ({
          id,
          name: data.poseData.Name || 'ไม่ระบุชื่อท่า',
          picture: data.poseData.Picture,
          averageScore: data.count > 0 ? data.totalScore / data.count : 0
        }));

        // เรียงตามคะแนนจากมากไปน้อย
        analysisResults.sort((a, b) => b.averageScore - a.averageScore);
        setPoseAnalysisData(analysisResults);

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