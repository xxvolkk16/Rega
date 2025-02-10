// const functions = require('firebase-functions');
// const admin = require('firebase-admin');
// const cors = require('cors')({origin: true});

// // Initialize Firebase Admin
// admin.initializeApp();

// // สำหรับส่ง notification แบบ broadcast ไปหาทุกคน
// exports.sendBroadcastNotification = functions.https.onCall(async (data, context) => {
//   try {
//     const { title, message, type, programId } = data;

//     // ดึง tokens ทั้งหมดจาก users collection
//     const usersSnapshot = await admin.firestore()
//       .collection('users')
//       .where('fcmToken', '!=', null)
//       .get();

//     const tokens = usersSnapshot.docs
//       .map(doc => doc.data().fcmToken)
//       .filter(token => token); // กรอง token ที่เป็น null หรือ empty

//     if (tokens.length === 0) {
//       throw new functions.https.HttpsError(
//         'failed-precondition',
//         'No valid FCM tokens found'
//       );
//     }

//     // สร้าง notification message
//     const notificationMessage = {
//       notification: {
//         title: title,
//         body: message
//       },
//       data: {
//         type: type || 'general',
//         programId: programId || '',
//         click_action: 'FLUTTER_NOTIFICATION_CLICK'
//       },
//       tokens: tokens // ส่งหาหลาย token พร้อมกัน
//     };

//     // ส่ง notification
//     const response = await admin.messaging().sendMulticast(notificationMessage);

//     // บันทึกลง Firestore
//     await admin.firestore().collection('notifications').add({
//       title,
//       message,
//       type,
//       programId,
//       sentAt: admin.firestore.FieldValue.serverTimestamp(),
//       successCount: response.successCount,
//       failureCount: response.failureCount
//     });

//     return {
//       success: true,
//       sentTo: tokens.length,
//       successCount: response.successCount,
//       failureCount: response.failureCount
//     };

//   } catch (error) {
//     console.error('Error sending broadcast notification:', error);
//     throw new functions.https.HttpsError('internal', error.message);
//   }
// });

// // สำหรับส่ง notification ไปหาผู้ใช้เฉพาะกลุ่ม
// exports.sendTargetedNotification = functions.https.onCall(async (data, context) => {
//   try {
//     const { title, message, userIds, type, programId } = data;

//     // ดึง tokens ของ users ที่ระบุ
//     const tokens = [];
//     for (const userId of userIds) {
//       const userDoc = await admin.firestore()
//         .collection('users')
//         .doc(userId)
//         .get();

//       if (userDoc.exists && userDoc.data().fcmToken) {
//         tokens.push(userDoc.data().fcmToken);
//       }
//     }

//     if (tokens.length === 0) {
//       throw new functions.https.HttpsError(
//         'failed-precondition',
//         'No valid FCM tokens found for specified users'
//       );
//     }

//     // สร้าง notification message
//     const notificationMessage = {
//       notification: {
//         title: title,
//         body: message
//       },
//       data: {
//         type: type || 'general',
//         programId: programId || '',
//         click_action: 'FLUTTER_NOTIFICATION_CLICK'
//       },
//       tokens: tokens
//     };

//     // ส่ง notification
//     const response = await admin.messaging().sendMulticast(notificationMessage);

//     // บันทึกลง Firestore
//     await admin.firestore().collection('notifications').add({
//       title,
//       message,
//       type,
//       programId,
//       targetUserIds: userIds,
//       sentAt: admin.firestore.FieldValue.serverTimestamp(),
//       successCount: response.successCount,
//       failureCount: response.failureCount
//     });

//     return {
//       success: true,
//       sentTo: tokens.length,
//       successCount: response.successCount,
//       failureCount: response.failureCount
//     };

//   } catch (error) {
//     console.error('Error sending targeted notification:', error);
//     throw new functions.https.HttpsError('internal', error.message);
//   }
// });

// // Trigger เมื่อมีการสร้าง notification ใหม่ใน Firestore
// exports.onNotificationCreated = functions.firestore
//   .document('notifications/{notificationId}')
//   .onCreate(async (snap, context) => {
//     const notification = snap.data();
    
//     // อัพเดทสถานะเป็น unread สำหรับทุกคนที่เกี่ยวข้อง
//     if (notification.targetUserIds) {
//       // กรณีส่งแบบเฉพาะเจาะจง
//       for (const userId of notification.targetUserIds) {
//         await admin.firestore()
//           .collection('users')
//           .doc(userId)
//           .collection('userNotifications')
//           .add({
//             notificationId: snap.id,
//             isRead: false,
//             receivedAt: admin.firestore.FieldValue.serverTimestamp()
//           });
//       }
//     } else {
//       // กรณีส่งแบบ broadcast
//       const usersSnapshot = await admin.firestore()
//         .collection('users')
//         .get();

//       const batch = admin.firestore().batch();
      
//       usersSnapshot.docs.forEach(userDoc => {
//         const userNotificationRef = admin.firestore()
//           .collection('users')
//           .doc(userDoc.id)
//           .collection('userNotifications')
//           .doc();

//         batch.set(userNotificationRef, {
//           notificationId: snap.id,
//           isRead: false,
//           receivedAt: admin.firestore.FieldValue.serverTimestamp()
//         });
//       });

//       await batch.commit();
//     }
//   });


const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});

// Initialize Firebase Admin
admin.initializeApp();

// Cloud Function สำหรับส่ง Broadcast Notification
exports.sendBroadcastNotification = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      const { title, message, type, programId } = req.body;

      // ดึง tokens ทั้งหมดจาก users collection
      const usersSnapshot = await admin.firestore()
        .collection('users')
        .where('fcmToken', '!=', null)
        .get();

      const tokens = usersSnapshot.docs
        .map(doc => doc.data().fcmToken)
        .filter(token => token);

      if (tokens.length === 0) {
        throw new Error('No valid FCM tokens found');
      }

      // สร้าง notification message
      const notificationMessage = {
        notification: {
          title: title,
          body: message
        },
        data: {
          type: type || 'general',
          programId: programId || '',
          click_action: 'FLUTTER_NOTIFICATION_CLICK'
        },
        tokens: tokens
      };

      // ส่ง notification
      const response = await admin.messaging().sendMulticast(notificationMessage);

      // บันทึกลง Firestore
      await admin.firestore().collection('notifications').add({
        title,
        message,
        type,
        programId,
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
        successCount: response.successCount,
        failureCount: response.failureCount
      });

      res.status(200).json({
        success: true,
        sentTo: tokens.length,
        successCount: response.successCount,
        failureCount: response.failureCount
      });

    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  });
});

// Cloud Function สำหรับส่ง Targeted Notification
exports.sendTargetedNotification = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      const { title, message, userIds, type, programId } = req.body;

      // ดึง tokens ของ users ที่ระบุ
      const tokens = [];
      for (const userId of userIds) {
        const userDoc = await admin.firestore()
          .collection('users')
          .doc(userId)
          .get();

        if (userDoc.exists && userDoc.data().fcmToken) {
          tokens.push(userDoc.data().fcmToken);
        }
      }

      if (tokens.length === 0) {
        throw new Error('No valid FCM tokens found for specified users');
      }

      // สร้าง notification message
      const notificationMessage = {
        notification: {
          title: title,
          body: message
        },
        data: {
          type: type || 'general',
          programId: programId || '',
          click_action: 'FLUTTER_NOTIFICATION_CLICK'
        },
        tokens: tokens
      };

      // ส่ง notification
      const response = await admin.messaging().sendMulticast(notificationMessage);

      // บันทึกลง Firestore
      await admin.firestore().collection('notifications').add({
        title,
        message,
        type,
        programId,
        targetUserIds: userIds,
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
        successCount: response.successCount,
        failureCount: response.failureCount
      });

      res.status(200).json({
        success: true,
        sentTo: tokens.length,
        successCount: response.successCount,
        failureCount: response.failureCount
      });

    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  });
});