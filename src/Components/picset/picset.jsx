import React, { useState } from 'react';
import './listset.css'; // Assuming you're using a CSS file for styling

// Import all 13 images
import picset1 from './picset1.jpg';
import picset2 from './picset2.jpg';
import picset3 from './picset3.jpg';
import picset4 from './picset4.jpg';
import picset5 from './picset5.jpg';
import picset6 from './picset6.jpg';
import picset7 from './picset7.jpg';
import picset8 from './picset8.jpg';
import picset9 from './picset9.jpg';
import picset10 from './picset10.jpg';
import picset11 from './picset11.jpg';
import picset12 from './picset12.jpg';
import picset13 from './picset13.jpg';

const Picset = () => {
  const [currentImage, setCurrentImage] = useState(0);

  // All images in an array
  const images = [
    picset1, picset2, picset3, picset4, picset5, 
    picset6, picset7, picset8, picset9, picset10,
    picset11, picset12, picset13
  ];

  const totalImages = images.length;

  const nextImage = () => {
    setCurrentImage((prevImage) => (prevImage + 1) % totalImages);
    scrollToImage((currentImage + 1) % totalImages);
  };

  const prevImage = () => {
    const newIndex = currentImage === 0 ? totalImages - 1 : currentImage - 1;
    setCurrentImage(newIndex);
    scrollToImage(newIndex);
  };

  const scrollToImage = (index) => {
    const element = document.getElementById(`image-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="picset-container">
      {/* Title */}
      
      {/* Images section */}
      <div style={{ maxHeight: '500px', overflowY: 'auto' }} className="image-scroll-container">
        {images.map((image, index) => (
          <div key={index} id={`image-${index}`} className="image-wrapper">
            <img src={image} alt={`Picset ${index + 1}`} className="image-item" />
          </div>
        ))}
      </div>
      
     
    </div>
  );
};

export default Picset;
