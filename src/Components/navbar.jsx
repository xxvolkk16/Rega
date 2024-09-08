import React from 'react';
import '../css/Navbar.css';  // ใช้ไฟล์ CSS ใหม่สำหรับการออกแบบ navbar แบบ Netflix
import logo from '../picture/regalogo.png';

const Navbar = () => {
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
      
        <p>สวัสดี</p> {/* ข้อมูลโปรไฟล์ */}
      </div>
    </div>
  );
};

export default Navbar;
