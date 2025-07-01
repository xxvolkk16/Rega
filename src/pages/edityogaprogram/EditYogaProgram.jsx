import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { firestore } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import Navbar from '../../Components/navbar';
import { Upload, X } from 'lucide-react';
import './Edityogaprogram.css';

const EditYogaProgram = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const storage = getStorage();
  
  const [formData, setFormData] = useState({
    Name: '',
    Description: '',
    Picture: '',
    Time_up: 0,
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State สำหรับจัดการแกลเลอรี่รูปภาพจาก Storage
  const [showGallery, setShowGallery] = useState(false);
  const [storageImages, setStorageImages] = useState([]);
  const [selectedStorageImage, setSelectedStorageImage] = useState(null);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);

  // ฟังก์ชันสำหรับการโหลดรูปภาพจาก Firebase Storage
  const loadStorageImages = async () => {
    setIsLoadingGallery(true);
    try {
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

  // ฟังก์ชันสำหรับเลือกรูปภาพจากแกลเลอรี่
  const handleSelectStorageImage = (image) => {
    setSelectedStorageImage(image);
    setPreviewUrl(image.url);
    setFormData(prev => ({
      ...prev,
      Picture: image.name
    }));
    setShowGallery(false);
  };

  useEffect(() => {
    const fetchProgramData = async () => {
      try {
        setIsLoading(true);
        const programDoc = await getDoc(doc(firestore, "Yoga Program", programId));
        
        if (programDoc.exists()) {
          const programData = programDoc.data();
          
          // Set form data from Firestore
          setFormData({
            Name: programData.Name || '',
            Description: programData.Description || '',
            Picture: programData.Picture || '',
            Time_up: programData.Time_up || 0,
          });
          
          // If there's a picture, get its URL for preview
          if (programData.Picture) {
            try {
              const imageUrl = await getDownloadURL(ref(storage, `Yogapose/${programData.Picture}`));
              setPreviewUrl(imageUrl);
            } catch (imageError) {
              console.error("Error loading image:", imageError);
              // Continue without the image preview
            }
          }
        } else {
          setError('Program not found');
          navigate('/yoga-program');
        }
      } catch (err) {
        console.error("Error fetching program data:", err);
        setError('Failed to load program data');
      } finally {
        setIsLoading(false);
      }
    };

    if (programId) {
      fetchProgramData();
    }
  }, [programId, navigate, storage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'Time_up') {
      // Convert to float for Time_up to support decimal values
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Update form data with the file name
      setFormData(prev => ({
        ...prev,
        Picture: file.name
      }));
      
      // Reset selected storage image
      setSelectedStorageImage(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const updatedData = { ...formData };
      
      // If a new image is selected, upload it
      if (imageFile) {
        const storageRef = ref(storage, `Yogapose/${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        updatedData.Picture = imageFile.name;
      } else if (selectedStorageImage) {
        // If an image was selected from storage
        updatedData.Picture = selectedStorageImage.name;
      }
      
      // Update the document in Firestore
      await updateDoc(doc(firestore, "Yoga Program", programId), updatedData);
      
      // Navigate back to yoga program page
      navigate('/yoga-program');
      
    } catch (err) {
      console.error("Error updating program:", err);
      setError('Failed to update program');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/yoga-program');
  };

  if (isLoading) {
    return (
      <div className="edit-yoga-container">
        <Navbar />
        <div className="edit-yoga-content">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="edit-yoga-container">
        <Navbar />
        <div className="edit-yoga-content">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={handleCancel}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-yoga-container">
      <Navbar />
      <div className="edit-yoga-content">
        <h1>Edit Yoga Program</h1>
        
        <form onSubmit={handleSubmit} className="edit-yoga-form">
          <div className="edit-yoga-form-group">
            <label htmlFor="Name">Program Name</label>
            <input
              type="text"
              id="Name"
              name="Name"
              value={formData.Name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="edit-yoga-form-group">
            <label htmlFor="Description">Description</label>
            <textarea
              id="Description"
              name="Description"
              value={formData.Description}
              onChange={handleInputChange}
              rows="5"
              required
            />
          </div>
          
          <div className="edit-yoga-form-group">
            <label htmlFor="Time_up">Duration (minutes)</label>
            <input
              type="number"
              id="Time_up"
              name="Time_up"
              value={formData.Time_up}
              onChange={handleInputChange}
              min="0.1"
              step="0.1"
              required
            />
          </div>
          
          <div className="edit-yoga-form-group">
            <label htmlFor="Picture">Program Image</label>
            <div className="program-image-section">
              <div className="image-preview-wrapper">
                <div className="program-image-preview">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" />
                  ) : (
                    <div className="upload-placeholder">
                      <span>+</span>
                    </div>
                  )}
                </div>
                
                <div className="image-buttons-container">
                  <div className="image-option">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      id="image-upload"
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="image-upload" className="image-button">
                      <Upload size={16} />
                      <span>อัปโหลดรูปใหม่</span>
                    </label>
                  </div>
                  
                  <button 
                    type="button" 
                    className="image-button"
                    onClick={handleOpenGallery}
                  >
                    <span>เลือกจากรูปที่มีอยู่</span>
                  </button>
                </div>
                
                {formData.Picture && (
                  <div className="current-image-name">
                    Current image: {formData.Picture}
                  </div>
                )}
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
                            className={`gallery-item ${selectedStorageImage?.name === image.name || formData.Picture === image.name ? 'selected' : ''}`}
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
                        className="gallery-button"
                        onClick={handleCloseGallery}
                      >
                        ยกเลิก
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Update Program
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditYogaProgram;