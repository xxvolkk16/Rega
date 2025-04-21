// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../css/Navbar.css';
// import logo from '../picture/regalogo.png';
// import { useUserAuth } from '../context/userAuthContext';
// import { Menu, X } from 'lucide-react';

// const Navbar = () => {
//   const [dropdownVisible, setDropdownVisible] = useState(false);
//   const [menuVisible, setMenuVisible] = useState(false);
//   const [username, setUsername] = useState('');
//   const [isLoggingOut, setIsLoggingOut] = useState(false);
//   const [fullScreenLoading, setFullScreenLoading] = useState(false);
//   const { user, logOut } = useUserAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedUsername = localStorage.getItem('username') || 'Guest';
//     setUsername(storedUsername);
//   }, []);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownVisible && !event.target.closest('.profile-dropdown')) {
//         setDropdownVisible(false);
//       }
//       if (menuVisible && !event.target.closest('.navbar-right') && !event.target.closest('.mobile-menu-button')) {
//         setMenuVisible(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [dropdownVisible, menuVisible]);

//   const toggleDropdown = () => {
//     setDropdownVisible(!dropdownVisible);
//   };

//   const toggleMenu = () => {
//     setMenuVisible(!menuVisible);
//   };

//   const handleLogout = async () => {
//     try {
//       // Set flag for manual logout to prevent immediate redirect
//       localStorage.setItem('manual_logout', 'true');
      
//       // Show loading states
//       setIsLoggingOut(true);
//       setFullScreenLoading(true);
      
//       // Clear user data from localStorage
//       localStorage.removeItem('loginTimestamp');
//       localStorage.removeItem('userEmail');
//       localStorage.removeItem('username');
      
//       // Add delay to show loading state
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       // Logout from Firebase
//       await logOut();
      
//       // Add another delay after logout
//       await new Promise(resolve => setTimeout(resolve, 500));
      
//       // Clear the manual logout flag and navigate
//       localStorage.removeItem('manual_logout');
//       navigate('/');
//     } catch (error) {
//       console.error('Failed to log out:', error);
//       localStorage.removeItem('manual_logout');
//       navigate('/');
//     } finally {
//       setIsLoggingOut(false);
//       setFullScreenLoading(false);
//     }
//   };

//   const navigateToHome = () => {
//     setMenuVisible(false);
//     navigate('/home');
//   };
  
//   const navigateToYogaProgram = () => {
//     setMenuVisible(false);
//     navigate('/yoga-program');
//   };

//   const navigateToAnalysis = () => {
//     setMenuVisible(false);
//     navigate('/userProgramAnalysis');
//   };

//   const navigateToNotifications = () => {
//     setMenuVisible(false);
//     navigate('/create-notifications');
//   };

//   const navigateToContact = () => {
//     setMenuVisible(false);
//     // Implement contact page navigation
//   };

//   return (
//     <>
//       <div className="navbar">
//         <div className="navbar-left">
//           <img src={logo} alt="Logo" className="navbar-logo" />
//         </div>

//         <button className="mobile-menu-button" onClick={toggleMenu}>
//           {menuVisible ? <X size={24} /> : <Menu size={24} />}
//         </button>

//         <div className="navbar-right">
//           <ul className={menuVisible ? 'active' : ''}>
//             <li onClick={navigateToHome}>หน้าหลัก</li>
//             <li onClick={navigateToYogaProgram}>โยคะโปรแกรม</li>
//             <li onClick={navigateToAnalysis}>Analysis Yoga</li>
//             {/* <li onClick={navigateToNotifications}>สร้างการแจ้งเตือน</li>
//             <li onClick={navigateToContact}>CONTACT US</li> */}
//           </ul>

//           <div className="profile-dropdown">
//             {user && user.email ? (
//               <>
//                 <p onClick={toggleDropdown} className="greeting-button">
//                   สวัสดี, {user.email}
//                 </p>
//                 {dropdownVisible && (
//                   <div className="dropdown-menu">
//                     {/* <button className="dropdown-item">แก้ไขโปรไฟล์</button> */}
//                     <button 
//                       className="dropdown-item logout-btn" 
//                       onClick={handleLogout}
//                       disabled={isLoggingOut}
//                     >
//                       {isLoggingOut ? (
//                         <>
//                           <span className="loading-spinner"></span>
//                           กำลังออกจากระบบ...
//                         </>
//                       ) : (
//                         'ออกจากระบบ'
//                       )}
//                     </button>
//                   </div>
//                 )}
//               </>
//             ) : (
//               <>
//                 <p onClick={toggleDropdown} className="greeting-button">
//                   ยินดีต้อนรับ, {username || 'Guest'}!
//                 </p>
//                 {dropdownVisible && (
//                   <div className="dropdown-menu">
//                     <button className="dropdown-item">แก้ไขโปรไฟล์</button>
//                     <button 
//                       className="dropdown-item logout-btn" 
//                       onClick={handleLogout}
//                       disabled={isLoggingOut}
//                     >
//                       {isLoggingOut ? (
//                         <>
//                           <span className="loading-spinner"></span>
//                           กำลังออกจากระบบ...
//                         </>
//                       ) : (
//                         'ออกจากระบบ'
//                       )}
//                     </button>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
      
//       {/* Fullscreen Loading Overlay */}
//       {fullScreenLoading && (
//         <div className="fullscreen-loading">
//           <div className="loading-content">
//             <div className="loading-spinner-large"></div>
//             <p>กำลังออกจากระบบ...</p>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Navbar;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Navbar.css';
import logo from '../picture/regalogo.png';
import { useUserAuth } from '../context/userAuthContext';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [fullScreenLoading, setFullScreenLoading] = useState(false);
  const { user, logOut } = useUserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username') || 'Guest';
    setUsername(storedUsername);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownVisible && !event.target.closest('.profile-dropdown')) {
        setDropdownVisible(false);
      }
      if (menuVisible && !event.target.closest('.navbar-right') && !event.target.closest('.mobile-menu-button')) {
        setMenuVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownVisible, menuVisible]);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleLogout = async () => {
    try {
      // Set flag for manual logout to prevent immediate redirect
      localStorage.setItem('manual_logout', 'true');
      
      // Show loading states
      setIsLoggingOut(true);
      setFullScreenLoading(true);
      
      // Clear user data from localStorage
      localStorage.removeItem('loginTimestamp');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('username');
      
      // Add delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Logout from Firebase
      await logOut();
      
      // Add another delay after logout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Clear the manual logout flag and navigate
      localStorage.removeItem('manual_logout');
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
      localStorage.removeItem('manual_logout');
      navigate('/');
    } finally {
      setIsLoggingOut(false);
      setFullScreenLoading(false);
    }
  };

  const navigateToHome = () => {
    setMenuVisible(false);
    navigate('/home');
  };
  
  const navigateToYogaProgram = () => {
    setMenuVisible(false);
    navigate('/yoga-program');
  };

  const navigateToAnalysis = () => {
    setMenuVisible(false);
    navigate('/userProgramAnalysis');
  };

  const navigateToNotifications = () => {
    setMenuVisible(false);
    navigate('/create-notifications');
  };

  const navigateToHistoryManagement = () => {
    setMenuVisible(false);
    navigate('/program-history-management');
  };

  const navigateToContact = () => {
    setMenuVisible(false);
    // Implement contact page navigation
  };

  return (
    <>
      <div className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="Logo" className="navbar-logo" />
        </div>

        <button className="mobile-menu-button" onClick={toggleMenu}>
          {menuVisible ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="navbar-right">
          <ul className={menuVisible ? 'active' : ''}>
            <li onClick={navigateToHome}>หน้าหลัก</li>
            <li onClick={navigateToYogaProgram}>โยคะโปรแกรม</li>
            <li onClick={navigateToAnalysis}>Analysis Yoga</li>
            <li onClick={navigateToHistoryManagement}>จัดการประวัติ</li>
            {/* <li onClick={navigateToNotifications}>สร้างการแจ้งเตือน</li>
            <li onClick={navigateToContact}>CONTACT US</li> */}
          </ul>

          <div className="profile-dropdown">
            {user && user.email ? (
              <>
                <p onClick={toggleDropdown} className="greeting-button">
                  สวัสดี, {user.email}
                </p>
                {dropdownVisible && (
                  <div className="dropdown-menu">
                    {/* <button className="dropdown-item">แก้ไขโปรไฟล์</button> */}
                    <button 
                      className="dropdown-item logout-btn" 
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut ? (
                        <>
                          <span className="loading-spinner"></span>
                          กำลังออกจากระบบ...
                        </>
                      ) : (
                        'ออกจากระบบ'
                      )}
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
                    <button 
                      className="dropdown-item logout-btn" 
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut ? (
                        <>
                          <span className="loading-spinner"></span>
                          กำลังออกจากระบบ...
                        </>
                      ) : (
                        'ออกจากระบบ'
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Fullscreen Loading Overlay */}
      {fullScreenLoading && (
        <div className="fullscreen-loading">
          <div className="loading-content">
            <div className="loading-spinner-large"></div>
            <p>กำลังออกจากระบบ...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;