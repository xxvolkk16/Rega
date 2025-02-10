// import React, { useState, useEffect } from 'react';
// import './createnotifications.css';
// import { auth, signInWithGoogle, requestNotificationPermission } from '../../firebase';
// import { sendNotification } from '../../api/notifications';

// const CreateNotifications = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [notification, setNotification] = useState({
//     title: '',
//     body: '',
//     image: '',
//     name: '',
//     target: 'all', // all, topic, or token
//     topic: '',
//     scheduling: 'now', // now, scheduled, or recurring
//     scheduledTime: '',
//     recurring: 'daily',
//     analytics: {
//       campaign: '',
//       label: ''
//     }
//   });

//   useEffect(() => {
//     // ตรวจสอบสถานะการล็อกอิน
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       setIsLoggedIn(!!user);
//     });
//     return () => unsubscribe();
//   }, []);

//   // ใน createnotifications.jsx
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // เช็คว่ามี user ที่ล็อกอินอยู่หรือไม่
//       const currentUser = auth.currentUser;
//       if (!currentUser) {
//         throw new Error('กรุณาเข้าสู่ระบบก่อนส่งการแจ้งเตือน');
//       }

//       // ขอ token สำหรับส่งการแจ้งเตือน
//       const token = await currentUser.getIdToken();

//       // ส่งการแจ้งเตือนพร้อม token
//       await sendNotification({
//         ...notification,
//         token: token
//       });
      
//       alert('ส่งการแจ้งเตือนสำเร็จ!');
//     } catch (error) {
//       console.error('Error:', error);
//       alert('ไม่สามารถส่งการแจ้งเตือนได้: ' + error.message);
//     }
//   };

//   return (
//     <div className="notification-container">
//       <div className="notification-card">
//         <div className="card-header">
//           <h2 className="card-title">Send Push Notification</h2>
//         </div>
        
//         <form onSubmit={handleSubmit}>
//           {/* Notification Content */}
//           <div className="form-group">
//             <label className="form-label" htmlFor="title">Notification Title</label>
//             <input
//               className="form-input"
//               id="title"
//               value={notification.title}
//               onChange={(e) => setNotification({...notification, title: e.target.value})}
//               placeholder="Enter notification title"
//             />
//           </div>
          
//           <div className="form-group">
//             <label className="form-label" htmlFor="body">Notification Body</label>
//             <input
//               className="form-input"
//               id="body"
//               value={notification.body}
//               onChange={(e) => setNotification({...notification, body: e.target.value})}
//               placeholder="Enter notification message"
//             />
//           </div>

//           <div className="form-group">
//             <label className="form-label" htmlFor="image">Image URL (Optional)</label>
//             <input
//               className="form-input"
//               id="image"
//               value={notification.image}
//               onChange={(e) => setNotification({...notification, image: e.target.value})}
//               placeholder="https://example.com/image.jpg"
//             />
//           </div>

//           {/* Target Selection */}
//           <div className="form-group">
//             <label className="form-label">Target Users</label>
//             <div className="button-group">
//               <button
//                 type="button"
//                 className={`button ${notification.target === 'all' ? 'button-primary' : 'button-outline'}`}
//                 onClick={() => setNotification({...notification, target: 'all'})}
//               >
//                 All Users
//               </button>
//               <button
//                 type="button"
//                 className={`button ${notification.target === 'topic' ? 'button-primary' : 'button-outline'}`}
//                 onClick={() => setNotification({...notification, target: 'topic'})}
//               >
//                 Topic
//               </button>
//             </div>

//             {notification.target === 'topic' && (
//               <input
//                 className="form-input"
//                 value={notification.topic}
//                 onChange={(e) => setNotification({...notification, topic: e.target.value})}
//                 placeholder="Enter topic name"
//               />
//             )}
//           </div>

//           {/* Scheduling */}
//           <div className="form-group">
//             <label className="form-label">Scheduling</label>
//             <div className="button-group">
//               <button
//                 type="button"
//                 className={`button ${notification.scheduling === 'now' ? 'button-primary' : 'button-outline'}`}
//                 onClick={() => setNotification({...notification, scheduling: 'now'})}
//               >
//                 Send Now
//               </button>
//               <button
//                 type="button"
//                 className={`button ${notification.scheduling === 'scheduled' ? 'button-primary' : 'button-outline'}`}
//                 onClick={() => setNotification({...notification, scheduling: 'scheduled'})}
//               >
//                 Schedule
//               </button>
//             </div>

//             {notification.scheduling === 'scheduled' && (
//               <input
//                 className="form-input"
//                 type="datetime-local"
//                 value={notification.scheduledTime}
//                 onChange={(e) => setNotification({...notification, scheduledTime: e.target.value})}
//               />
//             )}
//           </div>

//           {/* Authentication Status */}
//           {!isLoggedIn && (
//             <div className="form-group">
//               <p className="auth-warning">You need to be logged in to send notifications.</p>
//               <button
//                 type="button"
//                 className="button button-primary"
//                 onClick={signInWithGoogle}
//               >
//                 Sign in with Google
//               </button>
//             </div>
//           )}

//           {/* Submit Buttons */}
//           <div className="form-actions">
//             <button type="button" className="button button-outline">Save Draft</button>
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
















// import React, { useState, useEffect } from 'react';
// import './createnotifications.css';
// import { auth, messaging } from '../../firebase';
// import { getToken } from 'firebase/messaging';
// // ดึง doc, getDoc จาก firebase/firestore
// import { doc, getDoc } from 'firebase/firestore';

// const CreateNotifications = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   // เพิ่มการประกาศ state notification
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

//  // 1. แก้ไขการดึง token ให้ใช้ token ของ user ที่ login แทน
// // 1. แก้ไขการดึง token ให้ใช้ token ของ user ที่ login แทน
// const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     const currentUser = auth.currentUser;
//     if (!currentUser) {
//       throw new Error('กรุณาเข้าสู่ระบบก่อนส่งการแจ้งเตือน');
//     }

//     // ดึง token จาก user ที่ login แทนการสร้าง token ใหม่
//     const userDocRef = doc(firestore, 'users', currentUser.uid);
//     const userDoc = await getDoc(userDocRef);
//     if (!userDoc.exists()) {
//       throw new Error('ไม่พบข้อมูลผู้ใช้');
//     }

//     const userData = userDoc.data();
//     const fcmToken = userData.fcmToken;
//     if (!fcmToken) {
//       throw new Error('ไม่พบ FCM Token');
//     }

//     // ส่งการแจ้งเตือนโดยใช้ token ของ user
//     const response = await fetch('https://fcm.googleapis.com/fcm/send', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': '112967507190850331227'
//       },
//       body: JSON.stringify({
//         to: fcmToken,
//         notification: {
//           title: notification.title,
//           body: notification.body,
//           image: notification.image || undefined
//         }
//       })
//     });

//     if (!response.ok) {
//       throw new Error('การส่งการแจ้งเตือนล้มเหลว');
//     }

//     alert('ส่งการแจ้งเตือนสำเร็จ!');
//   } catch (error) {
//     console.error('Error:', error);
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
//               onChange={(e) => setNotification({...notification, title: e.target.value})}
//               placeholder="Enter notification title"
//             />
//           </div>
          
//           <div className="form-group">
//             <label className="form-label" htmlFor="body">Notification Body</label>
//             <input
//               className="form-input"
//               id="body"
//               value={notification.body}
//               onChange={(e) => setNotification({...notification, body: e.target.value})}
//               placeholder="Enter notification message"
//             />
//           </div>

//           <div className="form-group">
//             <label className="form-label" htmlFor="image">Image URL (Optional)</label>
//             <input
//               className="form-input"
//               id="image"
//               value={notification.image}
//               onChange={(e) => setNotification({...notification, image: e.target.value})}
//               placeholder="https://example.com/image.jpg"
//             />
//           </div>

//           <div className="form-actions">
//             <button type="submit" className="button button-primary">
//               Send Notification
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateNotifications;





import React, { useState, useEffect } from 'react';
import './createnotifications.css';
// ดึง auth, firestore, messaging จากไฟล์ firebase.js ของเรา
import { auth, firestore, messaging } from '../../firebase';

// สำหรับ token ของ Firebase Cloud Messaging
import { getToken } from 'firebase/messaging';

// ดึง doc, getDoc จาก firebase/firestore
import { doc, getDoc } from 'firebase/firestore';

const CreateNotifications = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // State สำหรับ notification
  const [notification, setNotification] = useState({
    title: '',
    body: '',
    image: '',
    target: 'all'
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('กรุณาเข้าสู่ระบบก่อนส่งการแจ้งเตือน');
      }

      // ดึง doc ของ user ที่ล็อกอินอยู่
      const userDocRef = doc(firestore, 'users', currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        throw new Error('ไม่พบข้อมูลผู้ใช้');
      }

      const userData = userDocSnap.data();
      const fcmToken = userData.fcmToken;
      if (!fcmToken) {
        throw new Error('ไม่พบ FCM Token');
      }

      // เรียกส่ง Notification ไปยัง FCM
      const response = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // ใส่ Server key ให้ถูกต้อง
          'Authorization': '112967507190850331227'
        },
        body: JSON.stringify({
          to: fcmToken,
          notification: {
            title: notification.title,
            body: notification.body,
            image: notification.image || undefined
          }
        })
      });
      

      if (!response.ok) {
        throw new Error('การส่งการแจ้งเตือนล้มเหลว');
      }

      alert('ส่งการแจ้งเตือนสำเร็จ!');
    } catch (error) {
      console.error('Error:', error);
      alert('ไม่สามารถส่งการแจ้งเตือนได้: ' + error.message);
    }
  };

  return (
    <div className="notification-container">
      <div className="notification-card">
        <div className="card-header">
          <h2 className="card-title">Send Push Notification</h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="title">Notification Title</label>
            <input
              className="form-input"
              id="title"
              value={notification.title}
              onChange={(e) =>
                setNotification({ ...notification, title: e.target.value })
              }
              placeholder="Enter notification title"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="body">Notification Body</label>
            <input
              className="form-input"
              id="body"
              value={notification.body}
              onChange={(e) =>
                setNotification({ ...notification, body: e.target.value })
              }
              placeholder="Enter notification message"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="image">Image URL (Optional)</label>
            <input
              className="form-input"
              id="image"
              value={notification.image}
              onChange={(e) =>
                setNotification({ ...notification, image: e.target.value })
              }
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="button button-primary">
              Send Notification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNotifications;
