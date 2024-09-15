import { useState } from 'react';
import { auth, firestore } from '../../firebase'; // นำเข้าจากไฟล์ firebase.jsx
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  
  const handleRegister = async (e) => {
  e.preventDefault();
  
  // ตรวจสอบว่าข้อมูลถูกกรอกครบถ้วนหรือไม่
  if (!email || !password || !username || !age) {
    alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    return;
  }
  
  try {
    // สร้างผู้ใช้ใน Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // บันทึกข้อมูลผู้ใช้ลงใน Firestore
    await setDoc(doc(firestore, 'User', user.uid), {
      username: username,
      email: email,
      age: age,
      date_joined: new Date(),
      role: 'user'
    });

    alert("ลงทะเบียนสำเร็จ!");
  } catch (error) {
    console.error("Error registering user:", error);
    alert(error.message);
  }
};


  return (
    <form onSubmit={handleRegister}>
      <h1>Register</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
