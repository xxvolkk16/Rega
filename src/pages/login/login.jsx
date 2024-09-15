// import { useState } from "react";
// import { Button, TextField, Typography, Box } from '@mui/material';
// import './login.css';
// import logo from '../../picture/regalogo.png';
// import googlelogo from '../../picture/googlelogo.png';
// import { auth, provider } from '../../firebase.jsx';
// import { signInWithPopup } from "firebase/auth";
// import { useNavigate } from 'react-router-dom';

// function Login() {
//   const navigate = useNavigate();

//   const signInWithGoogle = () => {
//     signInWithPopup(auth, provider)
//       .then((result) => {
//         console.log(result.user);
//         // Store login timestamp in localStorage
//         localStorage.setItem('loginTimestamp', Date.now());
//         navigate('/home');
//       })
//       .catch((error) => {
//         console.error(error.message);
//       });
//   };

//   return (
//     <Box className="background-container">
//       <Box className="login-container" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
//         <img src={logo} alt="Logo" className="login-logo" />
//         <Box component="form" className="login-form" display="flex" flexDirection="column" gap={2}>
//           <TextField
//             label="USERNAME"
//             variant="outlined"
//             fullWidth
//             InputProps={{
//               style: { color: 'white' },
//             }}
//             InputLabelProps={{
//               style: { color: 'white' },
//             }}
//           />
//           <TextField
//             label="PASSWORD"
//             variant="outlined"
//             type="password"
//             fullWidth
//             InputProps={{
//               style: { color: 'white' },
//             }}
//             InputLabelProps={{
//               style: { color: 'white' },
//             }}
//           />
//           <Typography variant="body2" color="white" align="right">
//             <a href="#" className="forgot-password-link">Forgot password?</a>
//           </Typography>
//           <Button variant="contained" color="primary" fullWidth>
//             LOGIN
//           </Button>
//           <Typography variant="body2" color="white">
//             Don't have an account? <a href="#" className="signup-link">SIGN UP</a>
//           </Typography>
//           <Typography variant="body2" color="white" align="center">
//             OR
//           </Typography>
//           <Button
//             variant="outlined"
//             color="secondary"
//             fullWidth
//             startIcon={
//               <img src={googlelogo} alt="Google" style={{ width: '20px' }} />
//             }
//             onClick={signInWithGoogle}
//           >
//             Sign in with Google
//           </Button>
//         </Box>
//       </Box>
//     </Box>
//   );
// }

// export default Login;
















import { useState } from "react";
import { Button, TextField, Typography, Box } from '@mui/material';
import './login.css';
import logo from '../../picture/regalogo.png';
import googlelogo from '../../picture/googlelogo.png';
import { auth, provider, firestore } from '../../firebase.jsx';
import { signInWithPopup } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore"; // นำเข้า Firestore functions
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // ฟังก์ชันล็อกอินด้วย Google
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result.user);
        localStorage.setItem('loginTimestamp', Date.now()); // เก็บเวลาเข้าสู่ระบบ
        navigate('/home');
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  // ฟังก์ชันตรวจสอบอีเมลและรหัสผ่าน
  const handleLogin = async () => {
    if (!email || !password) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
  
    try {
      // Query ผู้ใช้ตามอีเมล
      const usersRef = collection(firestore, 'User');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        setError('ไม่พบผู้ใช้อีเมลนี้');
        return;
      }
  
      // ตรวจสอบรหัสผ่าน
      const userData = querySnapshot.docs[0].data();
      if (userData.password !== password) {
        setError('รหัสผ่านไม่ถูกต้อง');
        return;
      }
  
      // หากข้อมูลถูกต้อง นำไปยังหน้า Home
      console.log('ล็อกอินสำเร็จ', userData);
      localStorage.setItem('loginTimestamp', Date.now());
      navigate('/home');
    } catch (error) {
      console.error('Error logging in:', error);
      setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    }
  };
  

  return (
    <Box className="background-container">
      <Box className="login-container" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <img src={logo} alt="Logo" className="login-logo" />
        <Box component="form" className="login-form" display="flex" flexDirection="column" gap={2}>
          <TextField
            label="EMAIL"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              style: { color: 'white' },
            }}
            InputLabelProps={{
              style: { color: 'white' },
            }}
          />
          <TextField
            label="PASSWORD"
            variant="outlined"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              style: { color: 'white' },
            }}
            InputLabelProps={{
              style: { color: 'white' },
            }}
          />
          {error && <Typography variant="body2" color="error">{error}</Typography>}
          <Typography variant="body2" color="white" align="right">
            <a href="#" className="forgot-password-link">Forgot password?</a>
          </Typography>
          <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
            LOGIN
          </Button>
          <Typography variant="body2" color="white">
  Don't have an account? <a href="#" className="signup-link" onClick={() => navigate('/register')}>SIGN UP</a>
</Typography>

          <Typography variant="body2" color="white" align="center">
            OR
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            startIcon={
              <img src={googlelogo} alt="Google" style={{ width: '20px' }} />
            }
            onClick={signInWithGoogle}
          >
            Sign in with Google
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
