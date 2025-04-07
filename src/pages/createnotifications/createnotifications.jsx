import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getDatabase, ref, push, serverTimestamp, set, update, onValue } from 'firebase/database';
import { firestore } from '../../firebase'; // ปรับตามโครงสร้างโปรเจคของคุณ
import './createnotifications.css'; // ใช้ไฟล์ CSS เดิมของคุณ

const CreateNotifications = () => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedTarget, setSelectedTarget] = useState('all'); // 'all' หรือ 'topic'
    const [topic, setTopic] = useState('');
    const [scheduling, setScheduling] = useState('now'); // 'now' หรือ 'scheduled'
    const [scheduledDate, setScheduledDate] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');
    const [sentNotifications, setSentNotifications] = useState([]);
    const [showHistory, setShowHistory] = useState(false);

    // ดึงรายชื่อผู้ใช้เมื่อโหลดหน้า
    useEffect(() => {
        fetchUsers();
        loadNotificationHistory();
    }, []);

    // ดึงข้อมูลผู้ใช้ที่มี FCM token
    const fetchUsers = async () => {
        try {
            const q = query(collection(firestore, 'users'));
            const querySnapshot = await getDocs(q);
            
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
            console.log(`Found ${usersWithTokens.length} users with tokens`);
        } catch (error) {
            console.error('Error fetching users:', error);
            setStatus('ไม่สามารถโหลดรายการผู้ใช้ได้');
        }
    };

    // โหลดประวัติการส่งการแจ้งเตือน
    const loadNotificationHistory = () => {
        const db = getDatabase();
        const campaignsRef = ref(db, 'fcm_campaigns');
        
        onValue(campaignsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const campaignsArray = [];
                
                Object.entries(data).forEach(([id, campaign]) => {
                    campaignsArray.push({
                        id,
                        ...campaign
                    });
                });
                
                // เรียงตามเวลาล่าสุด
                campaignsArray.sort((a, b) => {
                    const timeA = a.sentAt || 0;
                    const timeB = b.sentAt || 0;
                    return timeB - timeA;
                });
                
                setSentNotifications(campaignsArray);
            }
        });
    };

    // ฟังก์ชันดึง Server Key (ในเครื่องจริงควรเก็บไว้ในเซิร์ฟเวอร์)
    const getServerKey = () => {
        // แทนที่ด้วย Server Key ของคุณจาก Firebase Console > Project Settings > Cloud Messaging
        return 'YOUR_SERVER_KEY';
    };

    // ส่งการแจ้งเตือนแบบ HTTP
    const sendNotificationViaFCM = async (target, campaignId) => {
        try {
            const serverKey = getServerKey();
            const fcmEndpoint = 'https://fcm.googleapis.com/fcm/send';
            
            // สร้าง payload สำหรับ FCM
            let body = {
                notification: {
                    title: title,
                    body: message,
                    image: imageUrl || undefined
                },
                data: {
                    campaignId: campaignId,
                    click_action: 'FLUTTER_NOTIFICATION_CLICK',
                    timestamp: Date.now().toString()
                }
            };
            
            // กำหนดเป้าหมายการส่ง
            if (selectedTarget === 'all') {
                // ส่งแบบ multicast ไปยังทุก token
                const tokens = users.map(user => user.fcmToken).filter(token => token);
                if (tokens.length === 0) {
                    throw new Error('ไม่พบ token สำหรับส่งการแจ้งเตือน');
                }
                body.registration_ids = tokens;
            } else if (selectedTarget === 'topic') {
                // ส่งไปยัง topic
                if (!topic) {
                    throw new Error('กรุณาระบุ topic');
                }
                body.to = `/topics/${topic}`;
            } else {
                // ส่งเฉพาะ token เดียว
                body.to = target;
            }
            
            // ส่งการแจ้งเตือนไปยัง FCM
            const response = await fetch(fcmEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `key=${serverKey}`
                },
                body: JSON.stringify(body)
            });
            
            const responseData = await response.json();
            console.log('FCM Response:', responseData);
            
            if (!response.ok) {
                throw new Error(`FCM Error: ${responseData.error || 'Unknown error'}`);
            }
            
            return responseData;
        } catch (error) {
            console.error('Error sending notification:', error);
            throw error;
        }
    };

    // บันทึกข้อมูลแคมเปญลง Realtime Database
    const createCampaignEntry = async () => {
        try {
            const auth = getAuth();
            const currentUser = auth.currentUser;
            const db = getDatabase();
            const campaignsRef = ref(db, 'fcm_campaigns');
            
            // ข้อมูลแคมเปญ
            const campaignData = {
                name: title,
                description: message,
                imageUrl: imageUrl || null,
                target: selectedTarget,
                topic: selectedTarget === 'topic' ? topic : null,
                recipientCount: selectedTarget === 'all' ? users.length : 0,
                openCount: 0,
                clickCount: 0,
                status: scheduling === 'now' ? 'sending' : 'scheduled',
                sentAt: scheduling === 'now' ? serverTimestamp() : null,
                scheduledFor: scheduling === 'scheduled' ? new Date(`${scheduledDate}T${scheduledTime}`).getTime() : null,
                sentBy: currentUser ? currentUser.uid : 'unknown',
                createdAt: serverTimestamp()
            };
            
            // บันทึกแคมเปญใหม่
            const newCampaignRef = push(campaignsRef);
            await set(newCampaignRef, campaignData);
            
            return newCampaignRef.key;
        } catch (error) {
            console.error('Error creating campaign entry:', error);
            throw error;
        }
    };

    // อัพเดทสถานะแคมเปญหลังส่งเสร็จ
    const updateCampaignStatus = async (campaignId, successCount, failCount) => {
        try {
            const db = getDatabase();
            const campaignRef = ref(db, `fcm_campaigns/${campaignId}`);
            
            const updates = {
                status: 'completed',
                successCount,
                failCount,
                completedAt: serverTimestamp()
            };
            
            await update(campaignRef, updates);
        } catch (error) {
            console.error('Error updating campaign status:', error);
        }
    };

    // ฟังก์ชันส่งการแจ้งเตือน
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');

        // ตรวจสอบฟอร์ม
        if (!title || !message) {
            setStatus('กรุณากรอกหัวข้อและข้อความให้ครบถ้วน');
            setLoading(false);
            return;
        }

        if (selectedTarget === 'topic' && !topic) {
            setStatus('กรุณาระบุ topic สำหรับการส่ง');
            setLoading(false);
            return;
        }

        if (scheduling === 'scheduled') {
            if (!scheduledDate || !scheduledTime) {
                setStatus('กรุณาระบุวันที่และเวลาสำหรับการส่ง');
                setLoading(false);
                return;
            }
            
            // ตรวจสอบว่าเวลาที่กำหนดอยู่ในอนาคต
            const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
            if (scheduledDateTime <= new Date()) {
                setStatus('กรุณาระบุเวลาที่อยู่ในอนาคต');
                setLoading(false);
                return;
            }
        }

        try {
            // สร้างแคมเปญใน Realtime Database
            const campaignId = await createCampaignEntry();
            
            // ถ้าเป็นการส่งทันที
            if (scheduling === 'now') {
                let successCount = 0;
                let failCount = 0;
                
                if (selectedTarget === 'all') {
                    // ส่งแบบกลุ่ม (multicast) ให้ผู้ใช้ทั้งหมด
                    try {
                        const response = await sendNotificationViaFCM(null, campaignId);
                        successCount = response.success || 0;
                        failCount = response.failure || 0;
                    } catch (error) {
                        console.error('Error sending multicast notification:', error);
                        failCount = users.length;
                    }
                } else if (selectedTarget === 'topic') {
                    // ส่งไปยัง topic
                    try {
                        await sendNotificationViaFCM(null, campaignId);
                        successCount = 1; // ไม่สามารถนับจำนวนผู้ใช้ในแต่ละ topic ได้
                    } catch (error) {
                        console.error('Error sending topic notification:', error);
                        failCount = 1;
                    }
                } else {
                    // ส่งแยกทีละคน
                    for (const user of users) {
                        if (user.fcmToken) {
                            try {
                                await sendNotificationViaFCM(user.fcmToken, campaignId);
                                successCount++;
                            } catch (error) {
                                console.error('Error sending to user:', user.id, error);
                                failCount++;
                            }
                        }
                    }
                }
                
                // อัพเดทสถานะแคมเปญ
                await updateCampaignStatus(campaignId, successCount, failCount);
                
                setStatus(`ส่งการแจ้งเตือนสำเร็จ ${successCount} ราย, ล้มเหลว ${failCount} ราย`);
            } else {
                // การส่งแบบกำหนดเวลา (ต้องมีระบบหลังบ้านหรือ Cloud Functions)
                setStatus('กำหนดเวลาส่งการแจ้งเตือนสำเร็จ');
            }
            
            // เคลียร์ฟอร์ม
            setTitle('');
            setMessage('');
            setImageUrl('');
            setSelectedTarget('all');
            setTopic('');
            setScheduling('now');
            setScheduledDate('');
            setScheduledTime('');
        } catch (error) {
            console.error('Error in send notification:', error);
            setStatus(`เกิดข้อผิดพลาดในการส่งการแจ้งเตือน: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // ฟอร์แมตวันที่สำหรับแสดงผล
    const formatDate = (timestamp) => {
        if (!timestamp) return 'ไม่ระบุ';
        const date = new Date(timestamp);
        return date.toLocaleString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="notification-container">
            <div className="notification-tabs">
                <button 
                    className={!showHistory ? "tab-active" : ""} 
                    onClick={() => setShowHistory(false)}
                >
                    สร้างการแจ้งเตือน
                </button>
                <button 
                    className={showHistory ? "tab-active" : ""} 
                    onClick={() => setShowHistory(true)}
                >
                    ประวัติการส่ง
                </button>
            </div>

            {!showHistory ? (
                <div className="notification-card">
                    <div className="card-header">
                        <h2 className="card-title">สร้างการแจ้งเตือน</h2>
                    </div>
                    
                    {status && (
                        <div className="status-message">
                            {status}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="title">หัวข้อการแจ้งเตือน</label>
                            <input
                                className="form-input"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="กรอกหัวข้อการแจ้งเตือน"
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label" htmlFor="message">ข้อความ</label>
                            <textarea
                                className="form-input"
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="กรอกข้อความที่ต้องการแจ้งเตือน"
                                rows={4}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="imageUrl">URL รูปภาพ (ไม่บังคับ)</label>
                            <input
                                className="form-input"
                                id="imageUrl"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">ผู้รับการแจ้งเตือน</label>
                            <div className="button-group">
                                <button
                                    type="button"
                                    className={`button ${selectedTarget === 'all' ? 'button-primary' : 'button-outline'}`}
                                    onClick={() => setSelectedTarget('all')}
                                >
                                    ผู้ใช้ทั้งหมด ({users.length})
                                </button>
                                <button
                                    type="button"
                                    className={`button ${selectedTarget === 'topic' ? 'button-primary' : 'button-outline'}`}
                                    onClick={() => setSelectedTarget('topic')}
                                >
                                    Topic
                                </button>
                            </div>

                            {selectedTarget === 'topic' && (
                                <div className="form-group">
                                    <input
                                        className="form-input"
                                        placeholder="ระบุชื่อ topic เช่น news, updates"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        required={selectedTarget === 'topic'}
                                    />
                                    <small>ผู้ใช้ต้องลงทะเบียนรับ topic นี้ก่อน</small>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">กำหนดเวลาส่ง</label>
                            <div className="button-group">
                                <button
                                    type="button"
                                    className={`button ${scheduling === 'now' ? 'button-primary' : 'button-outline'}`}
                                    onClick={() => setScheduling('now')}
                                >
                                    ส่งทันที
                                </button>
                                <button
                                    type="button"
                                    className={`button ${scheduling === 'scheduled' ? 'button-primary' : 'button-outline'}`}
                                    onClick={() => setScheduling('scheduled')}
                                >
                                    กำหนดเวลา
                                </button>
                            </div>

                            {scheduling === 'scheduled' && (
                                <div className="schedule-inputs">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="scheduledDate">วันที่</label>
                                        <input
                                            className="form-input"
                                            id="scheduledDate"
                                            type="date"
                                            value={scheduledDate}
                                            onChange={(e) => setScheduledDate(e.target.value)}
                                            required={scheduling === 'scheduled'}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="scheduledTime">เวลา</label>
                                        <input
                                            className="form-input"
                                            id="scheduledTime"
                                            type="time"
                                            value={scheduledTime}
                                            onChange={(e) => setScheduledTime(e.target.value)}
                                            required={scheduling === 'scheduled'}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="button button-primary"
                                disabled={loading}
                            >
                                {loading ? 'กำลังส่ง...' : 'ส่งการแจ้งเตือน'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="notification-card">
                    <div className="card-header">
                        <h2 className="card-title">ประวัติการส่งการแจ้งเตือน</h2>
                    </div>
                    
                    <div className="campaign-list">
                        {sentNotifications.length === 0 ? (
                            <div className="empty-state">
                                <p>ยังไม่มีประวัติการส่งการแจ้งเตือน</p>
                            </div>
                        ) : (
                            sentNotifications.map(campaign => (
                                <div key={campaign.id} className="campaign-item">
                                    <div className="campaign-header">
                                        <h3>{campaign.name}</h3>
                                        <span className={`status-badge status-${campaign.status}`}>
                                            {campaign.status === 'completed' ? 'สำเร็จ' : 
                                             campaign.status === 'sending' ? 'กำลังส่ง' : 
                                             campaign.status === 'scheduled' ? 'กำหนดเวลา' : campaign.status}
                                        </span>
                                    </div>
                                    <p className="campaign-description">{campaign.description}</p>
                                    <div className="campaign-details">
                                        <div className="campaign-stat">
                                            <span className="stat-label">ส่งเมื่อ:</span>
                                            <span className="stat-value">{formatDate(campaign.sentAt)}</span>
                                        </div>
                                        <div className="campaign-stat">
                                            <span className="stat-label">ผู้รับ:</span>
                                            <span className="stat-value">{campaign.recipientCount || 0}</span>
                                        </div>
                                        <div className="campaign-stat">
                                            <span className="stat-label">เปิดอ่าน:</span>
                                            <span className="stat-value">
                                                {campaign.openCount || 0} 
                                                {campaign.recipientCount ? ` (${((campaign.openCount || 0) / campaign.recipientCount * 100).toFixed(1)}%)` : ''}
                                            </span>
                                        </div>
                                        <div className="campaign-stat">
                                            <span className="stat-label">คลิก:</span>
                                            <span className="stat-value">{campaign.clickCount || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateNotifications;