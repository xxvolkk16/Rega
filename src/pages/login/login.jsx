import { useState } from "react";
import { Button, TextField, Typography, Box } from '@mui/material';
import './login.css'; // เชื่อมกับ CSS สำหรับการจัดสไตล์เพิ่มเติม
import logo from '../../picture/regalogo.png';

function Login() {
  const [count, setCount] = useState(0);

  return (
    <Box className="loginbackground">
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
          <Button variant="outlined" color="secondary" fullWidth startIcon={<img src="google-logo.png" alt="Google" style={{ width: '20px' }} />}>
            Sign in with Google
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
