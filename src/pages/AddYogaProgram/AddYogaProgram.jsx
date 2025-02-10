import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/navbar';
import './AddYogaProgram.css';

const AddYogaProgram = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    documentId: '',  // New field for document ID
    Name: '',
    Description: '',
    Time_up: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'Time_up' ? Number(value) : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const copyImageToAssets = async (file) => {
    try {
      // Create a copy of the file in the img directory
      // This is a placeholder - you'll need to implement the actual file copying logic
      // based on your project's setup
      return file.name;
    } catch (error) {
      console.error('Error copying image:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!selectedImage) {
        alert('Please select an image');
        return;
      }

      if (!formData.documentId) {
        alert('Please enter a document ID');
        return;
      }

      // Copy image to assets folder
      const fileName = await copyImageToAssets(selectedImage);

      // Create document with custom ID in Firestore
      const docRef = doc(firestore, 'Yoga Program', formData.documentId);
      await setDoc(docRef, {
        Name: formData.Name,
        Description: formData.Description,
        Time_up: formData.Time_up,
        Picture: fileName,
      });

      // Navigate back to yoga program page
      navigate('/yoga-program');
    } catch (error) {
      console.error('Error adding program:', error);
      alert('Error adding program');
    }
  };

  return (
    <div className="add-yoga-page">
      <Navbar />
      <div className="add-yoga-content">
        <h1>ADD PROGRAM</h1>

        <form onSubmit={handleSubmit}>
          <div className="duration-input">
            <span className="duration-label">ระยะเวลาที่ใช้ทั้งหมด</span>
            <input
              type="number"
              name="Time_up"
              value={formData.Time_up}
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
                  placeholder="เช่น YOGA001"
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
                <label>ระยะเวลา :</label>
                <input
                  type="number"
                  value={formData.Time_up}
                  disabled
                />
                <span>นาที</span>
              </div>
            </div>
          </div>

          <div className="button-group">
            <button type="submit" className="save-btn">Save</button>
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => navigate('/yoga-program')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddYogaProgram;