import React from 'react';
import '../home/home.css';  // ใช้สไตล์จาก home.css
import { useNavigate } from 'react-router-dom';  // ใช้สำหรับเปลี่ยนเส้นทางไปยังหน้า login
import mybackground from '../../picture/officesyndrome.png';
import Navbar from "../../Components/navbar.jsx";

function BeforeLogin() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');  // เปลี่ยนเส้นทางไปยังหน้า login
  };

  return (
    <div className="home-container">
        <Navbar />
    <div className="background">
      <img src={mybackground} alt="Background" className="banner-img" />

      <div className="titlepain">
        <h1 className="headpain">Welcome to Rega</h1>
        <p>
          Explore the features of our platform and see how we can assist you.
          Please log in to access all the features.
        </p>
        <button className="detail-button" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
    </div>
  );
}

export default BeforeLogin;
