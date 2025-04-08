// import React, { useState, useEffect } from 'react';
// import { doc, setDoc, deleteDoc, collection, getDocs, query, where, getDoc } from 'firebase/firestore';
// import { firestore } from '../../firebase';
// import { getStorage, ref,uploadBytes, listAll, getDownloadURL } from 'firebase/storage';
// import { useNavigate, useParams } from 'react-router-dom';
// import Navbar from '../../Components/navbar';
// import { Trash2, Upload, X } from 'lucide-react';

// import './AddYogaPose.css';


// const AddYogaPose = () => {
//   const { programId } = useParams();
//   const navigate = useNavigate();
//   const [poses, setPoses] = useState([]);
//   const [selectedPose, setSelectedPose] = useState(null);
//   const [newPoses, setNewPoses] = useState([]);
//   const [programData, setProgramData] = useState(null);
  
//   // เปลี่ยนจากการใช้ formData เป็น editedPoses เพื่อเก็บข้อมูลที่ถูกแก้ไขแล้ว
//   const [editedPoses, setEditedPoses] = useState({});
//   const [formData, setFormData] = useState({
//     documentId: '',
//     Name: '',
//     Description: '',
//     Timeup: 0,
//   });

//   // State สำหรับจัดการรูปภาพ
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [selectedVideo, setSelectedVideo] = useState(null);
//   const [imageUpdates, setImageUpdates] = useState({});
//   const [videoUpdates, setVideoUpdates] = useState({});
//   const [videoFileNames, setVideoFileNames] = useState({});
  
//   // State สำหรับจัดการแกลเลอรี่รูปภาพจาก Storage
//   const [showGallery, setShowGallery] = useState(false);
//   const [storageImages, setStorageImages] = useState([]);
//   const [selectedStorageImage, setSelectedStorageImage] = useState(null);
//   const [isLoadingGallery, setIsLoadingGallery] = useState(false);

//   const getLocalImage = (imageName) => {
//     try {
//       return new URL(`../../img/${imageName}`, import.meta.url).href;
//     } catch (error) {
//       console.error("Error loading image:", imageName, error);
//       return null;
//     }
//   };

//   // ฟังก์ชันสำหรับการโหลดรูปภาพจาก Firebase Storage
//   const loadStorageImages = async () => {
//     setIsLoadingGallery(true);
//     try {
//       const storage = getStorage();
//       const yogaPoseRef = ref(storage, 'Yogapose');
      
//       // ดึงรายการไฟล์ทั้งหมดจากโฟลเดอร์ Yogapose
//       const result = await listAll(yogaPoseRef);
      
//       // แปลงเป็นข้อมูลที่พร้อมใช้งาน
//       const images = await Promise.all(
//         result.items.map(async (itemRef) => {
//           const url = await getDownloadURL(itemRef);
//           return {
//             name: itemRef.name,
//             url: url,
//             path: `Yogapose/${itemRef.name}`
//           };
//         })
//       );
      
//       setStorageImages(images);
//     } catch (error) {
//       console.error("Error loading images from storage:", error);
//       alert("ไม่สามารถโหลดรูปภาพจาก Storage ได้");
//     } finally {
//       setIsLoadingGallery(false);
//     }
//   };

  

//   // ฟังก์ชันสำหรับเลือกรูปภาพจากแกลเลอรี่
//   const handleSelectStorageImage = (image) => {
//     if (selectedPose) {
//       setSelectedStorageImage(image);
//       setPreviewUrl(image.url);
      
//       // เก็บข้อมูลการเลือกรูปภาพจาก Storage
//       setImageUpdates(prev => ({
//         ...prev,
//         [selectedPose.id]: {
//           url: image.url,
//           storagePath: image.path,
//           fileName: image.name
//         }
//       }));
      
//       // อัปเดต newPoses กรณีเป็นท่าใหม่
//       if (selectedPose.isNew) {
//         setNewPoses(prev => prev.map(pose => 
//           pose.id === selectedPose.id 
//             ? { 
//                 ...pose, 
//                 previewUrl: image.url, 
//                 storagePath: image.path,
//                 Picture: image.name 
//               }
//             : pose
//         ));
//       }
//     }
    
//     setShowGallery(false);
//   };

//   // เพิ่มฟังก์ชันนี้ข้างนอก useEffect เพื่อใช้โหลดรูปภาพจาก Storage
//   const loadImageFromStorage = async (imageName) => {
//     if (!imageName) return null;
//     try {
//       const storage = getStorage();
//       const pathReference = ref(storage, `Yogapose/${imageName}`);
//       const url = await getDownloadURL(pathReference);
//       return url;
//     } catch (error) {
//       console.error("Error loading image from storage:", error, imageName);
//       return null;
//     }
//   };
  


//   // แก้ไข useEffect ที่โหลดข้อมูลท่า
// useEffect(() => {
//   const fetchProgramAndPoses = async () => {
//     try {
//       // Fetch program details first (โค้ดเดิม)
//       const programRef = doc(firestore, "Yoga Program", programId);
//       const programSnap = await getDoc(programRef);
      
//       if (programSnap.exists()) {
//         const data = programSnap.data();
//         // โหลดรูปจาก Storage แทน getLocalImage
//         let programImageUrl = null;
//         if (data.Picture) {
//           programImageUrl = await loadImageFromStorage(data.Picture);
//         }
        
//         setProgramData({
//           id: programSnap.id,
//           ...data,
//           Picture: programImageUrl || data.Picture // ใช้ URL จาก Storage หรือใช้ค่าเดิมถ้าโหลดไม่สำเร็จ
//         });
//       }

//       // Then fetch poses
//       const posesQuery = query(
//         collection(firestore, "Yoga Pose"),
//         where("Program", "==", programRef)
//       );
//       const posesSnapshot = await getDocs(posesQuery);
      
//       // สร้างอาร์เรย์เพื่อเก็บ Promise ทั้งหมด
//       const posesPromises = posesSnapshot.docs.map(async (doc) => {
//         const poseData = doc.data();
//         // โหลดรูปจาก Storage
//         let imageUrl = null;
//         if (poseData.Picture) {
//           imageUrl = await loadImageFromStorage(poseData.Picture);
//         }
        
//         return {
//           id: doc.id,
//           ...poseData,
//           imageUrl: imageUrl // เก็บ URL ของรูปภาพจาก Storage ไว้ใน state
//         };
//       });
      
//       // รอให้โหลดรูปทั้งหมดเสร็จ
//       const posesList = await Promise.all(posesPromises);
//       setPoses(posesList);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   fetchProgramAndPoses();
  
//   // โหลดรูปภาพจาก Storage ตั้งแต่เริ่มต้น
//   loadStorageImages();
// }, [programId]);

//   // บันทึกข้อมูลที่กำลังแก้ไขก่อนเปลี่ยนไปเลือกท่าอื่น
//   const saveCurrentChanges = () => {
//     if (selectedPose) {
//       const poseId = selectedPose.id;
//       setEditedPoses(prev => ({
//         ...prev,
//         [poseId]: {
//           ...formData
//         }
//       }));
      
//       // ถ้าเป็นท่าใหม่ให้อัปเดต newPoses ด้วย
//       if (selectedPose.isNew) {
//         setNewPoses(prev => prev.map(pose => 
//           pose.id === poseId 
//             ? { 
//                 ...pose, 
//                 documentId: formData.documentId,
//                 Name: formData.Name,
//                 Description: formData.Description,
//                 Timeup: formData.Timeup
//               }
//             : pose
//         ));
//       } else {
//         // อัปเดตข้อมูลในท่าที่มีอยู่แล้ว
//         setPoses(prev => prev.map(pose => 
//           pose.id === poseId 
//             ? { 
//                 ...pose, 
//                 Name: formData.Name,
//                 Description: formData.Description,
//                 Timeup: formData.Timeup
//               }
//             : pose
//         ));
//       }
//     }
//   };

//   const handlePoseSelect = (pose) => {
//     // บันทึกข้อมูลท่าปัจจุบันก่อนเปลี่ยนไปเลือกท่าอื่น
//     saveCurrentChanges();
    
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
//       setSelectedVideo(newPose.video || null);
//     } else {
//       // ถ้าเป็นท่าที่มีอยู่แล้ว ตรวจสอบว่ามีการแก้ไขไว้หรือไม่
//       if (editedPoses[pose.id]) {
//         setFormData(editedPoses[pose.id]);
//       } else {
//         setFormData({
//           documentId: pose.id,
//           Name: pose.Name,
//           Description: pose.Description,
//           Timeup: pose.Timeup
//         });
//       }
      
//       // ตรวจสอบว่ามีการอัปเดตรูปภาพหรือไม่
//       if (imageUpdates[pose.id]) {
//         setPreviewUrl(imageUpdates[pose.id].url);
//         setSelectedImage(imageUpdates[pose.id].file);
//         setSelectedStorageImage(imageUpdates[pose.id].storagePath ? {
//           name: imageUpdates[pose.id].fileName,
//           path: imageUpdates[pose.id].storagePath,
//           url: imageUpdates[pose.id].url
//         } : null);
//       } else {
//         // โหลดรูปภาพจาก Firebase Storage
//         if (pose.Picture) {
//           const storage = getStorage();
//           const pathReference = ref(storage, `Yogapose/${pose.Picture}`);
          
//           getDownloadURL(pathReference)
//             .then((url) => {
//               console.log("Loaded image URL:", url); // เพิ่ม log นี้เพื่อดูว่าได้ URL จริงหรือไม่
//               setPreviewUrl(url);
//             })
//             .catch((error) => {
//               console.error("Error loading image from storage:", error);
//               setPreviewUrl(getLocalImage(pose.Picture));
//             });
//         } else {
//           setPreviewUrl(null);
//         }
        
//         setSelectedImage(null);
//         setSelectedStorageImage(null);
//       }
      
//       // ตรวจสอบว่ามีการอัปเดตวิดีโอหรือไม่
//       if (videoUpdates[pose.id]) {
//         setSelectedVideo(videoUpdates[pose.id]);
//       } else {
//         setSelectedVideo(null);
//       }
//     }
//   };

//   const handleAddNew = () => {
//     // บันทึกข้อมูลท่าปัจจุบันก่อนเพิ่มท่าใหม่
//     saveCurrentChanges();
    
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
//     setSelectedStorageImage(null);
//   };

//   const handleRemoveNewPose = (poseId) => {
//     setNewPoses(newPoses.filter(pose => pose.id !== poseId));
    
//     // ลบข้อมูลการแก้ไขของท่านี้ออกด้วย
//     const updatedEditedPoses = { ...editedPoses };
//     delete updatedEditedPoses[poseId];
//     setEditedPoses(updatedEditedPoses);
    
//     if (selectedPose?.id === poseId) {
//       setSelectedPose(null);
//       setFormData({
//         documentId: '',
//         Name: '',
//         Description: '',
//         Timeup: 0
//       });
//       setPreviewUrl(null);
//       setSelectedImage(null);
//       setSelectedVideo(null);
//       setSelectedStorageImage(null);
//     }
//   };

//   const handleRemoveExistingPose = async (poseId) => {
//     try {
//       if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบท่านี้?')) {
//         // ลบจาก Firestore
//         await deleteDoc(doc(firestore, 'Yoga Pose', poseId));
        
//         // อัปเดต state
//         setPoses(poses.filter(pose => pose.id !== poseId));
        
//         // ลบข้อมูลการแก้ไขของท่านี้ออกด้วย
//         const updatedEditedPoses = { ...editedPoses };
//         delete updatedEditedPoses[poseId];
//         setEditedPoses(updatedEditedPoses);
        
//         // ลบการอัปเดตรูปภาพและวิดีโอ
//         const updatedImageUpdates = { ...imageUpdates };
//         delete updatedImageUpdates[poseId];
//         setImageUpdates(updatedImageUpdates);
        
//         const updatedVideoUpdates = { ...videoUpdates };
//         delete updatedVideoUpdates[poseId];
//         setVideoUpdates(updatedVideoUpdates);
        
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
//           setSelectedImage(null);
//           setSelectedVideo(null);
//           setSelectedStorageImage(null);
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
//   };

//   // ฟังก์ชันสำหรับการอัปโหลดรูปภาพใหม่
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file && selectedPose) {
//       const url = URL.createObjectURL(file);
//       setSelectedImage(file);
//       setPreviewUrl(url);
//       setSelectedStorageImage(null);
      
//       // เก็บข้อมูลการอัปเดตรูปภาพ
//       setImageUpdates(prev => ({
//         ...prev,
//         [selectedPose.id]: {
//           file: file,
//           url: url,
//           fileName: file.name,
//           isNewUpload: true
//         }
//       }));
      
//       // อัปเดต newPoses กรณีเป็นท่าใหม่
//       if (selectedPose.isNew) {
//         setNewPoses(prev => prev.map(pose => 
//           pose.id === selectedPose.id 
//             ? { 
//                 ...pose, 
//                 previewUrl: url, 
//                 image: file,
//                 Picture: file.name,
//                 isNewUpload: true
//               }
//             : pose
//         ));
//       }
//     }
//   };

//   const handleVideoChange = (e) => {
//     const file = e.target.files[0];
//     if (file && selectedPose) {
//       setSelectedVideo(file);
      
//       // เก็บข้อมูลการอัปเดตวิดีโอ
//       setVideoUpdates(prev => ({
//         ...prev,
//         [selectedPose.id]: file
//       }));
      
//       // เก็บชื่อไฟล์วิดีโอ
//       setVideoFileNames(prev => ({
//         ...prev,
//         [selectedPose.id]: file.name
//       }));
      
//       // อัปเดต newPoses กรณีเป็นท่าใหม่
//       if (selectedPose.isNew) {
//         setNewPoses(prev => prev.map(pose => 
//           pose.id === selectedPose.id 
//             ? { ...pose, video: file, videoFileName: file.name }
//             : pose
//         ));
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // บันทึกข้อมูลท่าปัจจุบันก่อนบันทึกลง Firestore
//     saveCurrentChanges();
    
//     try {
//       // Get program reference
//       const programRef = doc(firestore, 'Yoga Program', programId);
//       const storage = getStorage();
  
//       // ** เพิ่มฟังก์ชัน uploadImageToStorage **
//       const uploadImageToStorage = async (file) => {
//         try {
//           console.log("Uploading image:", file.name);
//           const storageRef = ref(storage, `Yogapose/${file.name}`);
//           await uploadBytes(storageRef, file);
//           console.log("Uploaded image successfully:", file.name);
//           return file.name;
//         } catch (error) {
//           console.error("Error uploading image:", error);
//           throw error;
//         }
//       };
  
//       // ** เพิ่มฟังก์ชัน uploadVideoToStorage **
//       const uploadVideoToStorage = async (file) => {
//         try {
//           console.log("Uploading video:", file.name);
//           const storageRef = ref(storage, `YogaVideos/${file.name}`);
//           await uploadBytes(storageRef, file);
//           console.log("Uploaded video successfully:", file.name);
//           return file.name;
//         } catch (error) {
//           console.error("Error uploading video:", error);
//           throw error;
//         }
//       };
  
//       // ตรวจสอบว่าท่าใหม่ทุกท่ามี Document ID
//       for (const pose of newPoses) {
//         if (!pose.documentId) {
//           alert(`กรุณากรอก Document ID สำหรับท่า ${pose.Name || 'ท่าใหม่'}`);
//           return;
//         }
//       }
  
//       // บันทึกท่าใหม่ทั้งหมด
//       for (const pose of newPoses) {
//         const poseData = editedPoses[pose.id] || pose;
        
//         const saveData = {
//           Name: poseData.Name || '',
//           Description: poseData.Description || '',
//           Timeup: Number(poseData.Timeup) || 0,
//           Program: programRef,
//         };
  
//         // เพิ่มรูปภาพถ้ามี
//         if (imageUpdates[pose.id]) {
//           if (imageUpdates[pose.id].isNewUpload && imageUpdates[pose.id].file) {
//             // ** เปลี่ยนจากเดิม: อัปโหลดรูปภาพใหม่ไปยัง Storage จริงๆ **
//             const fileName = await uploadImageToStorage(imageUpdates[pose.id].file);
//             saveData.Picture = fileName;
//           } else if (imageUpdates[pose.id].storagePath) {
//             // เลือกรูปภาพจาก Storage - ใช้ชื่อไฟล์จาก Storage
//             saveData.Picture = imageUpdates[pose.id].fileName;
//           }
//         } else if (pose.image) {
//           // ** เปลี่ยนจากเดิม: อัปโหลดรูปภาพใหม่ไปยัง Storage จริงๆ **
//           const fileName = await uploadImageToStorage(pose.image);
//           saveData.Picture = fileName;
//         } else if (pose.Picture) {
//           saveData.Picture = pose.Picture;
//         }
  
//         // เพิ่มวิดีโอถ้ามี
//         if (videoUpdates[pose.id]) {
//           // ** เปลี่ยนจากเดิม: อัปโหลดวิดีโอไปยัง Storage จริงๆ **
//           const fileName = await uploadVideoToStorage(videoUpdates[pose.id]);
//           saveData.Video = fileName;
//         } else if (pose.video) {
//           // ** เปลี่ยนจากเดิม: อัปโหลดวิดีโอไปยัง Storage จริงๆ **
//           const fileName = await uploadVideoToStorage(pose.video);
//           saveData.Video = fileName;
//         }
  
//         // บันทึกลง Firestore
//         await setDoc(doc(firestore, 'Yoga Pose', poseData.documentId), saveData);
//       }
  
//       // อัปเดตท่าที่มีอยู่แล้ว
//       for (const poseId in editedPoses) {
//         // ข้ามท่าใหม่เพราะได้บันทึกไปแล้ว
//         if (newPoses.some(pose => pose.id === poseId)) continue;
        
//         // ข้ามถ้าไม่พบท่านี้ในรายการท่าที่มีอยู่ (อาจถูกลบไปแล้ว)
//         if (!poses.some(pose => pose.id === poseId)) continue;
        
//         const poseData = editedPoses[poseId];
//         const saveData = {
//           Name: poseData.Name,
//           Description: poseData.Description,
//           Timeup: Number(poseData.Timeup),
//           Program: programRef
//         };
  
//         // เพิ่มรูปภาพถ้ามีการอัปเดต
//         if (imageUpdates[poseId]) {
//           if (imageUpdates[poseId].isNewUpload && imageUpdates[poseId].file) {
//             // ** เปลี่ยนจากเดิม: อัปโหลดรูปภาพใหม่ไปยัง Storage จริงๆ **
//             const fileName = await uploadImageToStorage(imageUpdates[poseId].file);
//             saveData.Picture = fileName;
//           } else if (imageUpdates[poseId].storagePath) {
//             // เลือกรูปภาพจาก Storage
//             saveData.Picture = imageUpdates[poseId].fileName;
//           }
//         }
  
//         // เพิ่มวิดีโอถ้ามีการอัปเดต
//         if (videoUpdates[poseId]) {
//           // ** เปลี่ยนจากเดิม: อัปโหลดวิดีโอไปยัง Storage จริงๆ **
//           const fileName = await uploadVideoToStorage(videoUpdates[poseId]);
//           saveData.Video = fileName;
//         }
  
//         // บันทึกลง Firestore
//         await setDoc(doc(firestore, 'Yoga Pose', poseId), saveData, { merge: true });
//       }
      
//       // แสดงข้อความสำเร็จ
//       alert('บันทึกท่าโยคะเรียบร้อยแล้ว');
  
//       // กลับไปหน้าแสดงรายการท่า
//       navigate(`/yoga-pose/${programId}`);
//     } catch (error) {
//       console.error('Error saving poses:', error);
//       alert('เกิดข้อผิดพลาดในการบันทึก: ' + error.message);
//     }
//   };

//   // ฟังก์ชันสำหรับการเปิดแกลเลอรี่รูปภาพ
//   const handleOpenGallery = () => {
//     setShowGallery(true);
//     // รีโหลดรูปภาพจาก Storage ทุกครั้งที่เปิดแกลเลอรี่
//     loadStorageImages();
//   };

//   // ฟังก์ชันสำหรับการปิดแกลเลอรี่รูปภาพ
//   const handleCloseGallery = () => {
//     setShowGallery(false);
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
//   <div 
//     key={pose.id}
//     className={`pose-item ${selectedPose?.id === pose.id ? 'selected' : ''}`}
//     onClick={() => handlePoseSelect(pose)}
//   >
//     <img src={imageUpdates[pose.id]?.url || pose.imageUrl || getLocalImage(pose.Picture)} alt={editedPoses[pose.id]?.Name || pose.Name} />
//     <button 
//       className="remove-pose-btn"
//       onClick={(e) => {
//         e.stopPropagation();
//         handleRemoveExistingPose(pose.id);
//       }}
//     >
//       <Trash2 size={18} />
//     </button>
//     <div className="pose-info">
//       <h3>{editedPoses[pose.id]?.Name || pose.Name}</h3>
//       <p>{editedPoses[pose.id]?.Timeup || pose.Timeup} นาที</p>
//     </div>
//   </div>
// ))}
            
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
//                   <h3>{editedPoses[pose.id]?.Name || pose.Name || 'ท่าใหม่'}</h3>
//                   <p>{editedPoses[pose.id]?.Timeup || pose.Timeup || 0} นาที</p>
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
//                   {/* แสดงตัวอย่างรูปภาพ */}
//                   <div className="image-preview-container">
//                     {previewUrl ? (
//                       <img src={previewUrl} alt="Preview" className="image-preview" />
//                     ) : (
//                       <div className="upload-placeholder">
//                         <span className="plus-icon">+</span>
//                       </div>
//                     )}
//                   </div>
                  
//                   {/* ปุ่มสำหรับเลือกวิธีการจัดการรูปภาพ */}
//                   <div className="image-buttons">
//                     <div className="image-option">
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={handleImageChange}
//                         id="image-upload"
//                         className="image-input"
//                         style={{ display: 'none' }}
//                       />
//                       <label htmlFor="image-upload" className="image-button">
//                         <Upload size={16} />
//                         <span>อัปโหลดรูปใหม่</span>
//                       </label>
//                     </div>
                    
//                     <div className="image-option">
//                       <button 
//                         type="button" 
//                         className="image-button"
//                         onClick={handleOpenGallery}
//                       >
//                         <span>เลือกจากรูปที่มีอยู่</span>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* แกลเลอรี่รูปภาพ */}
//                 {showGallery && (
//                   <div className="image-gallery-overlay">
//                     <div className="image-gallery">
//                       <div className="gallery-header">
//                         <h3>เลือกรูปภาพจากที่มีอยู่</h3>
//                         <button 
//                           type="button" 
//                           className="close-gallery"
//                           onClick={handleCloseGallery}
//                         >
//                           <X size={20} />
//                         </button>
//                       </div>
                      
//                       {isLoadingGallery ? (
//                         <div className="gallery-loading">กำลังโหลดรูปภาพ...</div>
//                       ) : (
//                         <div className="gallery-grid">
//                           {storageImages.map((image, index) => (
//                             <div 
//                               key={index} 
//                               className={`gallery-item ${selectedStorageImage?.name === image.name ? 'selected' : ''}`}
//                               onClick={() => handleSelectStorageImage(image)}
//                             >
//                               <img src={image.url} alt={image.name} />
//                               <div className="image-name">{image.name}</div>
//                             </div>
//                           ))}
                          
//                           {storageImages.length === 0 && (
//                             <div className="no-images">ไม่พบรูปภาพใน Storage</div>
//                           )}
//                         </div>
//                       )}
                      
//                       <div className="gallery-actions">
//                         <button 
//                           type="button" 
//                           className="gallery-cancel"
//                           onClick={handleCloseGallery}
//                         >
//                           ยกเลิก
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 )}
                
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
//                     <div className="video-upload-container">
//                       <input
//                         type="file"
//                         accept="video/*"
//                         onChange={handleVideoChange}
//                         id="video-upload"
//                         className="video-input"
//                       />
//                       <div className="video-info">
//                         {selectedVideo ? (
//                           <div className="selected-video-name">
//                             {selectedVideo.name}
//                           </div>
//                         ) : (
//                           videoFileNames[selectedPose?.id] ? (
//                             <div className="selected-video-name">
//                               {videoFileNames[selectedPose.id]}
//                             </div>
//                           ) : (
//                             selectedPose && !selectedPose.isNew && selectedPose.Video ? (
//                               <div className="selected-video-name">
//                                 {selectedPose.Video}
//                               </div>
//                             ) : null
//                           )
//                         )}
//                       </div>
//                     </div>
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
import { getStorage, ref,uploadBytes, listAll, getDownloadURL } from 'firebase/storage';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../Components/navbar';
import { Trash2, Upload, X } from 'lucide-react';

import './AddYogaPose.css';


const AddYogaPose = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const [poses, setPoses] = useState([]);
  const [selectedPose, setSelectedPose] = useState(null);
  const [newPoses, setNewPoses] = useState([]);
  const [programData, setProgramData] = useState(null);
  
  // เปลี่ยนจากการใช้ formData เป็น editedPoses เพื่อเก็บข้อมูลที่ถูกแก้ไขแล้ว
  const [editedPoses, setEditedPoses] = useState({});
  const [formData, setFormData] = useState({
    documentId: '',
    Name: '',
    Description: '',
    Timeup: 0,
  });

  // State สำหรับจัดการรูปภาพ
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [imageUpdates, setImageUpdates] = useState({});
  const [videoUpdates, setVideoUpdates] = useState({});
  const [videoFileNames, setVideoFileNames] = useState({});
  
  // State สำหรับจัดการแกลเลอรี่รูปภาพจาก Storage
  const [showGallery, setShowGallery] = useState(false);
  const [storageImages, setStorageImages] = useState([]);
  const [selectedStorageImage, setSelectedStorageImage] = useState(null);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);

  // State สำหรับจัดการแกลเลอรี่วิดีโอจาก Storage
  const [showVideoGallery, setShowVideoGallery] = useState(false);
  const [storageVideos, setStorageVideos] = useState([]);
  const [selectedStorageVideo, setSelectedStorageVideo] = useState(null);
  const [isLoadingVideoGallery, setIsLoadingVideoGallery] = useState(false);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);

  const getLocalImage = (imageName) => {
    try {
      return new URL(`../../img/${imageName}`, import.meta.url).href;
    } catch (error) {
      console.error("Error loading image:", imageName, error);
      return null;
    }
  };

  // ฟังก์ชันสำหรับการโหลดรูปภาพจาก Firebase Storage
  const loadStorageImages = async () => {
    setIsLoadingGallery(true);
    try {
      const storage = getStorage();
      const yogaPoseRef = ref(storage, 'Yogapose');
      
      // ดึงรายการไฟล์ทั้งหมดจากโฟลเดอร์ Yogapose
      const result = await listAll(yogaPoseRef);
      
      // แปลงเป็นข้อมูลที่พร้อมใช้งาน
      const images = await Promise.all(
        result.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return {
            name: itemRef.name,
            url: url,
            path: `Yogapose/${itemRef.name}`
          };
        })
      );
      
      setStorageImages(images);
    } catch (error) {
      console.error("Error loading images from storage:", error);
      alert("ไม่สามารถโหลดรูปภาพจาก Storage ได้");
    } finally {
      setIsLoadingGallery(false);
    }
  };

  // ฟังก์ชันสำหรับการโหลดวิดีโอจาก Firebase Storage
  const loadStorageVideos = async () => {
    setIsLoadingVideoGallery(true);
    try {
      const storage = getStorage();
      const yogaVideoRef = ref(storage, 'Yogavideo'); // แก้ path ตามที่เก็บจริง
      
      // ดึงรายการไฟล์ทั้งหมดจากโฟลเดอร์ YogaVideos
      const result = await listAll(yogaVideoRef);
      
      // แปลงเป็นข้อมูลที่พร้อมใช้งาน
      const videos = await Promise.all(
        result.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return {
            name: itemRef.name,
            url: url,
            path: `Yogavideo/${itemRef.name}`
          };
        })
      );
      
      setStorageVideos(videos);
    } catch (error) {
      console.error("Error loading videos from storage:", error);
      alert("ไม่สามารถโหลดวิดีโอจาก Storage ได้");
    } finally {
      setIsLoadingVideoGallery(false);
    }
  };

  // ฟังก์ชันสำหรับเลือกรูปภาพจากแกลเลอรี่
  const handleSelectStorageImage = (image) => {
    if (selectedPose) {
      setSelectedStorageImage(image);
      setPreviewUrl(image.url);
      
      // เก็บข้อมูลการเลือกรูปภาพจาก Storage
      setImageUpdates(prev => ({
        ...prev,
        [selectedPose.id]: {
          url: image.url,
          storagePath: image.path,
          fileName: image.name
        }
      }));
      
      // อัปเดต newPoses กรณีเป็นท่าใหม่
      if (selectedPose.isNew) {
        setNewPoses(prev => prev.map(pose => 
          pose.id === selectedPose.id 
            ? { 
                ...pose, 
                previewUrl: image.url, 
                storagePath: image.path,
                Picture: image.name 
              }
            : pose
        ));
      }
    }
    
    setShowGallery(false);
  };

  // ฟังก์ชันสำหรับเลือกวิดีโอจากแกลเลอรี่
  const handleSelectStorageVideo = (video) => {
    if (selectedPose) {
      setSelectedStorageVideo(video);
      setVideoPreviewUrl(video.url);
      
      // เก็บข้อมูลการเลือกวิดีโอจาก Storage
      setVideoUpdates(prev => ({
        ...prev,
        [selectedPose.id]: {
          url: video.url,
          storagePath: video.path,
          fileName: video.name,
          fromStorage: true
        }
      }));
      
      // อัปเดตชื่อไฟล์วิดีโอ
      setVideoFileNames(prev => ({
        ...prev,
        [selectedPose.id]: video.name
      }));
      
      // อัปเดต newPoses กรณีเป็นท่าใหม่
      if (selectedPose.isNew) {
        setNewPoses(prev => prev.map(pose => 
          pose.id === selectedPose.id 
            ? { 
                ...pose, 
                videoUrl: video.url, 
                videoStoragePath: video.path,
                Video: video.name,
                videoFromStorage: true 
              }
            : pose
        ));
      }
    }
    
    setShowVideoGallery(false);
  };

  // เพิ่มฟังก์ชันนี้ข้างนอก useEffect เพื่อใช้โหลดรูปภาพจาก Storage
  const loadImageFromStorage = async (imageName) => {
    if (!imageName) return null;
    try {
      const storage = getStorage();
      const pathReference = ref(storage, `Yogapose/${imageName}`);
      const url = await getDownloadURL(pathReference);
      return url;
    } catch (error) {
      console.error("Error loading image from storage:", error, imageName);
      return null;
    }
  };
  
  // เพิ่มฟังก์ชันโหลดวิดีโอจาก Storage
  const loadVideoFromStorage = async (videoName) => {
    if (!videoName) return null;
    try {
      const storage = getStorage();
      const pathReference = ref(storage, `Yogavideo/${videoName}`);
      const url = await getDownloadURL(pathReference);
      return url;
    } catch (error) {
      console.error("Error loading video from storage:", error, videoName);
      return null;
    }
  };


  // แก้ไข useEffect ที่โหลดข้อมูลท่า
useEffect(() => {
  const fetchProgramAndPoses = async () => {
    try {
      // Fetch program details first (โค้ดเดิม)
      const programRef = doc(firestore, "Yoga Program", programId);
      const programSnap = await getDoc(programRef);
      
      if (programSnap.exists()) {
        const data = programSnap.data();
        // โหลดรูปจาก Storage แทน getLocalImage
        let programImageUrl = null;
        if (data.Picture) {
          programImageUrl = await loadImageFromStorage(data.Picture);
        }
        
        setProgramData({
          id: programSnap.id,
          ...data,
          Picture: programImageUrl || data.Picture // ใช้ URL จาก Storage หรือใช้ค่าเดิมถ้าโหลดไม่สำเร็จ
        });
      }

      // Then fetch poses
      const posesQuery = query(
        collection(firestore, "Yoga Pose"),
        where("Program", "==", programRef)
      );
      const posesSnapshot = await getDocs(posesQuery);
      
      // สร้างอาร์เรย์เพื่อเก็บ Promise ทั้งหมด
      const posesPromises = posesSnapshot.docs.map(async (doc) => {
        const poseData = doc.data();
        // โหลดรูปจาก Storage
        let imageUrl = null;
        if (poseData.Picture) {
          imageUrl = await loadImageFromStorage(poseData.Picture);
        }
        
        // โหลดวิดีโอจาก Storage
        let videoUrl = null;
        if (poseData.Video) {
          videoUrl = await loadVideoFromStorage(poseData.Video);
        }
        
        return {
          id: doc.id,
          ...poseData,
          imageUrl: imageUrl, // เก็บ URL ของรูปภาพจาก Storage ไว้ใน state
          videoUrl: videoUrl // เก็บ URL ของวิดีโอจาก Storage ไว้ใน state
        };
      });
      
      // รอให้โหลดรูปทั้งหมดเสร็จ
      const posesList = await Promise.all(posesPromises);
      setPoses(posesList);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchProgramAndPoses();
  
  // โหลดรูปภาพจาก Storage ตั้งแต่เริ่มต้น
  loadStorageImages();
  
  // โหลดวิดีโอจาก Storage ตั้งแต่เริ่มต้น
  loadStorageVideos();
}, [programId]);

  // บันทึกข้อมูลที่กำลังแก้ไขก่อนเปลี่ยนไปเลือกท่าอื่น
  const saveCurrentChanges = () => {
    if (selectedPose) {
      const poseId = selectedPose.id;
      setEditedPoses(prev => ({
        ...prev,
        [poseId]: {
          ...formData
        }
      }));
      
      // ถ้าเป็นท่าใหม่ให้อัปเดต newPoses ด้วย
      if (selectedPose.isNew) {
        setNewPoses(prev => prev.map(pose => 
          pose.id === poseId 
            ? { 
                ...pose, 
                documentId: formData.documentId,
                Name: formData.Name,
                Description: formData.Description,
                Timeup: formData.Timeup
              }
            : pose
        ));
      } else {
        // อัปเดตข้อมูลในท่าที่มีอยู่แล้ว
        setPoses(prev => prev.map(pose => 
          pose.id === poseId 
            ? { 
                ...pose, 
                Name: formData.Name,
                Description: formData.Description,
                Timeup: formData.Timeup
              }
            : pose
        ));
      }
    }
  };

  const handlePoseSelect = (pose) => {
    // บันทึกข้อมูลท่าปัจจุบันก่อนเปลี่ยนไปเลือกท่าอื่น
    saveCurrentChanges();
    
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
      setVideoPreviewUrl(newPose.videoUrl || null);
    } else {
      // ถ้าเป็นท่าที่มีอยู่แล้ว ตรวจสอบว่ามีการแก้ไขไว้หรือไม่
      if (editedPoses[pose.id]) {
        setFormData(editedPoses[pose.id]);
      } else {
        setFormData({
          documentId: pose.id,
          Name: pose.Name,
          Description: pose.Description,
          Timeup: pose.Timeup
        });
      }
      
      // ตรวจสอบว่ามีการอัปเดตรูปภาพหรือไม่
      if (imageUpdates[pose.id]) {
        setPreviewUrl(imageUpdates[pose.id].url);
        setSelectedImage(imageUpdates[pose.id].file);
        setSelectedStorageImage(imageUpdates[pose.id].storagePath ? {
          name: imageUpdates[pose.id].fileName,
          path: imageUpdates[pose.id].storagePath,
          url: imageUpdates[pose.id].url
        } : null);
      } else {
        // โหลดรูปภาพจาก Firebase Storage
        if (pose.Picture) {
          const storage = getStorage();
          const pathReference = ref(storage, `Yogapose/${pose.Picture}`);
          
          getDownloadURL(pathReference)
            .then((url) => {
              console.log("Loaded image URL:", url); // เพิ่ม log นี้เพื่อดูว่าได้ URL จริงหรือไม่
              setPreviewUrl(url);
            })
            .catch((error) => {
              console.error("Error loading image from storage:", error);
              setPreviewUrl(getLocalImage(pose.Picture));
            });
        } else {
          setPreviewUrl(null);
        }
        
        setSelectedImage(null);
        setSelectedStorageImage(null);
      }
      
      // ตรวจสอบว่ามีการอัปเดตวิดีโอหรือไม่
      if (videoUpdates[pose.id]) {
        if (videoUpdates[pose.id].fromStorage) {
          setSelectedVideo(null);
          setVideoPreviewUrl(videoUpdates[pose.id].url);
          setSelectedStorageVideo({
            name: videoUpdates[pose.id].fileName,
            path: videoUpdates[pose.id].storagePath,
            url: videoUpdates[pose.id].url
          });
        } else {
          setSelectedVideo(videoUpdates[pose.id]);
          setVideoPreviewUrl(null);
          setSelectedStorageVideo(null);
        }
      } else {
        // โหลดวิดีโอจาก Firebase Storage ถ้ามี
        if (pose.Video) {
          loadVideoFromStorage(pose.Video)
            .then((url) => {
              setVideoPreviewUrl(url);
            })
            .catch((error) => {
              console.error("Error loading video from storage:", error);
              setVideoPreviewUrl(null);
            });
        } else {
          setVideoPreviewUrl(null);
        }
        
        setSelectedVideo(null);
        setSelectedStorageVideo(null);
      }
    }
  };

  const handleAddNew = () => {
    // บันทึกข้อมูลท่าปัจจุบันก่อนเพิ่มท่าใหม่
    saveCurrentChanges();
    
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
    setVideoPreviewUrl(null);
    setSelectedStorageVideo(null);
    setSelectedStorageImage(null);
  };

  const handleRemoveNewPose = (poseId) => {
    setNewPoses(newPoses.filter(pose => pose.id !== poseId));
    
    // ลบข้อมูลการแก้ไขของท่านี้ออกด้วย
    const updatedEditedPoses = { ...editedPoses };
    delete updatedEditedPoses[poseId];
    setEditedPoses(updatedEditedPoses);
    
    if (selectedPose?.id === poseId) {
      setSelectedPose(null);
      setFormData({
        documentId: '',
        Name: '',
        Description: '',
        Timeup: 0
      });
      setPreviewUrl(null);
      setSelectedImage(null);
      setSelectedVideo(null);
      setVideoPreviewUrl(null);
      setSelectedStorageVideo(null);
      setSelectedStorageImage(null);
    }
  };

  const handleRemoveExistingPose = async (poseId) => {
    try {
      if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบท่านี้?')) {
        // ลบจาก Firestore
        await deleteDoc(doc(firestore, 'Yoga Pose', poseId));
        
        // อัปเดต state
        setPoses(poses.filter(pose => pose.id !== poseId));
        
        // ลบข้อมูลการแก้ไขของท่านี้ออกด้วย
        const updatedEditedPoses = { ...editedPoses };
        delete updatedEditedPoses[poseId];
        setEditedPoses(updatedEditedPoses);
        
        // ลบการอัปเดตรูปภาพและวิดีโอ
        const updatedImageUpdates = { ...imageUpdates };
        delete updatedImageUpdates[poseId];
        setImageUpdates(updatedImageUpdates);
        
        const updatedVideoUpdates = { ...videoUpdates };
        delete updatedVideoUpdates[poseId];
        setVideoUpdates(updatedVideoUpdates);
        
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
          setSelectedImage(null);
          setSelectedVideo(null);
          setVideoPreviewUrl(null);
          setSelectedStorageVideo(null);
          setSelectedStorageImage(null);
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
  };

  // ฟังก์ชันสำหรับการอัปโหลดรูปภาพใหม่
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && selectedPose) {
      const url = URL.createObjectURL(file);
      setSelectedImage(file);
      setPreviewUrl(url);
      setSelectedStorageImage(null);
      
      // เก็บข้อมูลการอัปเดตรูปภาพ
      setImageUpdates(prev => ({
        ...prev,
        [selectedPose.id]: {
          file: file,
          url: url,
          fileName: file.name,
          isNewUpload: true
        }
      }));
      
      // อัปเดต newPoses กรณีเป็นท่าใหม่
      if (selectedPose.isNew) {
        setNewPoses(prev => prev.map(pose => 
          pose.id === selectedPose.id 
            ? { 
                ...pose, 
                previewUrl: url, 
                image: file,
                Picture: file.name,
                isNewUpload: true
              }
            : pose
        ));
      }
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file && selectedPose) {
      setSelectedVideo(file);
      setVideoPreviewUrl(null);
      setSelectedStorageVideo(null);
      
      // เก็บข้อมูลการอัปเดตวิดีโอ
      setVideoUpdates(prev => ({
        ...prev,
        [selectedPose.id]: file
      }));
      
      // เก็บชื่อไฟล์วิดีโอ
      setVideoFileNames(prev => ({
        ...prev,
        [selectedPose.id]: file.name
      }));
      
      // อัปเดต newPoses กรณีเป็นท่าใหม่
      if (selectedPose.isNew) {
        setNewPoses(prev => prev.map(pose => 
          pose.id === selectedPose.id 
            ? { ...pose, video: file, videoFileName: file.name }
            : pose
        ));
      }
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // บันทึกข้อมูลท่าปัจจุบันก่อนบันทึกลง Firestore
  saveCurrentChanges();
  
  try {
    // Get program reference
    const programRef = doc(firestore, 'Yoga Program', programId);
    const storage = getStorage();

    // ** เพิ่มฟังก์ชัน uploadImageToStorage **
    const uploadImageToStorage = async (file) => {
      try {
        console.log("Uploading image:", file.name);
        const storageRef = ref(storage, `Yogapose/${file.name}`);
        await uploadBytes(storageRef, file);
        console.log("Uploaded image successfully:", file.name);
        return file.name;
      } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
      }
    };

    // ** เพิ่มฟังก์ชัน uploadVideoToStorage **
    const uploadVideoToStorage = async (file) => {
      try {
        console.log("Uploading video:", file.name);
        const storageRef = ref(storage, `Yogavideo/${file.name}`);
        await uploadBytes(storageRef, file);
        console.log("Uploaded video successfully:", file.name);
        return file.name;
      } catch (error) {
        console.error("Error uploading video:", error);
        throw error;
      }
    };

    // ตรวจสอบว่าท่าใหม่ทุกท่ามี Document ID
    for (const pose of newPoses) {
      if (!pose.documentId) {
        alert(`กรุณากรอก Document ID สำหรับท่า ${pose.Name || 'ท่าใหม่'}`);
        return;
      }
    }

    // บันทึกท่าใหม่ทั้งหมด
    for (const pose of newPoses) {
      const poseData = editedPoses[pose.id] || pose;
      
      const saveData = {
        Name: poseData.Name || '',
        Description: poseData.Description || '',
        Timeup: Number(poseData.Timeup) || 0,
        Program: programRef,
      };

      // เพิ่มรูปภาพถ้ามี
      if (imageUpdates[pose.id]) {
        if (imageUpdates[pose.id].isNewUpload && imageUpdates[pose.id].file) {
          // ** เปลี่ยนจากเดิม: อัปโหลดรูปภาพใหม่ไปยัง Storage จริงๆ **
          const fileName = await uploadImageToStorage(imageUpdates[pose.id].file);
          saveData.Picture = fileName;
        } else if (imageUpdates[pose.id].storagePath) {
          // เลือกรูปภาพจาก Storage - ใช้ชื่อไฟล์จาก Storage
          saveData.Picture = imageUpdates[pose.id].fileName;
        }
      } else if (pose.image) {
        // ** เปลี่ยนจากเดิม: อัปโหลดรูปภาพใหม่ไปยัง Storage จริงๆ **
        const fileName = await uploadImageToStorage(pose.image);
        saveData.Picture = fileName;
      } else if (pose.Picture) {
        saveData.Picture = pose.Picture;
      }

      // เพิ่มวิดีโอถ้ามี
      if (videoUpdates[pose.id]) {
        if (videoUpdates[pose.id].fromStorage) {
          // เลือกวิดีโอจาก Storage - ใช้ชื่อไฟล์จาก Storage
          saveData.Video = videoUpdates[pose.id].fileName;
        } else {
          // อัปโหลดวิดีโอใหม่
          const fileName = await uploadVideoToStorage(videoUpdates[pose.id]);
          saveData.Video = fileName;
        }
      } else if (pose.video) {
        // อัปโหลดวิดีโอใหม่จาก pose.video
        const fileName = await uploadVideoToStorage(pose.video);
        saveData.Video = fileName;
      } else if (pose.Video && pose.videoFromStorage) {
        // ใช้วิดีโอจาก Storage ที่เลือกไว้
        saveData.Video = pose.Video;
      }

      // บันทึกลง Firestore
      await setDoc(doc(firestore, 'Yoga Pose', poseData.documentId), saveData);
    }

    // อัปเดตท่าที่มีอยู่แล้ว
    for (const poseId in editedPoses) {
      // ข้ามท่าใหม่เพราะได้บันทึกไปแล้ว
      if (newPoses.some(pose => pose.id === poseId)) continue;
      
      // ข้ามถ้าไม่พบท่านี้ในรายการท่าที่มีอยู่ (อาจถูกลบไปแล้ว)
      if (!poses.some(pose => pose.id === poseId)) continue;
      
      const poseData = editedPoses[poseId];
      const saveData = {
        Name: poseData.Name,
        Description: poseData.Description,
        Timeup: Number(poseData.Timeup),
        Program: programRef
      };

      // เพิ่มรูปภาพถ้ามีการอัปเดต
      if (imageUpdates[poseId]) {
        if (imageUpdates[poseId].isNewUpload && imageUpdates[poseId].file) {
          // อัปโหลดรูปภาพใหม่ไปยัง Storage
          const fileName = await uploadImageToStorage(imageUpdates[poseId].file);
          saveData.Picture = fileName;
        } else if (imageUpdates[poseId].storagePath) {
          // เลือกรูปภาพจาก Storage
          saveData.Picture = imageUpdates[poseId].fileName;
        }
      }

      // เพิ่มวิดีโอถ้ามีการอัปเดต
      if (videoUpdates[poseId]) {
        if (videoUpdates[poseId].fromStorage) {
          // เลือกวิดีโอจาก Storage
          saveData.Video = videoUpdates[poseId].fileName;
        } else {
          // อัปโหลดวิดีโอใหม่
          const fileName = await uploadVideoToStorage(videoUpdates[poseId]);
          saveData.Video = fileName;
        }
      }

      // บันทึกลง Firestore
      await setDoc(doc(firestore, 'Yoga Pose', poseId), saveData, { merge: true });
    }
    
    // แสดงข้อความสำเร็จ
    alert('บันทึกท่าโยคะเรียบร้อยแล้ว');

    // กลับไปหน้าแสดงรายการท่า
    navigate(`/yoga-pose/${programId}`);
  } catch (error) {
    console.error('Error saving poses:', error);
    alert('เกิดข้อผิดพลาดในการบันทึก: ' + error.message);
  }
};

  // ฟังก์ชันสำหรับการเปิดแกลเลอรี่รูปภาพ
  const handleOpenGallery = () => {
    setShowGallery(true);
    // รีโหลดรูปภาพจาก Storage ทุกครั้งที่เปิดแกลเลอรี่
    loadStorageImages();
  };

  // ฟังก์ชันสำหรับการปิดแกลเลอรี่รูปภาพ
  const handleCloseGallery = () => {
    setShowGallery(false);
  };

  // ฟังก์ชันสำหรับการเปิดแกลเลอรี่วิดีโอ
  const handleOpenVideoGallery = () => {
    setShowVideoGallery(true);
    // รีโหลดวิดีโอจาก Storage ทุกครั้งที่เปิดแกลเลอรี่
    loadStorageVideos();
  };

  // ฟังก์ชันสำหรับการปิดแกลเลอรี่วิดีโอ
  const handleCloseVideoGallery = () => {
    setShowVideoGallery(false);
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
                <img src={imageUpdates[pose.id]?.url || pose.imageUrl || getLocalImage(pose.Picture)} alt={editedPoses[pose.id]?.Name || pose.Name} />
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
                  <h3>{editedPoses[pose.id]?.Name || pose.Name}</h3>
                  <p>{editedPoses[pose.id]?.Timeup || pose.Timeup} นาที</p>
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
                  <h3>{editedPoses[pose.id]?.Name || pose.Name || 'ท่าใหม่'}</h3>
                  <p>{editedPoses[pose.id]?.Timeup || pose.Timeup || 0} นาที</p>
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
                  {/* แสดงตัวอย่างรูปภาพ */}
                  <div className="image-preview-container">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="image-preview" />
                    ) : (
                      <div className="upload-placeholder">
                        <span className="plus-icon">+</span>
                      </div>
                    )}
                  </div>
                  
                  {/* ปุ่มสำหรับเลือกวิธีการจัดการรูปภาพ */}
                  <div className="image-buttons">
                    <div className="image-option">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        id="image-upload"
                        className="image-input"
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="image-upload" className="image-button">
                        <Upload size={16} />
                        <span>อัปโหลดรูปใหม่</span>
                      </label>
                    </div>
                    
                    <div className="image-option">
                      <button 
                        type="button" 
                        className="image-button"
                        onClick={handleOpenGallery}
                      >
                        <span>เลือกจากรูปที่มีอยู่</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* แกลเลอรี่รูปภาพ */}
                {showGallery && (
                  <div className="image-gallery-overlay">
                    <div className="image-gallery">
                      <div className="gallery-header">
                        <h3>เลือกรูปภาพจากที่มีอยู่</h3>
                        <button 
                          type="button" 
                          className="close-gallery"
                          onClick={handleCloseGallery}
                        >
                          <X size={20} />
                        </button>
                      </div>
                      
                      {isLoadingGallery ? (
                        <div className="gallery-loading">กำลังโหลดรูปภาพ...</div>
                      ) : (
                        <div className="gallery-grid">
                          {storageImages.map((image, index) => (
                            <div 
                              key={index} 
                              className={`gallery-item ${selectedStorageImage?.name === image.name ? 'selected' : ''}`}
                              onClick={() => handleSelectStorageImage(image)}
                            >
                              <img src={image.url} alt={image.name} />
                              <div className="image-name">{image.name}</div>
                            </div>
                          ))}
                          
                          {storageImages.length === 0 && (
                            <div className="no-images">ไม่พบรูปภาพใน Storage</div>
                          )}
                        </div>
                      )}
                      
                      <div className="gallery-actions">
                        <button 
                          type="button" 
                          className="gallery-cancel"
                          onClick={handleCloseGallery}
                        >
                          ยกเลิก
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
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
                    <div className="video-upload-container">
                      {/* แสดงตัวอย่างวิดีโอที่เลือกจาก Storage หรือไม่มีวิดีโอ */}
                      <div className="video-preview-section">
                        {videoPreviewUrl ? (
                          <div className="video-preview">
                            <video src={videoPreviewUrl} controls className="video-player"></video>
                          </div>
                        ) : selectedVideo ? (
                          <div className="selected-video-name">
                            {selectedVideo.name}
                          </div>
                        ) : videoFileNames[selectedPose?.id] ? (
                          <div className="selected-video-name">
                            {videoFileNames[selectedPose.id]}
                          </div>
                        ) : selectedPose && !selectedPose.isNew && selectedPose.Video ? (
                          <div className="selected-video-name">
                            {selectedPose.Video}
                          </div>
                        ) : (
                          <div className="no-video-selected">ยังไม่ได้เลือกวิดีโอ</div>
                        )}
                      </div>
                      
                      {/* ปุ่มสำหรับเลือกวิธีการจัดการวิดีโอ */}
                      <div className="video-buttons">
                        <div className="video-option">
                          <input
                            type="file"
                            accept="video/*"
                            onChange={handleVideoChange}
                            id="video-upload"
                            className="video-input"
                            style={{ display: 'none' }}
                          />
                          <label htmlFor="video-upload" className="video-button">
                            <Upload size={16} />
                            <span>อัปโหลดวิดีโอใหม่</span>
                          </label>
                        </div>
                        
                        <div className="video-option">
                          <button 
                            type="button" 
                            className="video-button"
                            onClick={handleOpenVideoGallery}
                          >
                            <span>เลือกจากวิดีโอที่มีอยู่</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* แกลเลอรี่วิดีโอ */}
              {showVideoGallery && (
                <div className="video-gallery-overlay">
                  <div className="video-gallery">
                    <div className="gallery-header">
                      <h3>เลือกวิดีโอจากที่มีอยู่</h3>
                      <button 
                        type="button" 
                        className="close-gallery"
                        onClick={handleCloseVideoGallery}
                      >
                        <X size={20} />
                      </button>
                    </div>
                    
                    {isLoadingVideoGallery ? (
                      <div className="gallery-loading">กำลังโหลดวิดีโอ...</div>
                    ) : (
                      <div className="video-gallery-grid">
                        {storageVideos.map((video, index) => (
                          <div 
                            key={index} 
                            className={`video-gallery-item ${selectedStorageVideo?.name === video.name ? 'selected' : ''}`}
                            onClick={() => handleSelectStorageVideo(video)}
                          >
                            <div className="video-thumbnail">
                              <video src={video.url} className="video-preview-thumb"></video>
                              <div className="play-icon">▶</div>
                            </div>
                            <div className="video-name">{video.name}</div>
                          </div>
                        ))}
                        
                        {storageVideos.length === 0 && (
                          <div className="no-videos">ไม่พบวิดีโอใน Storage</div>
                        )}
                      </div>
                    )}
                    
                    <div className="gallery-actions">
                      <button 
                        type="button" 
                        className="gallery-cancel"
                        onClick={handleCloseVideoGallery}
                      >
                        ยกเลิก
                      </button>
                    </div>
                  </div>
                </div>
              )}
        
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