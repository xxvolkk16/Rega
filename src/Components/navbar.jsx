// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
// import '../css/Navbar.css';  // ใช้ไฟล์ CSS ใหม่สำหรับการออกแบบ navbar แบบ Netflix
// import logo from '../picture/regalogo.png';

// const Navbar = () => {
//   const [dropdownVisible, setDropdownVisible] = useState(false);
//   const navigate = useNavigate(); // Initialize navigate hook

//   const toggleDropdown = () => {
//     setDropdownVisible(!dropdownVisible);
//   };

//   const handleLogout = () => {
//     // Perform any logout logic here (e.g., clearing authentication tokens)
    
//     // Redirect to beforelogin.jsx
//     navigate('/'); 
//   };

//   return (
//     <div className="navbar">
//       <div className="navbar-left">
//         <img src={logo} alt="Logo" className="navbar-logo" />
//       </div>

//       <div className="navbar-right">
//         <ul className="navbar-menu">
//           <li>หน้าหลัก</li>
//           <li>BLOG</li>
//           <li>ABOUT US</li>
//           <li>CONTACT US</li>
//         </ul>

//         {/* สวัสดี button */}
//         <div className="profile-dropdown">
//           <p onClick={toggleDropdown} className="greeting-button">สวัสดี</p>
//           {dropdownVisible && (
//             <div className="dropdown-menu">
//               <button className="dropdown-item">แก้ไขโปรไฟล์</button>
//               <button className="dropdown-item" onClick={handleLogout}>ออกจากระบบ</button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;




import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ใช้สำหรับการเปลี่ยนหน้า
import '../css/Navbar.css';  // ใช้ไฟล์ CSS ใหม่สำหรับการออกแบบ navbar แบบ Netflix
import logo from '../picture/regalogo.png';
import { useUserAuth } from '../context/userAuthContext'; // นำเข้าข้อมูลผู้ใช้

const Navbar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { user, logOut } = useUserAuth(); // ดึงข้อมูลผู้ใช้และฟังก์ชันออกจากระบบจาก context
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

const handleLogout = async () => {
  try {
    await logOut(); // เรียกใช้ฟังก์ชัน logOut
    navigate('/login'); // หลังจากออกจากระบบให้ไปที่หน้า login
  } catch (error) {
    console.error("Failed to log out: ", error);
  }
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

        {/* ส่วนของการแสดงชื่อผู้ใช้หรือ dropdown */}
        <div className="profile-dropdown">
        {user && user.email ? (
  <>
    <p onClick={toggleDropdown} className="greeting-button">
      สวัสดี, {user.email || "User"}
    </p>
    {dropdownVisible && (
      <div className="dropdown-menu">
        <button className="dropdown-item">แก้ไขโปรไฟล์</button>
        <button className="dropdown-item" onClick={handleLogout}>
          ออกจากระบบ
        </button>
      </div>
    )}
  </>
) : (
  <button onClick={() => navigate('/login')} className="login-button">
    Login
  </button>
)}

        </div>
      </div>
    </div>
  );
};

export default Navbar;
