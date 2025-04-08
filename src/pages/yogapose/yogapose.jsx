import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { firestore, storage } from '../../firebase';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import Navbar from '../../Components/navbar';
import './YogaPose.css';

const YogaPose = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [poses, setPoses] = useState([]);
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const getImageFromStorage = async (imageName) => {
    try {
      // ดึงรูปภาพจาก Firebase Storage
      const storageRef = ref(storage, `Yogapose/${imageName}`);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      console.error("Error loading image from storage:", imageName, error);
      return null;
    }
  };

  const handleEditClick = () => {
    navigate(`/add-yoga-pose/${programId}`);
  };

  useEffect(() => {
    const fetchProgramAndPoses = async () => {
      try {
        // Fetch program details
        const programRef = doc(firestore, "Yoga Program", programId);
        const programSnap = await getDoc(programRef);
        
        if (programSnap.exists()) {
          const programData = programSnap.data();
          // ดึงรูปภาพจาก Storage
          const programImage = await getImageFromStorage(programData.Picture);
          setProgram({ 
            id: programSnap.id, 
            ...programData,
            Picture: programImage || programData.Picture
          });
        } else {
          throw new Error("Program not found");
        }

        // Fetch poses
        const posesQuery = query(
          collection(firestore, "Yoga Pose"),
          where("Program", "==", programRef)
        );
        const posesSnapshot = await getDocs(posesQuery);
        
        // ดึงรูปภาพของแต่ละท่าจาก Storage
        const posesPromises = posesSnapshot.docs.map(async (doc) => {
          const poseData = doc.data();
          const posePicture = await getImageFromStorage(poseData.Picture);
          return {
            id: doc.id,
            ...poseData,
            Picture: posePicture || poseData.Picture
          };
        });
        
        const posesList = await Promise.all(posesPromises);
        setPoses(posesList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching program and poses:", error);
        setLoading(false);
      }
    };

    fetchProgramAndPoses();
  }, [programId]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="error-container">
        <h2>Program not found</h2>
      </div>
    );
  }

  return (
    <div className="yoga-pose-page">
      <Navbar />
      <div 
        className="pose-content-wrapper"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${program.Picture})`
        }}
      >
        <div className="program-header">
          <h1>{program.Name}</h1>
          <p className="duration">ระยะเวลาที่ใช้ทั้งหมด {program.Time_up} นาที</p>
          <p className="description">{program.Description}</p>
        </div>

        {poses.length > 0 ? (
          <>
            <div className="poses-container">
              {poses.map((pose, index) => (
                <div 
                  key={pose.id}
                  className={`pose-card ${index === currentPoseIndex ? 'selected' : ''}`}
                  onClick={() => setCurrentPoseIndex(index)}
                >
                  <div className="pose-image">
                    <img src={pose.Picture} alt={pose.Name} />
                  </div>
                  {index === currentPoseIndex && (
                    <div className="pose-info">
                      <h3>{pose.Name}</h3>
                      <p>{pose.Description}</p>
                      <p className="time">ใช้เวลา {pose.Timeup} นาที</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="navigation">
              <button 
                className="nav-btn prev"
                onClick={() => currentPoseIndex > 0 && setCurrentPoseIndex(currentPoseIndex - 1)}
                disabled={currentPoseIndex === 0}
              >
                ←
              </button>
              <button 
                className="nav-btn next"
                onClick={() => currentPoseIndex < poses.length - 1 && setCurrentPoseIndex(currentPoseIndex + 1)}
                disabled={currentPoseIndex === poses.length - 1}
              >
                →
              </button>
            </div>
          </>
        ) : (
          <div className="no-poses-message">
            <p>ยังไม่มีท่าโยคะในโปรแกรมนี้</p>
          </div>
        )}

        <div className="control-buttons">
          <button className="edit-btn" onClick={handleEditClick}>Edit</button>
          <button className="delete-btn">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default YogaPose;