import { useState } from "react";
import { Button, TextField, Typography, Box } from '@mui/material';
import './login.css'; // เชื่อมกับ CSS สำหรับการจัดสไตล์เพิ่มเติม
import logo from '../../picture/regalogo.png';
import googlelogo from '../../picture/googlelogo.png';
import { auth, provider } from '../../firebase.jsx'; // นำเข้า Firebase config
import { signInWithPopup } from "firebase/auth";  // นำเข้า signInWithPopup จาก firebase/auth โดยตรง
import { useNavigate } from 'react-router-dom';  // นำเข้า useNavigate จาก react-router-dom

function Login() {
  const navigate = useNavigate();  // เรียกใช้ useNavigate

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)  // เรียกใช้ signInWithPopup
      .then((result) => {
        console.log(result.user);  // แสดงข้อมูลผู้ใช้ที่ล็อกอินสำเร็จ
        navigate('/home');  // เปลี่ยนเส้นทางไปที่หน้า home หลังล็อกอินสำเร็จ
      })
      .catch((error) => {
        console.error(error.message);  // แสดงข้อผิดพลาดถ้ามี
      });
  };

  return (
    <Box className="background-container">
      <Box className="login-container" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        {/* โลโก้ */}
        <img src={logo} alt="Logo" className="login-logo" />

        {/* ฟอร์ม */}
        <Box component="form" className="login-form" display="flex" flexDirection="column" gap={2}>
          {/* Username */}
          <TextField
            label="USERNAME"
            variant="outlined"
            fullWidth
            InputProps={{
              style: { color: 'white' },
            }}
            InputLabelProps={{
              style: { color: 'white' },
            }}
          />

          {/* Password */}
          <TextField
            label="PASSWORD"
            variant="outlined"
            type="password"
            fullWidth
            InputProps={{
              style: { color: 'white' },
            }}
            InputLabelProps={{
              style: { color: 'white' },
            }}
          />

          {/* ลิงก์ลืมรหัสผ่าน */}
          <Typography variant="body2" color="white" align="right">
            <a href="#" className="forgot-password-link">Forgot password?</a>
          </Typography>

          {/* ปุ่ม Login */}
          <Button variant="contained" color="primary" fullWidth>
            LOGIN
          </Button>

          {/* สมัครสมาชิก */}
          <Typography variant="body2" color="white">
            Don't have an account? <a href="#" className="signup-link">SIGN UP</a>
          </Typography>

          {/* หรือ */}
          <Typography variant="body2" color="white" align="center">
            OR
          </Typography>

          {/* ปุ่ม Sign in with Google */}
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            startIcon={
              <img
                src={googlelogo}
                alt="Google"
                style={{ width: '20px' }}
              />
            }
            onClick={signInWithGoogle} // เพิ่มการเรียกฟังก์ชัน signInWithGoogle
          >
            Sign in with Google
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
