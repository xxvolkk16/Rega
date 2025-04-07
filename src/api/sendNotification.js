// src/api/sendNotification.js
import { db, messaging } from '../firebase-admin.js'; // ต้องสร้างไฟล์นี้

export default async function sendNotification(req, res) {
  try {
    const { title, body, topic, tokens, data } = req.body;
    
    // สร้างข้อความแจ้งเตือน
    const message = {
      notification: {
        title: title,
        body: body
      },
      data: data || {}
    };
    
    // กำหนดเป้าหมาย
    let response;
    if (topic) {
      message.topic = topic;
      response = await messaging.send(message);
    } else if (tokens && tokens.length > 0) {
      // ส่งให้กับอุปกรณ์ที่ระบุ
      if (tokens.length === 1) {
        message.token = tokens[0];
        response = await messaging.send(message);
      } else {
        message.tokens = tokens;
        response = await messaging.sendMulticast(message);
      }
    } else {
      return res.status(400).json({ success: false, error: 'ต้องระบุ topic หรือ tokens' });
    }
    
    // บันทึกลง Firestore
    const notificationLog = {
      title,
      body,
      data: data || {},
      topic: topic || null,
      tokens: tokens || null,
      sentAt: new Date(),
      status: 'sent',
      messageId: response.messageId || (response.responses && response.responses.map(r => r.messageId))
    };
    
    await db.collection('notificationHistory').add(notificationLog);
    
    return res.status(200).json({
      success: true,
      messageId: response.messageId || (response.responses && response.responses.map(r => r.messageId))
    });
    
  } catch (error) {
    console.error('Error sending notification:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}