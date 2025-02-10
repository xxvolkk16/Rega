// import React, { useState, useEffect } from 'react';
// import { doc, setDoc, deleteDoc, collection, getDocs, query, where, getDoc } from 'firebase/firestore';
// import { firestore } from '../../firebase';
// import { useNavigate, useParams } from 'react-router-dom';
// import Navbar from '../../Components/navbar';
// import { Trash2 } from 'lucide-react';
// import './AddYogaPose.css';

// const AddYogaPose = () => {
//   const { programId } = useParams();
//   const navigate = useNavigate();
//   const [poses, setPoses] = useState([]);
//   const [selectedPose, setSelectedPose] = useState(null);
//   const [newPoses, setNewPoses] = useState([]);
//   const [programData, setProgramData] = useState(null);
  
//   const [formData, setFormData] = useState({
//     documentId: '',
//     Name: '',
//     Description: '',
//     Timeup: 0,
//   });

//   const [selectedImage, setSelectedImage] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [selectedVideo, setSelectedVideo] = useState(null);

//   const getLocalImage = (imageName) => {
//     try {
//       return new URL(`../../img/${imageName}`, import.meta.url).href;
//     } catch (error) {
//       console.error("Error loading image:", imageName, error);
//       return null;
//     }
//   };

//   useEffect(() => {
//     const fetchProgramAndPoses = async () => {
//       try {
//         // Fetch program details first
//         const programRef = doc(firestore, "Yoga Program", programId);
//         const programSnap = await getDoc(programRef);
        
//         if (programSnap.exists()) {
//           const data = programSnap.data();
//           setProgramData({
//             id: programSnap.id,
//             ...data,
//             Picture: getLocalImage(data.Picture) || data.Picture
//           });
//         }

//         // Then fetch poses
//         const posesQuery = query(
//           collection(firestore, "Yoga Pose"),
//           where("Program", "==", programRef)
//         );
//         const posesSnapshot = await getDocs(posesQuery);
//         const posesList = posesSnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
//         setPoses(posesList);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchProgramAndPoses();
//   }, [programId]);

//   const handlePoseSelect = (pose) => {
//     setSelectedPose(pose);
//     if (pose.isNew) {
//       // ถ้าเป็นท่าใหม่ที่ยังไม่ได้บันทึก
//       const newPose = newPoses.find(p => p.id === pose.id);
//       setFormData({
//         documentId: newPose.documentId || '',
//         Name: newPose.Name || '',
//         Description: newPose.Description || '',
//         Timeup: newPose.Timeup || 0
//       });
//       setPreviewUrl(newPose.previewUrl);
//     } else {
//       // ถ้าเป็นท่าที่มีอยู่แล้ว
//       setFormData({
//         documentId: pose.id,
//         Name: pose.Name,
//         Description: pose.Description,
//         Timeup: pose.Timeup
//       });
//       setPreviewUrl(getLocalImage(pose.Picture));
//     }
//   };

//   const handleAddNew = () => {
//     // เพิ่มท่าใหม่เข้า newPoses array
//     const newPose = {
//       id: `temp-${Date.now()}`, // temporary ID
//       documentId: '',
//       Name: '',
//       Description: '',
//       Timeup: 0,
//       isNew: true
//     };
//     setNewPoses([...newPoses, newPose]);
//     setSelectedPose(newPose);
    
//     // Reset form
//     setFormData({
//       documentId: '',
//       Name: '',
//       Description: '',
//       Timeup: 0
//     });
//     setPreviewUrl(null);
//     setSelectedImage(null);
//     setSelectedVideo(null);
//   };

//   const handleRemoveNewPose = (poseId) => {
//     setNewPoses(newPoses.filter(pose => pose.id !== poseId));
//     if (selectedPose?.id === poseId) {
//       setSelectedPose(null);
//       setFormData({
//         documentId: '',
//         Name: '',
//         Description: '',
//         Timeup: 0
//       });
//       setPreviewUrl(null);
//     }
//   };

//   const handleRemoveExistingPose = async (poseId) => {
//     try {
//       if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบท่านี้?')) {
//         // ลบจาก Firestore
//         await deleteDoc(doc(firestore, 'Yoga Pose', poseId));
        
//         // อัปเดต state
//         setPoses(poses.filter(pose => pose.id !== poseId));
        
//         // ถ้าท่าที่ลบคือท่าที่กำลังเลือกอยู่ ให้ reset form
//         if (selectedPose?.id === poseId) {
//           setSelectedPose(null);
//           setFormData({
//             documentId: '',
//             Name: '',
//             Description: '',
//             Timeup: 0
//           });
//           setPreviewUrl(null);
//         }
//       }
//     } catch (error) {
//       console.error('Error removing pose:', error);
//       alert('เกิดข้อผิดพลาดในการลบท่า: ' + error.message);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     const updatedValue = name === 'Timeup' ? parseInt(value) || 0 : value;
    
//     setFormData(prev => ({
//       ...prev,
//       [name]: updatedValue
//     }));

//     // Update newPoses if currently editing a new pose
//     if (selectedPose?.isNew) {
//       setNewPoses(prev => prev.map(pose => 
//         pose.id === selectedPose.id 
//           ? { ...pose, [name]: updatedValue }
//           : pose
//       ));
//     }
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const url = URL.createObjectURL(file);
//       setSelectedImage(file);
//       setPreviewUrl(url);
      
//       // Update newPoses if currently editing a new pose
//       if (selectedPose?.isNew) {
//         setNewPoses(prev => prev.map(pose => 
//           pose.id === selectedPose.id 
//             ? { ...pose, previewUrl: url }
//             : pose
//         ));
//       }
//     }
//   };

//   const handleVideoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedVideo(file);
//       if (selectedPose?.isNew) {
//         setNewPoses(prev => prev.map(pose => 
//           pose.id === selectedPose.id 
//             ? { ...pose, video: file }
//             : pose
//         ));
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     try {
//       // Get program reference
//       const programRef = doc(firestore, 'Yoga Program', programId);

//       // Save all new poses
//       for (const pose of newPoses) {
//         if (!pose.documentId) {
//           alert('Please enter all Document IDs');
//           return;
//         }
//       }

//       // Save current pose
//       const saveData = {
//         Name: formData.Name,
//         Description: formData.Description,
//         Timeup: Number(formData.Timeup),
//         Program: programRef
//       };

//       if (selectedImage) {
//         saveData.Picture = selectedImage.name;
//       }

//       if (selectedVideo) {
//         saveData.Video = selectedVideo.name;
//       }

//       if (selectedPose?.isNew) {
//         if (!formData.documentId) {
//           alert('Please enter a document ID');
//           return;
//         }
//         await setDoc(doc(firestore, 'Yoga Pose', formData.documentId), saveData);
//       } else {
//         await setDoc(doc(firestore, 'Yoga Pose', selectedPose.id), saveData, { merge: true });
//       }

//       // Navigate back after saving
//       navigate(`/yoga-pose/${programId}`);
//     } catch (error) {
//       console.error('Error saving pose:', error);
//       alert('Error saving pose: ' + error.message);
//     }
//   };

//   return (
//     <div className="add-yoga-page">
//       <Navbar />
//       <div 
//         className="pose-content-wrapper"
//         style={{
//           backgroundImage: programData?.Picture ? 
//             `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${programData.Picture})` : 
//             'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))'
//         }}
//       >
//         <div className="add-yoga-content">
//           <h1>EDIT MODE</h1>

//           <div className="pose-actions">
//             <button 
//               className="action-btn"
//               onClick={handleAddNew}
//             >
//               เพิ่มท่าใหม่
//             </button>
//           </div>

//           <div className="poses-list">
//             {/* แสดงท่าที่มีอยู่แล้ว */}
//             {poses.map((pose) => (
//               <div 
//                 key={pose.id}
//                 className={`pose-item ${selectedPose?.id === pose.id ? 'selected' : ''}`}
//                 onClick={() => handlePoseSelect(pose)}
//               >
//                 <img src={getLocalImage(pose.Picture)} alt={pose.Name} />
//                 <button 
//                   className="remove-pose-btn"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleRemoveExistingPose(pose.id);
//                   }}
//                 >
//                   <Trash2 size={18} />
//                 </button>
//                 <div className="pose-info">
//                   <h3>{pose.Name}</h3>
//                   <p>{pose.Timeup} นาที</p>
//                 </div>
//               </div>
//             ))}
            
//             {/* แสดงท่าใหม่ที่กำลังเพิ่ม */}
//             {newPoses.map((pose) => (
//               <div 
//                 key={pose.id}
//                 className={`pose-item new ${selectedPose?.id === pose.id ? 'selected' : ''}`}
//                 onClick={() => handlePoseSelect(pose)}
//               >
//                 {pose.previewUrl ? (
//                   <img src={pose.previewUrl} alt="Preview" />
//                 ) : (
//                   <div className="empty-preview">
//                     <span>+</span>
//                   </div>
//                 )}
//                 <button 
//                   className="remove-pose-btn"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleRemoveNewPose(pose.id);
//                   }}
//                 >
//                   <Trash2 size={18} />
//                 </button>
//                 <div className="pose-info">
//                   <h3>{pose.Name || 'ท่าใหม่'}</h3>
//                   <p>{pose.Timeup || 0} นาที</p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {(selectedPose || newPoses.length > 0) && (
//             <form onSubmit={handleSubmit}>
//               <div className="duration-input">
//                 <span className="duration-label">ระยะเวลา</span>
//                 <input
//                   type="number"
//                   name="Timeup"
//                   value={formData.Timeup}
//                   onChange={handleInputChange}
//                   className="time-input"
//                   required
//                 />
//                 <span className="duration-unit">นาที</span>
//               </div>

//               <div className="image-upload-section">
//                 <div className="image-upload-container">
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageChange}
//                     id="image-upload"
//                     className="image-input"
//                   />
//                   <label htmlFor="image-upload" className="image-upload-label">
//                     {previewUrl ? (
//                       <img src={previewUrl} alt="Preview" className="image-preview" />
//                     ) : (
//                       <div className="upload-placeholder">
//                         <span className="plus-icon">+</span>
//                       </div>
//                     )}
//                   </label>
//                 </div>
//                 <div className="form-fields">
//                   <div className="input-group">
//                     <label>Document ID :</label>
//                     <input
//                       type="text"
//                       name="documentId"
//                       value={formData.documentId}
//                       onChange={handleInputChange}
//                       required
//                       placeholder="เช่น POSE001"
//                       disabled={!selectedPose?.isNew}
//                     />
//                   </div>
//                   <div className="input-group">
//                     <label>ชื่อท่า :</label>
//                     <input
//                       type="text"
//                       name="Name"
//                       value={formData.Name}
//                       onChange={handleInputChange}
//                       required
//                     />
//                   </div>
//                   <div className="input-group">
//                     <label>รายละเอียด :</label>
//                     <input
//                       type="text"
//                       name="Description"
//                       value={formData.Description}
//                       onChange={handleInputChange}
//                       required
//                     />
//                   </div>
//                   <div className="input-group">
//                     <label>Video :</label>
//                     <input
//                       type="file"
//                       accept="video/*"
//                       onChange={handleVideoChange}
//                       className="video-input"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="button-group">
//                 <button type="submit" className="save-btn">Save</button>
//                 <button 
//                   type="button" 
//                   className="cancel-btn"
//                   onClick={() => navigate(`/yoga-pose/${programId}`)}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddYogaPose;




import React, { useState, useEffect } from 'react';
import { doc, setDoc, deleteDoc, collection, getDocs, query, where, getDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../Components/navbar';
import { Trash2 } from 'lucide-react';
import './AddYogaPose.css';

const AddYogaPose = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const [poses, setPoses] = useState([]);
  const [selectedPose, setSelectedPose] = useState(null);
  const [newPoses, setNewPoses] = useState([]);
  const [programData, setProgramData] = useState(null);
  
  const [formData, setFormData] = useState({
    documentId: '',
    Name: '',
    Description: '',
    Timeup: 0,
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const getLocalImage = (imageName) => {
    try {
      return new URL(`../../img/${imageName}`, import.meta.url).href;
    } catch (error) {
      console.error("Error loading image:", imageName, error);
      return null;
    }
  };

  useEffect(() => {
    const fetchProgramAndPoses = async () => {
      try {
        // Fetch program details first
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

        // Then fetch poses
        const posesQuery = query(
          collection(firestore, "Yoga Pose"),
          where("Program", "==", programRef)
        );
        const posesSnapshot = await getDocs(posesQuery);
        const posesList = posesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPoses(posesList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchProgramAndPoses();
  }, [programId]);

  const handlePoseSelect = (pose) => {
    setSelectedPose(pose);
    if (pose.isNew) {
      // ถ้าเป็นท่าใหม่ที่ยังไม่ได้บันทึก
      const newPose = newPoses.find(p => p.id === pose.id);
      setFormData({
        documentId: newPose.documentId || '',
        Name: newPose.Name || '',
        Description: newPose.Description || '',
        Timeup: newPose.Timeup || 0
      });
      setPreviewUrl(newPose.previewUrl);
      setSelectedVideo(newPose.video || null);
    } else {
      // ถ้าเป็นท่าที่มีอยู่แล้ว
      setFormData({
        documentId: pose.id,
        Name: pose.Name,
        Description: pose.Description,
        Timeup: pose.Timeup
      });
      setPreviewUrl(getLocalImage(pose.Picture));
      setSelectedVideo(null);
    }
  };

  const handleAddNew = () => {
    // เพิ่มท่าใหม่เข้า newPoses array
    const newPose = {
      id: `temp-${Date.now()}`, // temporary ID
      documentId: '',
      Name: '',
      Description: '',
      Timeup: 0,
      isNew: true
    };
    setNewPoses([...newPoses, newPose]);
    setSelectedPose(newPose);
    
    // Reset form
    setFormData({
      documentId: '',
      Name: '',
      Description: '',
      Timeup: 0
    });
    setPreviewUrl(null);
    setSelectedImage(null);
    setSelectedVideo(null);
  };

  const handleRemoveNewPose = (poseId) => {
    setNewPoses(newPoses.filter(pose => pose.id !== poseId));
    if (selectedPose?.id === poseId) {
      setSelectedPose(null);
      setFormData({
        documentId: '',
        Name: '',
        Description: '',
        Timeup: 0
      });
      setPreviewUrl(null);
      setSelectedVideo(null);
    }
  };

  const handleRemoveExistingPose = async (poseId) => {
    try {
      if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบท่านี้?')) {
        // ลบจาก Firestore
        await deleteDoc(doc(firestore, 'Yoga Pose', poseId));
        
        // อัปเดต state
        setPoses(poses.filter(pose => pose.id !== poseId));
        
        // ถ้าท่าที่ลบคือท่าที่กำลังเลือกอยู่ ให้ reset form
        if (selectedPose?.id === poseId) {
          setSelectedPose(null);
          setFormData({
            documentId: '',
            Name: '',
            Description: '',
            Timeup: 0
          });
          setPreviewUrl(null);
          setSelectedVideo(null);
        }
      }
    } catch (error) {
      console.error('Error removing pose:', error);
      alert('เกิดข้อผิดพลาดในการลบท่า: ' + error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = name === 'Timeup' ? parseInt(value) || 0 : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: updatedValue
    }));

    // Update newPoses if currently editing a new pose
    if (selectedPose?.isNew) {
      setNewPoses(prev => prev.map(pose => 
        pose.id === selectedPose.id 
          ? { ...pose, [name]: updatedValue }
          : pose
      ));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(file);
      setPreviewUrl(url);
      
      // Update newPoses if currently editing a new pose
      if (selectedPose?.isNew) {
        setNewPoses(prev => prev.map(pose => 
          pose.id === selectedPose.id 
            ? { ...pose, previewUrl: url, image: file }
            : pose
        ));
      }
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedVideo(file);
      if (selectedPose?.isNew) {
        setNewPoses(prev => prev.map(pose => 
          pose.id === selectedPose.id 
            ? { ...pose, video: file }
            : pose
        ));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Get program reference
      const programRef = doc(firestore, 'Yoga Program', programId);

      // Check if all new poses have document IDs
      const missingIds = newPoses.some(pose => !pose.documentId);
      if (missingIds) {
        alert('กรุณากรอก Document ID สำหรับท่าใหม่ทุกท่า');
        return;
      }

      // Save all poses
      const savePoses = async () => {
        if (selectedPose?.isNew) {
          // Save all new poses
          for (const pose of newPoses) {
            const saveData = {
              Name: pose.Name || '',
              Description: pose.Description || '',
              Timeup: Number(pose.Timeup) || 0,
              Program: programRef,
            };

            // Add image if available
            if (pose.image) {
              saveData.Picture = pose.image.name;
            }

            // Add video if available
            if (pose.video) {
              saveData.Video = pose.video.name;
            }

            // Save to Firestore
            await setDoc(doc(firestore, 'Yoga Pose', pose.documentId), saveData);
          }
        } else if (selectedPose) {
          // Update existing pose
          const saveData = {
            Name: formData.Name,
            Description: formData.Description,
            Timeup: Number(formData.Timeup),
            Program: programRef
          };

          if (selectedImage) {
            saveData.Picture = selectedImage.name;
          }

          if (selectedVideo) {
            saveData.Video = selectedVideo.name;
          }

          await setDoc(doc(firestore, 'Yoga Pose', selectedPose.id), saveData, { merge: true });
        }
      };

      await savePoses();
      
      // Show success message
      alert('บันทึกท่าโยคะเรียบร้อยแล้ว');

      // Navigate back after saving
      navigate(`/yoga-pose/${programId}`);
    } catch (error) {
      console.error('Error saving poses:', error);
      alert('เกิดข้อผิดพลาดในการบันทึก: ' + error.message);
    }
  };

  return (
    <div className="add-yoga-page">
      <Navbar />
      <div 
        className="pose-content-wrapper"
        style={{
          backgroundImage: programData?.Picture ? 
            `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${programData.Picture})` : 
            'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))'
        }}
      >
        <div className="add-yoga-content">
          <h1>EDIT MODE</h1>

          <div className="pose-actions">
            <button 
              className="action-btn"
              onClick={handleAddNew}
            >
              เพิ่มท่าใหม่
            </button>
          </div>

          <div className="poses-list">
            {/* แสดงท่าที่มีอยู่แล้ว */}
            {poses.map((pose) => (
              <div 
                key={pose.id}
                className={`pose-item ${selectedPose?.id === pose.id ? 'selected' : ''}`}
                onClick={() => handlePoseSelect(pose)}
              >
                <img src={getLocalImage(pose.Picture)} alt={pose.Name} />
                <button 
                  className="remove-pose-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveExistingPose(pose.id);
                  }}
                >
                  <Trash2 size={18} />
                </button>
                <div className="pose-info">
                  <h3>{pose.Name}</h3>
                  <p>{pose.Timeup} นาที</p>
                </div>
              </div>
            ))}
            
            {/* แสดงท่าใหม่ที่กำลังเพิ่ม */}
            {newPoses.map((pose) => (
              <div 
                key={pose.id}
                className={`pose-item new ${selectedPose?.id === pose.id ? 'selected' : ''}`}
                onClick={() => handlePoseSelect(pose)}
              >
                {pose.previewUrl ? (
                  <img src={pose.previewUrl} alt="Preview" />
                ) : (
                  <div className="empty-preview">
                    <span>+</span>
                  </div>
                )}
                <button 
                  className="remove-pose-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveNewPose(pose.id);
                  }}
                >
                  <Trash2 size={18} />
                </button>
                <div className="pose-info">
                  <h3>{pose.Name || 'ท่าใหม่'}</h3>
                  <p>{pose.Timeup || 0} นาที</p>
                </div>
              </div>
            ))}
          </div>

          {(selectedPose || newPoses.length > 0) && (
            <form onSubmit={handleSubmit}>
              <div className="duration-input">
                <span className="duration-label">ระยะเวลา</span>
                <input
                  type="number"
                  name="Timeup"
                  value={formData.Timeup}
                  onChange={handleInputChange}
                  className="time-input"
                  required
                />
                <span className="duration-unit">นาที</span>
              </div>

              <div className="image-upload-section">
                <div className="image-upload-container">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    id="image-upload"
                    className="image-input"
                  />
                  <label htmlFor="image-upload" className="image-upload-label">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="image-preview" />
                    ) : (
                      <div className="upload-placeholder">
                        <span className="plus-icon">+</span>
                      </div>
                    )}
                  </label>
                </div>
                <div className="form-fields">
                  <div className="input-group">
                    <label>Document ID :</label>
                    <input
                      type="text"
                      name="documentId"
                      value={formData.documentId}
                      onChange={handleInputChange}
                      required
                      placeholder="เช่น POSE001"
                      disabled={!selectedPose?.isNew}
                    />
                  </div>
                  <div className="input-group">
                    <label>ชื่อท่า :</label>
                    <input
                      type="text"
                      name="Name"
                      value={formData.Name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label>รายละเอียด :</label>
                    <input
                      type="text"
                      name="Description"
                      value={formData.Description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label>Video :</label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      className="video-input"
                    />
                  </div>
                </div>
              </div>
        
              <div className="button-group">
                <button type="submit" className="save-btn">Save</button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => navigate(`/yoga-pose/${programId}`)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
        </div>
        </div>
        );
        };
        
        export default AddYogaPose;