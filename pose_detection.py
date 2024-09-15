import cv2
import mediapipe as mp
import numpy as np
import tensorflow as tf

# โหลดโมเดลที่ฝึกด้วยข้อมูลภาพ
model = tf.keras.models.load_model('Yoga_Detection1.h5')

# รายการชื่อท่าทาง อิงตามลำดับที่ใช้ในการฝึกโมเดล
pose_names = ["downdog", "goddess", "plank", "tree", "warrior 2"]

# ตั้งค่า MediaPipe สำหรับการตรวจจับท่าทาง
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

# เปิดกล้อง (เลือกกล้องด้วย index 0, 1, 2 ตามที่เหมาะสม)
cap = cv2.VideoCapture(0)

# ตรวจสอบว่ากล้องเปิดได้หรือไม่
if not cap.isOpened():
    print("Cannot open camera")
    exit()

# สร้างหน้าต่างแบบเต็มจอ
cv2.namedWindow('Yoga Pose Classification', cv2.WND_PROP_FULLSCREEN)
cv2.setWindowProperty('Yoga Pose Classification', cv2.WND_PROP_FULLSCREEN, cv2.WINDOW_FULLSCREEN)

try:
    while cap.isOpened():
        ret, frame = cap.read()
        
        if not ret:
            print("Failed to grab frame")
            break

        # แปลงภาพจาก BGR เป็น RGB (ตามที่ MediaPipe คาดหวัง)
        image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # ปรับขนาดภาพให้ตรงกับที่โมเดลคาดหวัง (300x300)
        image_resized = cv2.resize(image_rgb, (300, 300))
        
        # เพิ่มแกน batch (โมเดลคาดหวังข้อมูลที่มี shape: (1, 300, 300, 3))
        image_resized = np.expand_dims(image_resized, axis=0)

        # ใช้โมเดลคาดการณ์ท่าโยคะ
        prediction = model.predict(image_resized)
        
        # คาดการณ์ท่าโยคะที่มีความเป็นไปได้สูงสุด
        predicted_class = np.argmax(prediction)

        # ตรวจสอบว่าค่าคาดการณ์อยู่ในขอบเขตของ pose_names หรือไม่
        if predicted_class < len(pose_names):
            # ถ้าค่าคาดการณ์อยู่ในช่วงที่ถูกต้อง ให้ทำการแสดงผล
            predicted_pose_name = pose_names[predicted_class]

            # แสดงผลท่าที่โมเดลคาดการณ์
            display_text = f'Predicted Pose: {predicted_pose_name}'
            color = (0, 255, 0)  # สีเขียวสำหรับการแสดงผลทั่วไป
        else:
            # ถ้าค่าคาดการณ์ไม่ถูกต้อง ให้แสดงข้อความแจ้งเตือน
            display_text = "Unknown Pose"
            color = (0, 0, 255)  # สีแดงสำหรับข้อผิดพลาด

        # แสดงชื่อท่าโยคะบนหน้าจอ
        cv2.putText(frame, display_text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2, cv2.LINE_AA)

        # วาดจุดสำคัญด้วย MediaPipe (ถ้าต้องการ)
        result = pose.process(image_rgb)
        if result.pose_landmarks:
            mp.solutions.drawing_utils.draw_landmarks(frame, result.pose_landmarks, mp_pose.POSE_CONNECTIONS)
        
        # แสดงภาพจากกล้องแบบ fullscreen
        cv2.imshow('Yoga Pose Classification', frame)

        # หากกดปุ่ม 'q' ให้หยุดการทำงาน
        if cv2.waitKey(10) & 0xFF == ord('q'):
            break

except Exception as e:
    print(f"An error occurred: {e}")

finally:
    cap.release()
    cv2.destroyAllWindows()
