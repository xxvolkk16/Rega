// // pages/userinformation/userinformation.jsx
// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { doc, getDoc } from "firebase/firestore";
// import { firestore } from "../../firebase";
// import Navbar from "../../Components/navbar.jsx";
// import "./userinformation.css";

// const UserInformation = () => {
//   const [userData, setUserData] = useState(null);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const userId = location.state?.userId;

//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (!userId) {
//         navigate('/');
//         return;
//       }
      
//       try {
//         const userDoc = await getDoc(doc(firestore, "users", userId));
//         if (userDoc.exists()) {
//           setUserData({ id: userDoc.id, ...userDoc.data() });
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//     };

//     fetchUserData();
//   }, [userId, navigate]);

//   if (!userData) {
//     return <div className="loading">Loading...</div>;
//   }

//   return (
//     <div className="page-container">
//       <Navbar />
//       <div className="user-info-content">
//         <h1 className="page-title">User Information</h1>
        
//         <div className="user-info-card">
//           <div className="card-header">
//             {/* Profile Image */}
//             <div className="profile-image">
//               <img 
//                 src="/placeholder-profile.jpg" 
//                 alt="Profile" 
//                 className="profile-img"
//                 onError={(e) => {
//                   e.target.onerror = null;
//                   e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23ccc' d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";
//                 }}
//               />
//             </div>

//             {/* User Information */}
//             <div className="info-container">
//               <div className="info-row">
//                 <span className="info-label">Username:</span>
//                 <span className="info-value">{userData.username || "N/A"}</span>
//               </div>
              
//               <div className="info-row">
//                 <span className="info-label">Email:</span>
//                 <span className="info-value">{userData.email || "N/A"}</span>
//               </div>
              
//               <div className="info-row">
//                 <span className="info-label">Created At:</span>
//                 <span className="info-value">
//                   {userData.createdAt ? userData.createdAt.toDate().toLocaleDateString() : "N/A"}
//                 </span>
//               </div>
              
//               <div className="info-row">
//                 <span className="info-label">Role:</span>
//                 <span className={`role-badge ${userData.Role?.toLowerCase() || 'user'}`}>
//                   {userData.Role || "User"}
//                 </span>
//               </div>
              
//               <button 
//                 className="history-button"
//                 onClick={() => navigate('/userhistoryallprogramplay', { state: { userId } })}
//               >
//                 History
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserInformation;




// pages/userinformation/userinformation.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../firebase";
import Navbar from "../../Components/navbar.jsx";
import "./userinformation.css";

const UserInformation = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        console.log("No userId provided");
        navigate('/');
        return;
      }

      try {
        const userRef = doc(firestore, "users", userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          console.log("User data found:", userSnap.data());
          setUserData({ id: userSnap.id, ...userSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, navigate]);

  const handleHistoryClick = () => {
    console.log("Navigating to history with userId:", userId);  // Debug log
    navigate('/userhistoryallprogramplay', { 
      state: { 
        userId: userData.id || userId,  // ใช้ userData.id ถ้ามี หรือ userId ที่ส่งมา
      } 
    });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="page-container">
      <Navbar />
      <div className="user-info-content">
        <h1 className="page-title">User Information</h1>
        
        <div className="user-info-card">
          <div className="card-header">
            <div className="profile-image">
              <img 
                src="/placeholder-profile.jpg" 
                alt="Profile" 
                className="profile-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23ccc' d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";
                }}
              />
            </div>

            <div className="info-container">
              <div className="info-row">
                <span className="info-label">Username:</span>
                <span className="info-value">{userData?.username || "N/A"}</span>
              </div>
              
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{userData?.email || "N/A"}</span>
              </div>
              
              <div className="info-row">
                <span className="info-label">Created At:</span>
                <span className="info-value">
                  {userData?.createdAt?.toDate().toLocaleDateString() || "N/A"}
                </span>
              </div>
              
              <div className="info-row">
                <span className="info-label">Role:</span>
                <span className={`role-badge ${userData?.Role?.toLowerCase() || 'user'}`}>
                  {userData?.Role || "User"}
                </span>
              </div>
              
              <button 
                className="history-button"
                onClick={handleHistoryClick}
              >
                History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInformation;