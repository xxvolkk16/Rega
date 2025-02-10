// src/services/authService.js
import { auth, firestore, messaging } from '../firebase';  // แก้ path ให้ถูกต้อง
import { doc, updateDoc } from 'firebase/firestore';
import { getToken } from 'firebase/messaging';

export const setupFCMForUser = async (userId) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission not granted');
      return null;
    }

    const fcmToken = await getToken(messaging, {
      vapidKey: 'BPVvFQt3T3tC4ROvXIZUGiQfG_okVnf9t2PE46piGCUe7n55zpK1ATkV9Y4EG5QF7mZtFQ8TwG_E6jvPpxT4BRM'
    });

    if (!fcmToken) {
      console.log('No FCM token available');
      return null;
    }

    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, {
      fcmToken: fcmToken,
      lastTokenUpdate: new Date()
    });

    return fcmToken;
  } catch (error) {
    console.error('Error setting up FCM:', error);
    return null;
  }
};