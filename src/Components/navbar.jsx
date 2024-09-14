import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import '../css/Navbar.css';  // ใช้ไฟล์ CSS ใหม่สำหรับการออกแบบ navbar แบบ Netflix
import logo from '../picture/regalogo.png';

const Navbar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate(); // Initialize navigate hook

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = () => {
    // Perform any logout logic here (e.g., clearing authentication tokens)
    
    // Redirect to beforelogin.jsx
    navigate('/'); 
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Logo" className="navbar-logo" />
      </div>

      <div className="navbar-right">
        <ul className="navbar-menu">
          <li>หน้าหลัก</li>
          <li>BLOG</li>
          <li>ABOUT US</li>
          <li>CONTACT US</li>
        </ul>

        {/* สวัสดี button */}
        <div className="profile-dropdown">
          <p onClick={toggleDropdown} className="greeting-button">สวัสดี</p>
          {dropdownVisible && (
            <div className="dropdown-menu">
              <button className="dropdown-item">แก้ไขโปรไฟล์</button>
              <button className="dropdown-item" onClick={handleLogout}>ออกจากระบบ</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
