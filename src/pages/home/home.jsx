// import React, { useEffect, useState } from "react";
// import Navbar from "../../Components/navbar.jsx";
// import { auth, firestore } from "../../firebase";
// import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
// import { Eye, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import "./home.css";

// const Home = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [usersData, setUsersData] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [paginatedUsers, setPaginatedUsers] = useState([]);
//   const usersPerPage = 10;
  
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         // ตรวจสอบ session
//         const loginTimestamp = localStorage.getItem('loginTimestamp');
//         const currentUser = auth.currentUser;

//         if (!currentUser || !loginTimestamp) {
//           console.log('No user or session found');
//           navigate('/');
//           return;
//         }

//         // ตรวจสอบว่า session ไม่เกิน 24 ชั่วโมง
//         const now = Date.now();
//         const sessionTime = parseInt(loginTimestamp);
//         if (now - sessionTime > 24 * 60 * 60 * 1000) {
//           console.log('Session expired');
//           localStorage.removeItem('loginTimestamp');
//           navigate('/');
//           return;
//         }

//         setUser(currentUser);

//         // ตรวจสอบสิทธิ์ admin
//         const userDocRef = doc(firestore, 'users', currentUser.uid);
//         const userDoc = await getDoc(userDocRef);

//         if (userDoc.exists() && userDoc.data().Role === 'Admin') {
//           setIsAdmin(true);
//           await fetchUsersData();
//         } else {
//           console.log('Not an admin user');
//           navigate('/');
//           return;
//         }
//       } catch (error) {
//         console.error('Auth check error:', error);
//         navigate('/');
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchUsersData = async () => {
//       try {
//         const usersSnapshot = await getDocs(collection(firestore, "users"));
//         const usersList = usersSnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
//         setUsersData(usersList);
        
//         // Calculate total pages
//         const pages = Math.ceil(usersList.length / usersPerPage);
//         setTotalPages(pages > 0 ? pages : 1);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };

//     checkAuth();

//     // ปรับปรุง auth listener ให้ตรวจสอบ flag การออกจากระบบด้วยตนเอง
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       // ตรวจสอบถ้าไม่มีผู้ใช้ และไม่ได้กำลังออกจากระบบด้วยตนเอง
//       const isManualLogout = localStorage.getItem('manual_logout') === 'true';
      
//       if (!user && !isManualLogout) {
//         navigate('/');
//       }
//     });

//     return () => unsubscribe();
//   }, [navigate]);

//   // Update paginated data when users data changes or page changes
//   useEffect(() => {
//     if (usersData.length > 0) {
//       const startIndex = (currentPage - 1) * usersPerPage;
//       const endIndex = startIndex + usersPerPage;
//       setPaginatedUsers(usersData.slice(startIndex, endIndex));
//     }
//   }, [usersData, currentPage]);

//   const handleView = (userId) => {
//     navigate('/userinformation', { state: { userId } });
//   };
  
//   const handleDelete = (userId) => {
//     console.log("Delete user:", userId);
//   };

//   const goToNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const goToPreviousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="yad-loading">
//         <div>Loading...</div>
//       </div>
//     );
//   }

//   if (!isAdmin) {
//     return <div>Unauthorized Access</div>;
//   }

//   return (
//     <div className="yad-root">
//       <Navbar />
//       <div className="yad-container">
//         <div className="yad-content">
//           <h2 className="yad-title">User Information</h2>
//           <div className="yad-table-wrapper">
//             <table className="yad-table">
//               <thead className="yad-thead">
//                 <tr>
//                   <th className="yad-th">Username</th>
//                   <th className="yad-th">Email</th>
//                   <th className="yad-th">Created At</th>
//                   <th className="yad-th">Role</th>
//                   <th className="yad-th">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedUsers.map((user) => (
//                   <tr key={user.id} className="yad-tr">
//                     <td className="yad-td">{user.username || "N/A"}</td>
//                     <td className="yad-td">{user.email || "N/A"}</td>
//                     <td className="yad-td">
//                       {user.createdAt ? user.createdAt.toDate().toLocaleDateString() : "N/A"}
//                     </td>
//                     <td className="yad-td">
//                       <div className={`yad-badge yad-badge-${user.Role?.toLowerCase() || 'user'}`}>
//                         {user.Role || "User"}
//                       </div>
//                     </td>
//                     <td className="yad-td">
//                       <div className="yad-actions">
//                         <button 
//                           className="yad-btn yad-btn-view" 
//                           onClick={() => handleView(user.id)}
//                         >
//                           <Eye size={18} />
//                         </button>
//                         <button 
//                           className="yad-btn yad-btn-delete" 
//                           onClick={() => handleDelete(user.id)}
//                         >
//                           <Trash2 size={18} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
            
//             {/* Pagination Controls */}
//             <div className="yad-pagination">
//               <div className="yad-pagination-info">
//                 หน้า {currentPage} จาก {totalPages} (แสดง {paginatedUsers.length} จาก {usersData.length} รายการ)
//               </div>
//               <div className="yad-pagination-controls">
//                 <button 
//                   className="yad-pagination-btn" 
//                   onClick={goToPreviousPage} 
//                   disabled={currentPage === 1}
//                 >
//                   <ChevronLeft size={18} />
//                 </button>
//                 <span className="yad-pagination-page">{currentPage}</span>
//                 <button 
//                   className="yad-pagination-btn" 
//                   onClick={goToNextPage} 
//                   disabled={currentPage === totalPages}
//                 >
//                   <ChevronRight size={18} />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;

import React, { useEffect, useState } from "react";
import Navbar from "../../Components/navbar.jsx";
import { auth, firestore } from "../../firebase";
import { collection, getDocs, query, where, doc, getDoc, updateDoc } from "firebase/firestore";
import { Eye, Trash2, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./home.css";

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedUsers, setPaginatedUsers] = useState([]);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const usersPerPage = 10;
  
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // ตรวจสอบ session
        const loginTimestamp = localStorage.getItem('loginTimestamp');
        const currentUser = auth.currentUser;

        if (!currentUser || !loginTimestamp) {
          console.log('No user or session found');
          navigate('/');
          return;
        }

        // ตรวจสอบว่า session ไม่เกิน 24 ชั่วโมง
        const now = Date.now();
        const sessionTime = parseInt(loginTimestamp);
        if (now - sessionTime > 24 * 60 * 60 * 1000) {
          console.log('Session expired');
          localStorage.removeItem('loginTimestamp');
          navigate('/');
          return;
        }

        setUser(currentUser);

        // ตรวจสอบสิทธิ์ admin
        const userDocRef = doc(firestore, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists() && userDoc.data().Role === 'Admin') {
          setIsAdmin(true);
          await fetchUsersData();
        } else {
          console.log('Not an admin user');
          navigate('/');
          return;
        }
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    const fetchUsersData = async () => {
      try {
        const usersSnapshot = await getDocs(collection(firestore, "users"));
        const usersList = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsersData(usersList);
        
        // Calculate total pages
        const pages = Math.ceil(usersList.length / usersPerPage);
        setTotalPages(pages > 0 ? pages : 1);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    checkAuth();

    // ปรับปรุง auth listener ให้ตรวจสอบ flag การออกจากระบบด้วยตนเอง
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // ตรวจสอบถ้าไม่มีผู้ใช้ และไม่ได้กำลังออกจากระบบด้วยตนเอง
      const isManualLogout = localStorage.getItem('manual_logout') === 'true';
      
      if (!user && !isManualLogout) {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Update paginated data when users data changes or page changes
  useEffect(() => {
    if (usersData.length > 0) {
      const startIndex = (currentPage - 1) * usersPerPage;
      const endIndex = startIndex + usersPerPage;
      setPaginatedUsers(usersData.slice(startIndex, endIndex));
    }
  }, [usersData, currentPage]);

  // ฟังก์ชันอัพเดต Role ของผู้ใช้
  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingUserId(userId);
      
      // อัพเดต Role ใน Firestore
      const userDocRef = doc(firestore, "users", userId);
      await updateDoc(userDocRef, {
        Role: newRole
      });

      // อัพเดตข้อมูลในสเตท
      const updatedUsers = usersData.map(user => {
        if (user.id === userId) {
          return { ...user, Role: newRole };
        }
        return user;
      });
      
      setUsersData(updatedUsers);
      
      // แสดงข้อความสำเร็จ
      setUpdateSuccess(true);
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error("Error updating role:", error);
      alert("ไม่สามารถอัพเดต Role ได้: " + error.message);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleView = (userId) => {
    navigate('/userinformation', { state: { userId } });
  };
  
  const handleDelete = (userId) => {
    console.log("Delete user:", userId);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <div className="yad-loading">
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return <div>Unauthorized Access</div>;
  }

  return (
    <div className="yad-root">
      <Navbar />
      <div className="yad-container">
        <div className="yad-content">
          <h2 className="yad-title">User Information</h2>
          
          {updateSuccess && (
            <div className="yad-alert yad-alert-success">
              <Check size={16} />
              อัพเดต Role สำเร็จแล้ว
            </div>
          )}
          
          <div className="yad-table-wrapper">
            <table className="yad-table">
              <thead className="yad-thead">
                <tr>
                  <th className="yad-th">Username</th>
                  <th className="yad-th">Email</th>
                  <th className="yad-th">Created At</th>
                  <th className="yad-th">Role</th>
                  <th className="yad-th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="yad-tr">
                    <td className="yad-td">{user.username || "N/A"}</td>
                    <td className="yad-td">{user.email || "N/A"}</td>
                    <td className="yad-td">
                      {user.createdAt ? user.createdAt.toDate().toLocaleDateString() : "N/A"}
                    </td>
                    <td className="yad-td">
                      {updatingUserId === user.id ? (
                        <div className="yad-loading-spinner"></div>
                      ) : (
                        <select 
                          className={`yad-select yad-select-${user.Role?.toLowerCase() || 'user'}`}
                          value={user.Role || "User"}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        >
                          <option value="User">User</option>
                          <option value="Admin">Admin</option>
                        </select>
                      )}
                    </td>
                    <td className="yad-td">
                      <div className="yad-actions">
                        <button 
                          className="yad-btn yad-btn-view" 
                          onClick={() => handleView(user.id)}
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          className="yad-btn yad-btn-delete" 
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination Controls */}
            <div className="yad-pagination">
              <div className="yad-pagination-info">
                หน้า {currentPage} จาก {totalPages} (แสดง {paginatedUsers.length} จาก {usersData.length} รายการ)
              </div>
              <div className="yad-pagination-controls">
                <button 
                  className="yad-pagination-btn" 
                  onClick={goToPreviousPage} 
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="yad-pagination-page">{currentPage}</span>
                <button 
                  className="yad-pagination-btn" 
                  onClick={goToNextPage} 
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;