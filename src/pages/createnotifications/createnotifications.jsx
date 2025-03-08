// // // import React, { useState, useEffect } from 'react';
// // // import './createnotifications.css';
// // // import { auth, signInWithGoogle, requestNotificationPermission } from '../../firebase';
// // // import { sendNotification } from '../../api/notifications';

// // // const CreateNotifications = () => {
// // //   const [isLoggedIn, setIsLoggedIn] = useState(false);
// // //   const [notification, setNotification] = useState({
// // //     title: '',
// // //     body: '',
// // //     image: '',
// // //     name: '',
// // //     target: 'all', // all, topic, or token
// // //     topic: '',
// // //     scheduling: 'now', // now, scheduled, or recurring
// // //     scheduledTime: '',
// // //     recurring: 'daily',
// // //     analytics: {
// // //       campaign: '',
// // //       label: ''
// // //     }
// // //   });

// // //   useEffect(() => {
// // //     // ตรวจสอบสถานะการล็อกอิน
// // //     const unsubscribe = auth.onAuthStateChanged((user) => {
// // //       setIsLoggedIn(!!user);
// // //     });
// // //     return () => unsubscribe();
// // //   }, []);

// // //   // ใน createnotifications.jsx
// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     try {
// // //       // เช็คว่ามี user ที่ล็อกอินอยู่หรือไม่
// // //       const currentUser = auth.currentUser;
// // //       if (!currentUser) {
// // //         throw new Error('กรุณาเข้าสู่ระบบก่อนส่งการแจ้งเตือน');
// // //       }

// // //       // ขอ token สำหรับส่งการแจ้งเตือน
// // //       const token = await currentUser.getIdToken();

// // //       // ส่งการแจ้งเตือนพร้อม token
// // //       await sendNotification({
// // //         ...notification,
// // //         token: token
// // //       });
      
// // //       alert('ส่งการแจ้งเตือนสำเร็จ!');
// // //     } catch (error) {
// // //       console.error('Error:', error);
// // //       alert('ไม่สามารถส่งการแจ้งเตือนได้: ' + error.message);
// // //     }
// // //   };

// // //   return (
// // //     <div className="notification-container">
// // //       <div className="notification-card">
// // //         <div className="card-header">
// // //           <h2 className="card-title">Send Push Notification</h2>
// // //         </div>
        
// // //         <form onSubmit={handleSubmit}>
// // //           {/* Notification Content */}
// // //           <div className="form-group">
// // //             <label className="form-label" htmlFor="title">Notification Title</label>
// // //             <input
// // //               className="form-input"
// // //               id="title"
// // //               value={notification.title}
// // //               onChange={(e) => setNotification({...notification, title: e.target.value})}
// // //               placeholder="Enter notification title"
// // //             />
// // //           </div>
          
// // //           <div className="form-group">
// // //             <label className="form-label" htmlFor="body">Notification Body</label>
// // //             <input
// // //               className="form-input"
// // //               id="body"
// // //               value={notification.body}
// // //               onChange={(e) => setNotification({...notification, body: e.target.value})}
// // //               placeholder="Enter notification message"
// // //             />
// // //           </div>

// // //           <div className="form-group">
// // //             <label className="form-label" htmlFor="image">Image URL (Optional)</label>
// // //             <input
// // //               className="form-input"
// // //               id="image"
// // //               value={notification.image}
// // //               onChange={(e) => setNotification({...notification, image: e.target.value})}
// // //               placeholder="https://example.com/image.jpg"
// // //             />
// // //           </div>

// // //           {/* Target Selection */}
// // //           <div className="form-group">
// // //             <label className="form-label">Target Users</label>
// // //             <div className="button-group">
// // //               <button
// // //                 type="button"
// // //                 className={`button ${notification.target === 'all' ? 'button-primary' : 'button-outline'}`}
// // //                 onClick={() => setNotification({...notification, target: 'all'})}
// // //               >
// // //                 All Users
// // //               </button>
// // //               <button
// // //                 type="button"
// // //                 className={`button ${notification.target === 'topic' ? 'button-primary' : 'button-outline'}`}
// // //                 onClick={() => setNotification({...notification, target: 'topic'})}
// // //               >
// // //                 Topic
// // //               </button>
// // //             </div>

// // //             {notification.target === 'topic' && (
// // //               <input
// // //                 className="form-input"
// // //                 value={notification.topic}
// // //                 onChange={(e) => setNotification({...notification, topic: e.target.value})}
// // //                 placeholder="Enter topic name"
// // //               />
// // //             )}
// // //           </div>

// // //           {/* Scheduling */}
// // //           <div className="form-group">
// // //             <label className="form-label">Scheduling</label>
// // //             <div className="button-group">
// // //               <button
// // //                 type="button"
// // //                 className={`button ${notification.scheduling === 'now' ? 'button-primary' : 'button-outline'}`}
// // //                 onClick={() => setNotification({...notification, scheduling: 'now'})}
// // //               >
// // //                 Send Now
// // //               </button>
// // //               <button
// // //                 type="button"
// // //                 className={`button ${notification.scheduling === 'scheduled' ? 'button-primary' : 'button-outline'}`}
// // //                 onClick={() => setNotification({...notification, scheduling: 'scheduled'})}
// // //               >
// // //                 Schedule
// // //               </button>
// // //             </div>

// // //             {notification.scheduling === 'scheduled' && (
// // //               <input
// // //                 className="form-input"
// // //                 type="datetime-local"
// // //                 value={notification.scheduledTime}
// // //                 onChange={(e) => setNotification({...notification, scheduledTime: e.target.value})}
// // //               />
// // //             )}
// // //           </div>

// // //           {/* Authentication Status */}
// // //           {!isLoggedIn && (
// // //             <div className="form-group">
// // //               <p className="auth-warning">You need to be logged in to send notifications.</p>
// // //               <button
// // //                 type="button"
// // //                 className="button button-primary"
// // //                 onClick={signInWithGoogle}
// // //               >
// // //                 Sign in with Google
// // //               </button>
// // //             </div>
// // //           )}

// // //           {/* Submit Buttons */}
// // //           <div className="form-actions">
// // //             <button type="button" className="button button-outline">Save Draft</button>
// // //             <button 
// // //               type="submit" 
// // //               className="button button-primary"
// // //               disabled={!isLoggedIn}
// // //             >
// // //               Send Notification
// // //             </button>
// // //           </div>
// // //         </form>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default CreateNotifications;
















// // // import React, { useState, useEffect } from 'react';
// // // import './createnotifications.css';
// // // import { auth, messaging } from '../../firebase';
// // // import { getToken } from 'firebase/messaging';
// // // // ดึง doc, getDoc จาก firebase/firestore
// // // import { doc, getDoc } from 'firebase/firestore';

// // // const CreateNotifications = () => {
// // //   const [isLoggedIn, setIsLoggedIn] = useState(false);
// // //   // เพิ่มการประกาศ state notification
// // //   const [notification, setNotification] = useState({
// // //     title: '',
// // //     body: '',
// // //     image: '',
// // //     target: 'all'
// // //   });

// // //   useEffect(() => {
// // //     const unsubscribe = auth.onAuthStateChanged((user) => {
// // //       setIsLoggedIn(!!user);
// // //     });
// // //     return () => unsubscribe();
// // //   }, []);

// // //  // 1. แก้ไขการดึง token ให้ใช้ token ของ user ที่ login แทน
// // // // 1. แก้ไขการดึง token ให้ใช้ token ของ user ที่ login แทน
// // // const handleSubmit = async (e) => {
// // //   e.preventDefault();
// // //   try {
// // //     const currentUser = auth.currentUser;
// // //     if (!currentUser) {
// // //       throw new Error('กรุณาเข้าสู่ระบบก่อนส่งการแจ้งเตือน');
// // //     }

// // //     // ดึง token จาก user ที่ login แทนการสร้าง token ใหม่
// // //     const userDocRef = doc(firestore, 'users', currentUser.uid);
// // //     const userDoc = await getDoc(userDocRef);
// // //     if (!userDoc.exists()) {
// // //       throw new Error('ไม่พบข้อมูลผู้ใช้');
// // //     }

// // //     const userData = userDoc.data();
// // //     const fcmToken = userData.fcmToken;
// // //     if (!fcmToken) {
// // //       throw new Error('ไม่พบ FCM Token');
// // //     }

// // //     // ส่งการแจ้งเตือนโดยใช้ token ของ user
// // //     const response = await fetch('https://fcm.googleapis.com/fcm/send', {
// // //       method: 'POST',
// // //       headers: {
// // //         'Content-Type': 'application/json',
// // //         'Authorization': '112967507190850331227'
// // //       },
// // //       body: JSON.stringify({
// // //         to: fcmToken,
// // //         notification: {
// // //           title: notification.title,
// // //           body: notification.body,
// // //           image: notification.image || undefined
// // //         }
// // //       })
// // //     });

// // //     if (!response.ok) {
// // //       throw new Error('การส่งการแจ้งเตือนล้มเหลว');
// // //     }

// // //     alert('ส่งการแจ้งเตือนสำเร็จ!');
// // //   } catch (error) {
// // //     console.error('Error:', error);
// // //     alert('ไม่สามารถส่งการแจ้งเตือนได้: ' + error.message);
// // //   }
// // // };

// // //   return (
// // //     <div className="notification-container">
// // //       <div className="notification-card">
// // //         <div className="card-header">
// // //           <h2 className="card-title">Send Push Notification</h2>
// // //         </div>
        
// // //         <form onSubmit={handleSubmit}>
// // //           <div className="form-group">
// // //             <label className="form-label" htmlFor="title">Notification Title</label>
// // //             <input
// // //               className="form-input"
// // //               id="title"
// // //               value={notification.title}
// // //               onChange={(e) => setNotification({...notification, title: e.target.value})}
// // //               placeholder="Enter notification title"
// // //             />
// // //           </div>
          
// // //           <div className="form-group">
// // //             <label className="form-label" htmlFor="body">Notification Body</label>
// // //             <input
// // //               className="form-input"
// // //               id="body"
// // //               value={notification.body}
// // //               onChange={(e) => setNotification({...notification, body: e.target.value})}
// // //               placeholder="Enter notification message"
// // //             />
// // //           </div>

// // //           <div className="form-group">
// // //             <label className="form-label" htmlFor="image">Image URL (Optional)</label>
// // //             <input
// // //               className="form-input"
// // //               id="image"
// // //               value={notification.image}
// // //               onChange={(e) => setNotification({...notification, image: e.target.value})}
// // //               placeholder="https://example.com/image.jpg"
// // //             />
// // //           </div>

// // //           <div className="form-actions">
// // //             <button type="submit" className="button button-primary">
// // //               Send Notification
// // //             </button>
// // //           </div>
// // //         </form>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default CreateNotifications;





// // import React, { useState, useEffect } from 'react';
// // import './createnotifications.css';
// // // ดึง auth, firestore, messaging จากไฟล์ firebase.js ของเรา
// // import { auth, firestore, messaging } from '../../firebase';

// // // สำหรับ token ของ Firebase Cloud Messaging
// // import { getToken } from 'firebase/messaging';

// // // ดึง doc, getDoc จาก firebase/firestore
// // import { doc, getDoc } from 'firebase/firestore';

// // const CreateNotifications = () => {
// //   const [isLoggedIn, setIsLoggedIn] = useState(false);

// //   // State สำหรับ notification
// //   const [notification, setNotification] = useState({
// //     title: '',
// //     body: '',
// //     image: '',
// //     target: 'all'
// //   });

// //   useEffect(() => {
// //     const unsubscribe = auth.onAuthStateChanged((user) => {
// //       setIsLoggedIn(!!user);
// //     });
// //     return () => unsubscribe();
// //   }, []);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       const currentUser = auth.currentUser;
// //       if (!currentUser) {
// //         throw new Error('กรุณาเข้าสู่ระบบก่อนส่งการแจ้งเตือน');
// //       }

// //       // ดึง doc ของ user ที่ล็อกอินอยู่
// //       const userDocRef = doc(firestore, 'users', currentUser.uid);
// //       const userDocSnap = await getDoc(userDocRef);

// //       if (!userDocSnap.exists()) {
// //         throw new Error('ไม่พบข้อมูลผู้ใช้');
// //       }

// //       const userData = userDocSnap.data();
// //       const fcmToken = userData.fcmToken;
// //       if (!fcmToken) {
// //         throw new Error('ไม่พบ FCM Token');
// //       }

// //       // เรียกส่ง Notification ไปยัง FCM
// //       const response = await fetch('https://fcm.googleapis.com/fcm/send', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           // ใส่ Server key ให้ถูกต้อง
// //           // 'Authorization': `key=AAAAmX_jxhY:APA91bFDzW1t3Kz9o_sBK3t4BHosjZRxjK3FPPCQu2qPBUcqxXKUFKR3iGaW9SnauA-MvYT_EBtFUMlrnALg6GbcJ71S2E33P2HM4TwWXZnHcP7L6jVvp-vbVCVYvqfCL3KvxKfxadtw`
// //           // 'Authorization': 'key=AIzaSyAIAAz_WbarBDJRC-X7sF-S48cjG8vVpUg'
// //           // 'Authorization': 'key=AIzaSyCRdqZDsqyeb-mO6ibu1BcC3woUUEBeOIw'
// //           'Authorization': 'key=175514363636'
// //         },
// //         body: JSON.stringify({
// //           to: fcmToken,
// //           notification: {
// //             title: notification.title,
// //             body: notification.body,
// //             image: notification.image || undefined
// //           }
// //         })
// //       });
      

// //       if (!response.ok) {
// //         throw new Error('การส่งการแจ้งเตือนล้มเหลว');
// //       }

// //       alert('ส่งการแจ้งเตือนสำเร็จ!');
// //     } catch (error) {
// //       console.error('Error:', error);
// //       alert('ไม่สามารถส่งการแจ้งเตือนได้: ' + error.message);
// //     }
// //   };

// //   return (
// //     <div className="notification-container">
// //       <div className="notification-card">
// //         <div className="card-header">
// //           <h2 className="card-title">Send Push Notification</h2>
// //         </div>
        
// //         <form onSubmit={handleSubmit}>
// //           <div className="form-group">
// //             <label className="form-label" htmlFor="title">Notification Title</label>
// //             <input
// //               className="form-input"
// //               id="title"
// //               value={notification.title}
// //               onChange={(e) =>
// //                 setNotification({ ...notification, title: e.target.value })
// //               }
// //               placeholder="Enter notification title"
// //             />
// //           </div>
          
// //           <div className="form-group">
// //             <label className="form-label" htmlFor="body">Notification Body</label>
// //             <input
// //               className="form-input"
// //               id="body"
// //               value={notification.body}
// //               onChange={(e) =>
// //                 setNotification({ ...notification, body: e.target.value })
// //               }
// //               placeholder="Enter notification message"
// //             />
// //           </div>

// //           <div className="form-group">
// //             <label className="form-label" htmlFor="image">Image URL (Optional)</label>
// //             <input
// //               className="form-input"
// //               id="image"
// //               value={notification.image}
// //               onChange={(e) =>
// //                 setNotification({ ...notification, image: e.target.value })
// //               }
// //               placeholder="https://example.com/image.jpg"
// //             />
// //           </div>

// //           <div className="form-actions">
// //             <button type="submit" className="button button-primary">
// //               Send Notification
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default CreateNotifications;



// import React, { useState, useEffect } from 'react';
// import './createnotifications.css';
// import { auth, firestore } from '../../firebase';
// import { doc, getDoc } from 'firebase/firestore';
// import { sendNotification } from '../../api/notifications';

// const CreateNotifications = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [notification, setNotification] = useState({
//     title: '',
//     body: '',
//     image: '',
//     target: 'all'
//   });

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       setIsLoggedIn(!!user);
//     });
//     return () => unsubscribe();
//   }, []);

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   try {
//   //     const currentUser = auth.currentUser;
//   //     if (!currentUser) {
//   //       throw new Error('กรุณาเข้าสู่ระบบก่อนส่งการแจ้งเตือน');
//   //     }

//   //     // ดึง doc ของ user ที่ล็อกอินอยู่
//   //     const userDocRef = doc(firestore, 'users', currentUser.uid);
//   //     const userDocSnap = await getDoc(userDocRef);

//   //     if (!userDocSnap.exists()) {
//   //       throw new Error('ไม่พบข้อมูลผู้ใช้');
//   //     }

//   //     // ส่งการแจ้งเตือน
//   //     await sendNotification({
//   //       ...notification,
//   //       userId: currentUser.uid
//   //     });

//   //     alert('ส่งการแจ้งเตือนสำเร็จ!');
      
//   //     // เคลียร์ฟอร์ม
//   //     setNotification({
//   //       title: '',
//   //       body: '',
//   //       image: '',
//   //       target: 'all'
//   //     });

//   //   } catch (error) {
//   //     console.error('Error:', error);
//   //     alert('ไม่สามารถส่งการแจ้งเตือนได้: ' + error.message);
//   //   }
//   // };


//   // ใน createnotifications.jsx
// const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     const currentUser = auth.currentUser;
//     if (!currentUser) {
//       throw new Error('กรุณาเข้าสู่ระบบก่อนส่งการแจ้งเตือน');
//     }

//     // เพิ่ม logging
//     console.log('Sending notification with data:', {
//       userId: currentUser.uid,
//       title: notification.title,
//       body: notification.body
//     });

//     // ส่งการแจ้งเตือน
//     const result = await sendNotification({
//       ...notification,
//       userId: currentUser.uid
//     });

//     console.log('Notification result:', result);  // เพิ่ม logging

//     if (result.success) {
//       alert('ส่งการแจ้งเตือนสำเร็จ!');
//       setNotification({
//         title: '',
//         body: '',
//         image: '',
//         target: 'all'
//       });
//     } else {
//       throw new Error(result.error || 'การส่งการแจ้งเตือนล้มเหลว');
//     }

//   } catch (error) {
//     console.error('Detailed error:', error);  // เพิ่ม detailed logging
//     alert('ไม่สามารถส่งการแจ้งเตือนได้: ' + error.message);
//   }
// };

//   return (
//     <div className="notification-container">
//       <div className="notification-card">
//         <div className="card-header">
//           <h2 className="card-title">Send Push Notification</h2>
//         </div>
        
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label className="form-label" htmlFor="title">Notification Title</label>
//             <input
//               className="form-input"
//               id="title"
//               value={notification.title}
//               onChange={(e) =>
//                 setNotification({ ...notification, title: e.target.value })
//               }
//               placeholder="Enter notification title"
//               required
//             />
//           </div>
          
//           <div className="form-group">
//             <label className="form-label" htmlFor="body">Notification Body</label>
//             <input
//               className="form-input"
//               id="body"
//               value={notification.body}
//               onChange={(e) =>
//                 setNotification({ ...notification, body: e.target.value })
//               }
//               placeholder="Enter notification message"
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label className="form-label" htmlFor="image">Image URL (Optional)</label>
//             <input
//               className="form-input"
//               id="image"
//               value={notification.image}
//               onChange={(e) =>
//                 setNotification({ ...notification, image: e.target.value })
//               }
//               placeholder="https://example.com/image.jpg"
//             />
//           </div>

//           <div className="form-actions">
//             <button 
//               type="submit" 
//               className="button button-primary"
//               disabled={!isLoggedIn}
//             >
//               Send Notification
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateNotifications;

import { auth, firestore } from '../../firebase';
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const CreateNotifications = () => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(firestore, 'users'));
                const usersWithTokens = [];
                querySnapshot.forEach((doc) => {
                    const userData = doc.data();
                    if (userData.fcmToken) {
                        usersWithTokens.push({
                            id: doc.id,
                            ...userData
                        });
                    }
                });
                setUsers(usersWithTokens);
            } catch (error) {
                console.error('Error fetching users:', error);
                setStatus('ไม่สามารถโหลดรายการผู้ใช้ได้');
            }
        };

        fetchUsers();
    }, []);

    const getAccessToken = async () => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                const token = await user.getIdToken();
                return token;
            }
            throw new Error('No user logged in');
        } catch (error) {
            console.error('Error getting access token:', error);
            throw error;
        }
    };

    const sendNotification = async (token) => {
        try {
            const accessToken = await getAccessToken();
            const response = await fetch('https://fcm.googleapis.com/v1/projects/regaproject-c2cf7/messages:send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer 175514363636`
                },
                body: JSON.stringify({
                    message: {
                        token: token,
                        notification: {
                            title: title,
                            body: message
                        }
                    }
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('FCM Error:', errorData);
                throw new Error(errorData.error?.message || 'Failed to send notification');
            }

            return true;
        } catch (error) {
            console.error('Error sending notification:', error);
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');

        if (!title || !message) {
            setStatus('กรุณากรอกหัวข้อและข้อความให้ครบถ้วน');
            setLoading(false);
            return;
        }

        try {
            let successCount = 0;
            let failCount = 0;

            for (const user of users) {
                if (user.fcmToken) {
                    const success = await sendNotification(user.fcmToken);
                    if (success) {
                        successCount++;
                    } else {
                        failCount++;
                    }
                }
            }

            setStatus(`ส่งการแจ้งเตือนสำเร็จ ${successCount} ราย, ล้มเหลว ${failCount} ราย`);
        } catch (error) {
            console.error('Error in send notification:', error);
            setStatus('เกิดข้อผิดพลาดในการส่งการแจ้งเตือน');
        }

        setLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6">สร้างการแจ้งเตือน</h1>
                
                {status && (
                    <div className="mb-4 p-4 rounded-lg bg-blue-50 text-blue-600">
                        {status}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            หัวข้อการแจ้งเตือน
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="กรอกหัวข้อการแจ้งเตือน"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            ข้อความ
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="กรอกข้อความที่ต้องการแจ้งเตือน"
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`w-full px-4 py-2 text-white font-medium rounded-md 
                                ${loading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            {loading ? 'กำลังส่ง...' : 'ส่งการแจ้งเตือน'}
                        </button>
                    </div>
                </form>

                <div className="mt-4">
                    <p className="text-sm text-gray-600">
                        จำนวนผู้ใช้ที่สามารถรับการแจ้งเตือน: {users.length} คน
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CreateNotifications;