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


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../css/Navbar.css'; // ใช้ไฟล์ CSS ใหม่สำหรับการออกแบบ navbar แบบ Netflix
// import logo from '../picture/regalogo.png';
// import { useUserAuth } from '../context/userAuthContext'; // นำเข้าข้อมูลผู้ใช้

// const Navbar = () => {
//   const [dropdownVisible, setDropdownVisible] = useState(false);
//   const [username, setUsername] = useState('');
//   const { user, logOut } = useUserAuth();
//   const navigate = useNavigate();

//   // ดึงค่า username จาก localStorage
//   useEffect(() => {
//     const storedUsername = localStorage.getItem('username') || 'Guest'; // ถ้าไม่มี username ใน localStorage ให้แสดงเป็น Guest
//     setUsername(storedUsername);
//   }, []);

//   const toggleDropdown = () => {
//     setDropdownVisible(!dropdownVisible);
//   };

//   const handleLogout = async () => {
//     try {
//       await logOut();
//       navigate('/login');
//     } catch (error) {
//       console.error('Failed to log out: ', error);
//     }
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

//         {/* ส่วนของการแสดงชื่อผู้ใช้ พร้อม Dropdown */}
//         <div className="profile-dropdown">
//           {user && user.email ? (
//             <>
//               <p onClick={toggleDropdown} className="greeting-button">
//                 สวัสดี, {user.email}
//               </p>
//               {dropdownVisible && (
//                 <div className="dropdown-menu">
//                   <button className="dropdown-item">แก้ไขโปรไฟล์</button>
//                   <button className="dropdown-item" onClick={handleLogout}>
//                     ออกจากระบบ
//                   </button>
//                 </div>
//               )}
//             </>
//           ) : (
//             <>
//               <p onClick={toggleDropdown} className="greeting-button">
//                 ยินดีต้อนรับ, {username || 'Guest'}!
//               </p>
//               {dropdownVisible && (
//                 <div className="dropdown-menu">
//                   <button className="dropdown-item">แก้ไขโปรไฟล์</button>
//                   <button className="dropdown-item" onClick={handleLogout}>
//                     ออกจากระบบ
//                   </button>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;



import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Navbar.css';
import logo from '../picture/regalogo.png';
import { useUserAuth } from '../context/userAuthContext';


const Navbar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [username, setUsername] = useState('');
  const { user, logOut } = useUserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username') || 'Guest';
    setUsername(storedUsername);
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out: ', error);
    }
  };

  const navigateToHome = () =>{
    navigate('/home');
  }
  const navigateToYogaProgram = () => {
    navigate('/yoga-program');
  };

  const navigateToAnalysis = () => {
    navigate('/userProgramAnalysis');
  };

  const navigateToNotifications = () => {
    navigate('/create-notifications');
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Logo" className="navbar-logo" />
      </div>

      <div className="navbar-right">
        <ul className="navbar-menu">
          <li onClick={navigateToHome}>หน้าหลัก</li>
          <li onClick={navigateToYogaProgram}>โยคะโปรแกรม</li>
          <li onClick ={navigateToAnalysis}>Analysis Yoga</li>
          <li onClick={navigateToNotifications}>สร้างการแจ้งเตือน</li>
          <li>CONTACT US</li>
        </ul>

        <div className="profile-dropdown">
          {user && user.email ? (
            <>
              <p onClick={toggleDropdown} className="greeting-button">
                สวัสดี, {user.email}
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
            <>
              <p onClick={toggleDropdown} className="greeting-button">
                ยินดีต้อนรับ, {username || 'Guest'}!
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;