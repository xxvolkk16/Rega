// import React, { useEffect, useState } from "react";
// import "./home.css";
// import Navbar from "../../Components/navbar.jsx";
// import { auth, firestore } from "../../firebase";
// import { collection, getDocs } from "firebase/firestore";

// const Home = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [usersData, setUsersData] = useState([]);
  
//   useEffect(() => {
//     const checkUserStatus = async () => {
//       auth.onAuthStateChanged(async (user) => {
//         if (user) {
//           setUser(user);
//         } else {
//           setUser(null);
//         }
//         setLoading(false);
//       });
//     };

//     const fetchUsersData = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(firestore, "users"));
//         const usersList = [];
//         querySnapshot.forEach((doc) => {
//           usersList.push({ id: doc.id, ...doc.data() });
//         });
//         setUsersData(usersList);
//       } catch (error) {
//         console.error("Error fetching users from Firestore:", error);
//       }
//     };

//     checkUserStatus();
//     fetchUsersData();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="home-container">
//       <Navbar />
//       <div className="admin-panel">
//         <h2>Admin Panel - Users Information</h2>
//         {usersData.length > 0 ? (
//           <div className="users-table">
//             <div className="table-header">
//               <div className="table-cell">Username</div>
//               <div className="table-cell">Email</div>
//               <div className="table-cell">Created At</div>
//               <div className="table-cell">Role</div>
//             </div>
//             {usersData.map((user) => (
//               <div key={user.id} className="table-row">
//                 <div className="table-cell">{user.username || "N/A"}</div>
//                 <div className="table-cell">{user.email || "N/A"}</div>
//                 <div className="table-cell">{user.createdAt ? user.createdAt.toDate().toLocaleString() : "N/A"}</div>
//                 <div className="table-cell">{user.Role||"N/A"}</div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p>No users found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Home;



// import React, { useEffect, useState } from "react";
// import "./home.css";
// import Navbar from "../../Components/navbar.jsx";
// import { auth, firestore } from "../../firebase";
// import { collection, getDocs, query, where, doc } from "firebase/firestore";
// import { Users, Activity, Clock } from "lucide-react";

// const Home = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [usersData, setUsersData] = useState([]);
//   const [yogaPrograms, setYogaPrograms] = useState([]);
//   const [yogaPoses, setYogaPoses] = useState({});

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Check user status
//         auth.onAuthStateChanged(async (user) => {
//           setUser(user);
//           setLoading(false);
//         });

//         // Fetch users
//         const usersSnapshot = await getDocs(collection(firestore, "users"));
//         const usersList = usersSnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
//         setUsersData(usersList);

//         // Fetch yoga programs and poses
//         const programsSnapshot = await getDocs(collection(firestore, "Yoga Program"));
//         const programsList = programsSnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
//         setYogaPrograms(programsList);

//         // Fetch poses for each program
//         const posesData = {};
//         for (const program of programsList) {
//           const programDocRef = doc(firestore, "Yoga Program", program.id);
//           const posesQuery = query(
//             collection(firestore, "Yoga Pose"),
//             where("Program", "==", programDocRef)
//           );
//           const posesSnapshot = await getDocs(posesQuery);
//           posesData[program.id] = posesSnapshot.docs.map(doc => ({
//             id: doc.id,
//             ...doc.data()
//           }));
//         }
//         setYogaPoses(posesData);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="loading">
//         <div>Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="home-container">
//       <Navbar />
//       <div className="admin-panel">
//         <div className="panel-header">
//           <h1 className="panel-title">
//             <Users className="icon" size={24} /> Admin Dashboard
//           </h1>
//         </div>

//         <div className="section">
//           <h2 className="section-title">
//             <Activity className="icon" size={20} /> Users Information
//           </h2>
//           {usersData.length > 0 ? (
//             <div className="users-table">
//               <div className="table-header">
//                 <div className="table-cell">Username</div>
//                 <div className="table-cell">Email</div>
//                 <div className="table-cell">Created At</div>
//                 <div className="table-cell">Role</div>
//               </div>
//               {usersData.map((user) => (
//                 <div key={user.id} className="table-row">
//                   <div className="table-cell">{user.username || "N/A"}</div>
//                   <div className="table-cell">{user.email || "N/A"}</div>
//                   <div className="table-cell">
//                     {user.createdAt ? user.createdAt.toDate().toLocaleString() : "N/A"}
//                   </div>
//                   <div className="table-cell">{user.Role || "N/A"}</div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p>No users found.</p>
//           )}
//         </div>

//         <div className="section">
//           <h2 className="section-title">
//             <Clock className="icon" size={20} /> Yoga Programs
//           </h2>
//           <div className="program-grid">
//             {yogaPrograms.map((program) => (
//               <div key={program.id} className="program-card">
//                 <h3 className="program-title">{program.Name}</h3>
//                 <p className="program-description">{program.Description}</p>
//                 {program.Picture && (
//                   <img
//                     src={program.Picture}
//                     alt={program.Name}
//                     className="program-image"
//                   />
//                 )}
//                 <p className="program-duration">Duration: {program.Time_up} minutes</p>
                
//                 <div className="poses-section">
//                   <h4 className="poses-title">Associated Poses</h4>
//                   {yogaPoses[program.id]?.length > 0 ? (
//                     yogaPoses[program.id].map((pose) => (
//                       <div key={pose.id} className="pose-card">
//                         <h5 className="pose-title">{pose.Name}</h5>
//                         <p className="pose-description">{pose.Description}</p>
//                         {pose.Picture && (
//                           <img
//                             src={pose.Picture}
//                             alt={pose.Name}
//                             className="pose-image"
//                           />
//                         )}
//                         <p className="pose-duration">Duration: {pose.Timeout} minutes</p>
//                         <p className="pose-model">Model: {pose.Model}</p>
//                       </div>
//                     ))
//                   ) : (
//                     <p>No poses available for this program</p>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;


// import React, { useEffect, useState } from "react";
// import "./home.css";
// import Navbar from "../../Components/navbar.jsx";
// import { auth, firestore } from "../../firebase";
// import { collection, getDocs, query, where, doc } from "firebase/firestore";
// import { Eye, Trash2 } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const Home = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [usersData, setUsersData] = useState([]);
//   const [yogaPrograms, setYogaPrograms] = useState([]);
//   const [yogaPoses, setYogaPoses] = useState({});
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         auth.onAuthStateChanged(async (user) => {
//           setUser(user);
//           setLoading(false);
//         });

//         const usersSnapshot = await getDocs(collection(firestore, "users"));
//         const usersList = usersSnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
//         setUsersData(usersList);

//         const programsSnapshot = await getDocs(collection(firestore, "Yoga Program"));
//         const programsList = programsSnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
//         setYogaPrograms(programsList);

//         const posesData = {};
//         for (const program of programsList) {
//           const programDocRef = doc(firestore, "Yoga Program", program.id);
//           const posesQuery = query(
//             collection(firestore, "Yoga Pose"),
//             where("Program", "==", programDocRef)
//           );
//           const posesSnapshot = await getDocs(posesQuery);
//           posesData[program.id] = posesSnapshot.docs.map(doc => ({
//             id: doc.id,
//             ...doc.data()
//           }));
//         }
//         setYogaPoses(posesData);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleView = (userId) => {
//     navigate('/userinformation', { state: { userId } });
//   };
//   const handleDelete = (userId) => {
//     console.log("Delete user:", userId);
//   };

//   if (loading) {
//     return (
//       <div className="loading">
//         <div>Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="home-container">
//       <Navbar />
//       <div className="admin-dashboard">
//         <div className="info-section">
//           <h2>User Information</h2>
//           <div className="users-table-container">
//             <table className="users-table">
//               <thead>
//                 <tr>
//                   <th>Username</th>
//                   <th>Email</th>
//                   <th>Created At</th>
//                   <th>Role</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {usersData.map((user) => (
//                   <tr key={user.id}>
//                     <td>{user.username || "N/A"}</td>
//                     <td>{user.email || "N/A"}</td>
//                     <td>
//                       {user.createdAt ? user.createdAt.toDate().toLocaleDateString() : "N/A"}
//                     </td>
//                     <td>
//                       <div className={`role-badge ${user.Role?.toLowerCase() || 'user'}`}>
//                         {user.Role || "User"}
//                       </div>
//                     </td>
//                     <td>
//                       <div className="action-buttons">
//                         <button 
//                           className="action-btn view" 
//                           onClick={() => handleView(user.id)}
//                         >
//                           <Eye size={18} />
//                         </button>
//                         <button 
//                           className="action-btn delete" 
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
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;




// import React, { useEffect, useState } from "react";
// import Navbar from "../../Components/navbar.jsx";
// import { auth, firestore } from "../../firebase";
// import { collection, getDocs, query, where, doc } from "firebase/firestore";
// import { Eye, Trash2 } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const Home = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [usersData, setUsersData] = useState([]);
//   const [yogaPrograms, setYogaPrograms] = useState([]);
//   const [yogaPoses, setYogaPoses] = useState({});
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         auth.onAuthStateChanged(async (user) => {
//           setUser(user);
//           setLoading(false);
//         });

//         const usersSnapshot = await getDocs(collection(firestore, "users"));
//         const usersList = usersSnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
//         setUsersData(usersList);

//         const programsSnapshot = await getDocs(collection(firestore, "Yoga Program"));
//         const programsList = programsSnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
//         setYogaPrograms(programsList);

//         const posesData = {};
//         for (const program of programsList) {
//           const programDocRef = doc(firestore, "Yoga Program", program.id);
//           const posesQuery = query(
//             collection(firestore, "Yoga Pose"),
//             where("Program", "==", programDocRef)
//           );
//           const posesSnapshot = await getDocs(posesQuery);
//           posesData[program.id] = posesSnapshot.docs.map(doc => ({
//             id: doc.id,
//             ...doc.data()
//           }));
//         }
//         setYogaPoses(posesData);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleView = (userId) => {
//     navigate('/userinformation', { state: { userId } });
//   };
  
//   const handleDelete = (userId) => {
//     console.log("Delete user:", userId);
//   };

//   if (loading) {
//     return (
//       <div className="yad-loading">
//         <div>Loading...</div>
//       </div>
//     );
//   }


import React, { useEffect, useState } from "react";
import Navbar from "../../Components/navbar.jsx";
import { auth, firestore } from "../../firebase";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { Eye, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
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
                      <div className={`yad-badge yad-badge-${user.Role?.toLowerCase() || 'user'}`}>
                        {user.Role || "User"}
                      </div>
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