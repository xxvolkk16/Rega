// pages/programhistorymanagement/ProgramHistoryManagement.jsx
import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, getDoc, writeBatch, where } from 'firebase/firestore';
import { firestore, storage } from '../../firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import Navbar from '../../Components/navbar';
import './ProgramHistoryManagement.css';
import { Trash2, Search, AlertTriangle } from 'lucide-react';

const ProgramHistoryManagement = () => {
  const [activeTab, setActiveTab] = useState('program');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(true);
  const [programs, setPrograms] = useState([]);
  const [stats, setStats] = useState({
    totalRecords: 0,
    totalPrograms: 0
  });

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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. ดึงข้อมูลประวัติทั้งหมด
        const historyRef = collection(firestore, "YogaProgramHistory");
        const historySnapshot = await getDocs(historyRef);
        
        // สำหรับเก็บสถิติ
        const userSet = new Set();
        const programSet = new Set();
        const programData = new Map();

        // 2. สร้าง Map สำหรับเก็บข้อมูล program
        for (const historyDoc of historySnapshot.docs) {
          const historyData = historyDoc.data();
          
          if (historyData.Program_id) {
            const programId = historyData.Program_id.id;
            programSet.add(programId);
            
            // เพิ่มหรืออัพเดตข้อมูลโปรแกรม
            if (!programData.has(programId)) {
              programData.set(programId, {
                id: programId,
                ref: historyData.Program_id,
                userCount: 0,
                playCount: 0,
                lastPlayed: historyData.Date || null,
                users: new Set()
              });
            } else {
              const existingData = programData.get(programId);
              // อัพเดตวันที่เล่นล่าสุดถ้าใหม่กว่า
              if (historyData.Date && 
                  (!existingData.lastPlayed || 
                   historyData.Date.toDate() > existingData.lastPlayed.toDate())) {
                existingData.lastPlayed = historyData.Date;
              }
            }
            
            // เพิ่มจำนวนครั้งที่เล่น
            const data = programData.get(programId);
            data.playCount += 1;
            
            // เพิ่ม user ลงใน set
            if (historyData.User) {
              const userId = historyData.User.id;
              userSet.add(userId);
              data.users.add(userId);
              
              // อัปเดตจำนวน user ที่เล่นโปรแกรมนี้
              data.userCount = data.users.size;
            }
          }
        }

        // 3. ดึงข้อมูลโปรแกรม
        const programPromises = Array.from(programData.values()).map(async (program) => {
          try {
            const programSnapshot = await getDoc(program.ref);
            if (programSnapshot.exists()) {
              const data = programSnapshot.data();
              let imageUrl = '/img/placeholder-image.jpg';
              
              if (data.Picture) {
                imageUrl = await getImageWithFallback(data.Picture);
              }
              
              return {
                id: program.id,
                name: data.Name || 'ไม่ระบุชื่อโปรแกรม',
                image: imageUrl,
                userCount: program.userCount,
                playCount: program.playCount,
                lastPlayed: program.lastPlayed ? program.lastPlayed.toDate().toLocaleString('th-TH', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                }) : 'ไม่มีข้อมูล'
              };
            }
            return null;
          } catch (err) {
            console.error("Error fetching program data:", err);
            return null;
          }
        });
        
        // 4. รอผลลัพธ์จากทุก Promise
        const fetchedPrograms = (await Promise.all(programPromises)).filter(Boolean);
        
        // เรียงข้อมูลตามจำนวนครั้งที่เล่น (มากไปน้อย)
        fetchedPrograms.sort((a, b) => b.playCount - a.playCount);
        
        // 5. อัปเดต state
        setPrograms(fetchedPrograms);
        setStats({
          totalRecords: historySnapshot.size,
          totalPrograms: programSet.size
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleOpenDeleteModal = (type, item) => {
    if (type === 'program') {
      setSelectedProgram(item);
    } else {
      setSelectedProgram(null);
    }
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const batch = writeBatch(firestore);
      
      if (activeTab === 'program' && selectedProgram) {
        // ลบประวัติตามโปรแกรม
        const programRef = doc(firestore, "Yoga Program", selectedProgram.id);
        
        // 1. ลบประวัติโปรแกรม (YogaProgramHistory)
        const programHistoryRef = collection(firestore, "YogaProgramHistory");
        const programHistoryQuery = query(programHistoryRef, where("Program_id", "==", programRef));
        const programHistorySnapshot = await getDocs(programHistoryQuery);
        
        programHistorySnapshot.forEach(doc => {
          batch.delete(doc.ref);
        });
        
        // 2. ลบประวัติท่า (YogaPoseHistory) ที่เกี่ยวข้องกับโปรแกรมนี้
        const poseHistoryRef = collection(firestore, "YogaPoseHistory");
        const poseHistoryQuery = query(poseHistoryRef, where("Program", "==", programRef));
        const poseHistorySnapshot = await getDocs(poseHistoryQuery);
        
        poseHistorySnapshot.forEach(doc => {
          batch.delete(doc.ref);
        });
        
        console.log(`กำลังลบประวัติโปรแกรม ${selectedProgram.name} จำนวน ${programHistorySnapshot.size} รายการ`);
        console.log(`และประวัติท่าที่เกี่ยวข้อง จำนวน ${poseHistorySnapshot.size} รายการ`);
        
      } else if (activeTab === 'all') {
        // ลบประวัติทั้งหมด
        
        // 1. ลบประวัติโปรแกรมทั้งหมด (YogaProgramHistory)
        const programHistoryRef = collection(firestore, "YogaProgramHistory");
        const programHistorySnapshot = await getDocs(programHistoryRef);
        
        programHistorySnapshot.forEach(doc => {
          batch.delete(doc.ref);
        });
        
        // 2. ลบประวัติท่าทั้งหมด (YogaPoseHistory)
        const poseHistoryRef = collection(firestore, "YogaPoseHistory");
        const poseHistorySnapshot = await getDocs(poseHistoryRef);
        
        poseHistorySnapshot.forEach(doc => {
          batch.delete(doc.ref);
        });
        
        console.log(`กำลังลบประวัติโปรแกรมทั้งหมด จำนวน ${programHistorySnapshot.size} รายการ`);
        console.log(`และประวัติท่าทั้งหมด จำนวน ${poseHistorySnapshot.size} รายการ`);
      }
      
      // ดำเนินการลบ
      await batch.commit();
      
      // แสดงข้อความสำเร็จ
      alert("ลบประวัติเรียบร้อยแล้ว");
      
      // โหลดข้อมูลใหม่
      window.location.reload();
      
    } catch (error) {
      console.error("Error deleting history:", error);
      alert("เกิดข้อผิดพลาดในการลบข้อมูล โปรดลองอีกครั้ง");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setConfirmText('');
    }
  };

  const filteredPrograms = searchTerm 
    ? programs.filter(program => program.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : programs;

  if (loading) {
    return (
      <div className="history-management-page">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-management-page">
      <Navbar />
      
      <div className="history-management-content">
        <h1 className="page-title">จัดการประวัติการเล่นโปรแกรมโยคะ</h1>
        <p className="page-subtitle">เลือกโปรแกรมหรือลบทั้งหมดเพื่อจัดการประวัติการเล่น</p>
        
        {/* Search Bar */}
        <div className="search-bar">
          <div className="search-input-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="ค้นหาโปรแกรม..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'program' ? 'active' : ''}`}
            onClick={() => setActiveTab('program')}
          >
            ลบตามโปรแกรม
          </button>
          <button
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            ลบทั้งหมด
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="tab-content">
          {/* Program Tab */}
          {activeTab === 'program' && (
            <div className="program-grid">
              {filteredPrograms.length > 0 ? (
                filteredPrograms.map(program => (
                  <div key={program.id} className="program-card">
                    <div className="program-card-inner">
                      <img src={program.image} alt={program.name} className="program-image" />
                      <div className="program-info">
                        <h3 className="program-name">{program.name}</h3>
                        <div className="program-stats">
                          <p><span className="stat-label">จำนวนผู้ใช้:</span> {program.userCount} คน</p>
                          <p><span className="stat-label">จำนวนครั้งที่เล่น:</span> {program.playCount} ครั้ง</p>
                          <p><span className="stat-label">เล่นล่าสุด:</span> {program.lastPlayed}</p>
                        </div>
                      </div>
                      <button 
                        className="delete-button"
                        onClick={() => handleOpenDeleteModal('program', program)}
                      >
                        <Trash2 className="delete-icon" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">
                  <p>ไม่พบข้อมูลโปรแกรม</p>
                </div>
              )}
            </div>
          )}
          
          {/* Delete All Tab */}
          {activeTab === 'all' && (
            <div className="delete-all-container">
              <div className="warning-box">
                <AlertTriangle className="warning-icon" />
                <div className="warning-content">
                  <h3 className="warning-title">คำเตือน: การดำเนินการนี้ไม่สามารถย้อนกลับได้</h3>
                  <p className="warning-text">การลบประวัติการเล่นทั้งหมดจะกระทบต่อข้อมูลวิเคราะห์และการติดตามความก้าวหน้าของผู้ใช้ทั้งหมด</p>
                </div>
              </div>
              
              <div className="stats-container">
                <h3 className="stats-title">สถิติรวม</h3>
                <div className="stats-grid">
                  <div className="stat-box">
                    <div className="stat-label">จำนวนประวัติทั้งหมด</div>
                    <div className="stat-value">{stats.totalRecords} รายการ</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-label">จำนวนโปรแกรมที่มีประวัติ</div>
                    <div className="stat-value">{stats.totalPrograms} โปรแกรม</div>
                  </div>
                </div>
              </div>
              
              <div className="delete-all-button">
                <button onClick={() => handleOpenDeleteModal('all')}>
                  <Trash2 className="delete-icon" />
                  ลบประวัติทั้งหมด
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2 className="modal-title">
                {selectedProgram 
                  ? `ลบประวัติการเล่น "${selectedProgram.name}"`
                  : "ลบประวัติการเล่นทั้งหมด"}
              </h2>
              
              {!selectedProgram && (
                <div className="modal-warning">
                  คำเตือน: การดำเนินการนี้จะลบประวัติการเล่นทั้งหมดของทุกผู้ใช้และทุกโปรแกรม
                </div>
              )}
              
              {!selectedProgram && (
                <div className="option-group">
                  <label className="option-label">
                    พิมพ์ "DELETE ALL HISTORY" เพื่อยืนยัน
                  </label>
                  <input
                    type="text"
                    className="confirm-input"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                  />
                </div>
              )}
              
              <div className="modal-buttons">
                <button 
                  className="cancel-button"
                  onClick={() => setShowDeleteModal(false)}
                >
                  ยกเลิก
                </button>
                <button 
                  className="confirm-button"
                  onClick={handleDelete}
                  disabled={(!selectedProgram) && confirmText !== "DELETE ALL HISTORY"}
                >
                  ยืนยันการลบ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramHistoryManagement;