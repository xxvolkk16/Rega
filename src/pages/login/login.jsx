// // import { useState } from "react";
// // import { Button, TextField, Typography, Box } from '@mui/material';
// // import './login.css';
// // import logo from '../../picture/regalogo.png';
// // import googlelogo from '../../picture/googlelogo.png';
// // import { auth, provider } from '../../firebase.jsx';
// // import { signInWithPopup } from "firebase/auth";
// // import { useNavigate } from 'react-router-dom';

// // function Login() {
// //   const navigate = useNavigate();

// //   const signInWithGoogle = () => {
// //     signInWithPopup(auth, provider)
// //       .then((result) => {
// //         console.log(result.user);
// //         // Store login timestamp in localStorage
// //         localStorage.setItem('loginTimestamp', Date.now());
// //         navigate('/home');
// //       })
// //       .catch((error) => {
// //         console.error(error.message);
// //       });
// //   };

// //   return (
// //     <Box className="background-container">
// //       <Box className="login-container" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
// //         <img src={logo} alt="Logo" className="login-logo" />
// //         <Box component="form" className="login-form" display="flex" flexDirection="column" gap={2}>
// //           <TextField
// //             label="USERNAME"
// //             variant="outlined"
// //             fullWidth
// //             InputProps={{
// //               style: { color: 'white' },
// //             }}
// //             InputLabelProps={{
// //               style: { color: 'white' },
// //             }}
// //           />
// //           <TextField
// //             label="PASSWORD"
// //             variant="outlined"
// //             type="password"
// //             fullWidth
// //             InputProps={{
// //               style: { color: 'white' },
// //             }}
// //             InputLabelProps={{
// //               style: { color: 'white' },
// //             }}
// //           />
// //           <Typography variant="body2" color="white" align="right">
// //             <a href="#" className="forgot-password-link">Forgot password?</a>
// //           </Typography>
// //           <Button variant="contained" color="primary" fullWidth>
// //             LOGIN
// //           </Button>
// //           <Typography variant="body2" color="white">
// //             Don't have an account? <a href="#" className="signup-link">SIGN UP</a>
// //           </Typography>
// //           <Typography variant="body2" color="white" align="center">
// //             OR
// //           </Typography>
// //           <Button
// //             variant="outlined"
// //             color="secondary"
// //             fullWidth
// //             startIcon={
// //               <img src={googlelogo} alt="Google" style={{ width: '20px' }} />
// //             }
// //             onClick={signInWithGoogle}
// //           >
// //             Sign in with Google
// //           </Button>
// //         </Box>
// //       </Box>
// //     </Box>
// //   );
// // }

// // export default Login;
















// import { useState } from "react";
// import { Button, TextField, Typography, Box } from '@mui/material';
// import './login.css';
// import logo from '../../picture/regalogo.png';
// import googlelogo from '../../picture/googlelogo.png';
// import { auth, provider, firestore } from '../../firebase.jsx';
// import { signInWithPopup } from "firebase/auth";
// import { collection, query, where, getDocs } from "firebase/firestore"; // นำเข้า Firestore functions
// import { useNavigate } from 'react-router-dom';

// function Login() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   // ฟังก์ชันล็อกอินด้วย Google
//   const signInWithGoogle = () => {
//     signInWithPopup(auth, provider)
//       .then((result) => {
//         console.log(result.user);
//         localStorage.setItem('loginTimestamp', Date.now()); // เก็บเวลาเข้าสู่ระบบ
//         navigate('/home');
//       })
//       .catch((error) => {
//         console.error(error.message);
//       });
//   };

//   // ฟังก์ชันตรวจสอบอีเมลและรหัสผ่าน
//   const handleLogin = async () => {
//     if (!email || !password) {
//       setError('กรุณากรอกข้อมูลให้ครบถ้วน');
//       return;
//     }
  
//     try {
//       // Query ผู้ใช้ตามอีเมล
//       const usersRef = collection(firestore, 'users');
//       const q = query(usersRef, where('email', '==', email));
//       const querySnapshot = await getDocs(q);
  
//       if (querySnapshot.empty) {
//         setError('ไม่พบผู้ใช้อีเมลนี้');
//         return;
//       }
  
//       // ตรวจสอบรหัสผ่าน
//       const userData = querySnapshot.docs[0].data();
//       if (userData.password !== password) {
//         setError('รหัสผ่านไม่ถูกต้อง');
//         return;
//       }
  
//       // หากข้อมูลถูกต้อง บันทึก username และไปยังหน้า Home
//       console.log('ล็อกอินสำเร็จ', userData);
//       localStorage.setItem('userEmail', userData.email); // เก็บอีเมลผู้ใช้
//       localStorage.setItem('username', userData.username); // เก็บ username ผู้ใช้
//       localStorage.setItem('loginTimestamp', Date.now());
//       navigate('/home');
//     } catch (error) {
//       console.error('Error logging in:', error);
//       setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
//     }
//   };
  
  

//   return (
//     <Box className="background-container">
//       <Box className="login-container" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
//         <img src={logo} alt="Logo" className="login-logo" />
//         <Box component="form" className="login-form" display="flex" flexDirection="column" gap={2}>
//           <TextField
//             label="EMAIL"
//             variant="outlined"
//             fullWidth
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
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
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             InputProps={{
//               style: { color: 'white' },
//             }}
//             InputLabelProps={{
//               style: { color: 'white' },
//             }}
//           />
//           {error && <Typography variant="body2" color="error">{error}</Typography>}
//           <Typography variant="body2" color="white" align="right">
//             <a href="#" className="forgot-password-link">Forgot password?</a>
//           </Typography>
//           <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
//             LOGIN
//           </Button>
//           <Typography variant="body2" color="white">
//   Don't have an account? <a href="#" className="signup-link" onClick={() => navigate('/register')}>SIGN UP</a>
// </Typography>

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



// import { useState } from "react";
// import { Button, TextField, Typography, Box } from '@mui/material';
// import './login.css';
// import logo from '../../picture/regalogo.png';
// import googlelogo from '../../picture/googlelogo.png';
// import { auth, provider, firestore } from '../../firebase.jsx'; // Include firestore to fetch user data
// import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
// import { useNavigate } from 'react-router-dom';
// import { doc, getDoc } from 'firebase/firestore';

// function Login() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   // Google Sign-In function
//   const signInWithGoogle = () => {
//     signInWithPopup(auth, provider)
//       .then((result) => {
//         console.log('Google Sign-In Successful:', result.user);
//         localStorage.setItem('loginTimestamp', Date.now());
//         navigate('/home'); // Navigate to home page
//       })
//       .catch((error) => {
//         console.error('Google Sign-In Error:', error.message);
//         setError('Google Sign-In Failed');
//       });
//   };

//   // Handle login with email and password using Firebase Authentication
//   const handleLogin = async () => {
//     if (!email || !password) {
//       setError('กรุณากรอกข้อมูลให้ครบถ้วน');
//       return;
//     }

//     try {
//       // Use Firebase Authentication to log in
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;

//       // Fetch user data from Firestore
//       const userDocRef = doc(firestore, 'users', user.uid);
//       const userDoc = await getDoc(userDocRef);

//       if (userDoc.exists()) {
//         const userData = userDoc.data();
//         if (userData.Role === 'Admin') {
//           console.log('Login Successful:', userData);
//           localStorage.setItem('userEmail', userData.email);
//           localStorage.setItem('username', userData.username);
//           localStorage.setItem('loginTimestamp', Date.now());
//           navigate('/home');
//         } else {
//           setError('ไม่ใช่ admin อย่ามายุุ่ง');
//         }
//       } else {
//         setError('ไม่พบข้อมูลผู้ใช้ในระบบ');
//       }
//     } catch (error) {
//       console.error('Error logging in:', error);
//       setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ หรือข้อมูลผู้ใช้ไม่ถูกต้อง');
//     }
//   };

//   return (
//     <Box className="background-container">
//       <Box className="login-container" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
//         <img src={logo} alt="Logo" className="login-logo" />
//         <Box component="form" className="login-form" display="flex" flexDirection="column" gap={2}>
//           <TextField
//             label="EMAIL"
//             variant="outlined"
//             fullWidth
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
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
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             InputProps={{
//               style: { color: 'white' },
//             }}
//             InputLabelProps={{
//               style: { color: 'white' },
//             }}
//           />
//           {error && <Typography variant="body2" color="error">{error}</Typography>}
//           <Typography variant="body2" color="white" align="right">
//             <a href="#" className="forgot-password-link">Forgot password?</a>
//           </Typography>
//           <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
//             LOGIN
//           </Button>
//           <Typography variant="body2" color="white">
//             Don't have an account? <a href="#" className="signup-link" onClick={() => navigate('/register')}>SIGN UP</a>
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




































// import { useState, useEffect } from "react";
// import { Button, TextField, Typography, Box } from '@mui/material';
// import './login.css';
// import logo from '../../picture/regalogo.png';
// import googlelogo from '../../picture/googlelogo.png';
// import { 
//   auth, 
//   provider, 
//   firestore 
// } from '../../firebase.jsx';
// import { 
//   signInWithPopup, 
//   signInWithEmailAndPassword, 
//   getAuth, 
//   OAuthProvider,
//   GoogleAuthProvider 
// } from "firebase/auth";
// import { useNavigate } from 'react-router-dom';
// import { doc, getDoc, updateDoc } from 'firebase/firestore';
// import { getMessaging, getToken } from 'firebase/messaging';

// function Login() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const initializeFCM = async (userId) => {
//     try {
//       const messaging = getMessaging();
//       const permission = await Notification.requestPermission();
      
//       if (permission === 'granted') {
//         const token = await getToken(messaging, {
//           vapidKey: 'BAGiUjDx7UbMRNgiQLAuZWwpa_rkqOE16MsmHQt4qK5rgFDtmuYdHQt97uPz2x6RWa1ae91vtq68Fgs3AsB3FIw'
//         });
        
//         if (token) {
//           // บันทึก token ลง Firestore
//           const userDocRef = doc(firestore, 'users', userId);
//           await updateDoc(userDocRef, {
//             fcmToken: token,
//             lastTokenUpdate: new Date()
//           });
//           return token;
//         }
//       }
//       throw new Error('ไม่ได้รับอนุญาตให้ส่งการแจ้งเตือน');
//     } catch (error) {
//       console.error('FCM Error:', error);
//       throw error;
//     }
//   };

//   // Function to handle OAuth2 token storage
//   const storeOAuthToken = async (userId, token) => {
//     try {
//       const userDocRef = doc(firestore, 'users', userId);
//       await updateDoc(userDocRef, {
//         oauthToken: token,
//         tokenTimestamp: new Date().toISOString()
//       });
//       console.log('OAuth token stored successfully');
//     } catch (error) {
//       console.error('Error storing OAuth token:', error);
//     }
//   };

//   // Enhanced Google Sign-In with OAuth2
//   const signInWithGoogle = async () => {
//     setLoading(true);
//     try {
//       const googleProvider = new GoogleAuthProvider();
//       // Add OAuth2 scopes as needed
//       googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');
//       googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');

//       const result = await signInWithPopup(auth, googleProvider);
//       const credential = GoogleAuthProvider.credentialFromResult(result);
//       const token = credential.accessToken;

//       // Store OAuth token
//       await storeOAuthToken(result.user.uid, token);
      
//       // Initialize FCM
//       await initializeFCM(result.user.uid);

//       // Store user session data
//       localStorage.setItem('loginTimestamp', Date.now());
//       localStorage.setItem('userEmail', result.user.email);
//       localStorage.setItem('username', result.user.displayName);
      
//       navigate('/home');
//     } catch (error) {
//       console.error('Google Sign-In Error:', error);
//       setError('Google Sign-In Failed: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Enhanced Email/Password Login
//   const handleLogin = async () => {
//     if (!email || !password) {
//       setError('กรุณากรอกข้อมูลให้ครบถ้วน');
//       return;
//     }

//     setLoading(true);
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;

//       // Get ID token for OAuth2
//       const idToken = await user.getIdToken();
//       await storeOAuthToken(user.uid, idToken);

//       // Initialize FCM
//       await initializeFCM(user.uid);

//       // Check user role in Firestore
//       const userDocRef = doc(firestore, 'users', user.uid);
//       const userDoc = await getDoc(userDocRef);

//       if (userDoc.exists()) {
//         const userData = userDoc.data();
//         if (userData.Role === 'Admin') {
//           // Store user session data
//           localStorage.setItem('userEmail', userData.email);
//           localStorage.setItem('username', userData.username);
//           localStorage.setItem('loginTimestamp', Date.now());
//           navigate('/home');
//         } else {
//           setError('ไม่ใช่ admin อย่ามายุ่ง');
//         }
//       } else {
//         setError('ไม่พบข้อมูลผู้ใช้ในระบบ');
//       }
//     } catch (error) {
//       console.error('Login Error:', error);
//       setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ หรือข้อมูลผู้ใช้ไม่ถูกต้อง');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Optional: Token refresh logic
//   useEffect(() => {
//     const refreshTokens = async () => {
//       if (auth.currentUser) {
//         try {
//           const newToken = await auth.currentUser.getIdToken(true);
//           await storeOAuthToken(auth.currentUser.uid, newToken);
//         } catch (error) {
//           console.error('Token refresh error:', error);
//         }
//       }
//     };

//     // Refresh tokens every hour
//     const intervalId = setInterval(refreshTokens, 3600000);
//     return () => clearInterval(intervalId);
//   }, []);

//   return (
//     <Box className="background-container">
//       <Box className="login-container" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
//         <img src={logo} alt="Logo" className="login-logo" />
//         <Box component="form" className="login-form" display="flex" flexDirection="column" gap={2}>
//           <TextField
//             label="EMAIL"
//             variant="outlined"
//             fullWidth
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             InputProps={{
//               style: { color: 'white' },
//             }}
//             InputLabelProps={{
//               style: { color: 'white' },
//             }}
//             disabled={loading}
//           />
//           <TextField
//             label="PASSWORD"
//             variant="outlined"
//             type="password"
//             fullWidth
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             InputProps={{
//               style: { color: 'white' },
//             }}
//             InputLabelProps={{
//               style: { color: 'white' },
//             }}
//             disabled={loading}
//           />
//           {error && <Typography variant="body2" color="error">{error}</Typography>}
//           <Typography variant="body2" color="white" align="right">
//             <a href="#" className="forgot-password-link">Forgot password?</a>
//           </Typography>
//           <Button 
//             variant="contained" 
//             color="primary" 
//             fullWidth 
//             onClick={handleLogin}
//             disabled={loading}
//           >
//             {loading ? 'LOGGING IN...' : 'LOGIN'}
//           </Button>
//           <Typography variant="body2" color="white">
//             Don't have an account? <a href="#" className="signup-link" onClick={() => navigate('/register')}>SIGN UP</a>
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
//             disabled={loading}
//           >
//             {loading ? 'SIGNING IN...' : 'Sign in with Google'}
//           </Button>
//         </Box>
//       </Box>
//     </Box>
//   );
// }

// export default Login;


import { useState, useEffect } from "react";
import { Button, TextField, Typography, Box, CircularProgress, Paper } from '@mui/material';
import './login.css';
import logo from '../../picture/regalogo.png';
import { 
  auth, 
  firestore 
} from '../../firebase.jsx';
import { 
  signInWithEmailAndPassword
} from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Token storage function
  const storeOAuthToken = async (userId, token) => {
    try {
      const userDocRef = doc(firestore, 'users', userId);
      await updateDoc(userDocRef, {
        oauthToken: token,
        tokenTimestamp: new Date().toISOString()
      });
      console.log('OAuth token stored successfully');
    } catch (error) {
      console.error('Error storing OAuth token:', error);
    }
  };

  // Email/Password Login
  const handleLogin = async () => {
    if (!email || !password) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get ID token for OAuth2
      const idToken = await user.getIdToken();
      await storeOAuthToken(user.uid, idToken);

      // Check user role in Firestore
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.Role === 'Admin') {
          // Store user session data
          localStorage.setItem('userEmail', userData.email);
          localStorage.setItem('username', userData.username);
          localStorage.setItem('loginTimestamp', Date.now());
          navigate('/home');
        } else {
          setError('ไม่ใช่ admin อย่ามายุ่ง');
        }
      } else {
        setError('ไม่พบข้อมูลผู้ใช้ในระบบ');
      }
    } catch (error) {
      console.error('Login Error:', error);
      setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ หรือข้อมูลผู้ใช้ไม่ถูกต้อง');
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  // Token refresh logic
  useEffect(() => {
    const refreshTokens = async () => {
      if (auth.currentUser) {
        try {
          const newToken = await auth.currentUser.getIdToken(true);
          await storeOAuthToken(auth.currentUser.uid, newToken);
        } catch (error) {
          console.error('Token refresh error:', error);
        }
      }
    };

    // Refresh tokens every hour
    const intervalId = setInterval(refreshTokens, 3600000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Box className="login-page" 
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a2a6c 0%, #b21f1f 50%, #fdbb2d 100%)',
        backgroundSize: 'cover',
        overflow: 'hidden'
      }}
    >
      <Paper 
        elevation={10} 
        sx={{
          borderRadius: '20px',
          padding: '40px',
          width: '90%',
          maxWidth: '400px',
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.37)'
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" gap={4}>
          <img 
            src={logo} 
            alt="Logo" 
            style={{ 
              width: '150px', 
              marginBottom: '20px',
              filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))'
            }} 
          />
          
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              color: 'white', 
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '10px',
              textShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)'
            }}
          >
            Admin Login
          </Typography>
          
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{
              marginBottom: '20px',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  borderRadius: '10px',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#fdbb2d',
                },
              },
            }}
            InputProps={{
              style: { color: 'white' },
            }}
            InputLabelProps={{
              style: { color: 'rgba(255, 255, 255, 0.7)' },
            }}
            disabled={loading}
          />
          
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{
              marginBottom: '30px',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  borderRadius: '10px',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#fdbb2d',
                },
              },
            }}
            InputProps={{
              style: { color: 'white' },
            }}
            InputLabelProps={{
              style: { color: 'rgba(255, 255, 255, 0.7)' },
            }}
            disabled={loading}
          />
          
          {error && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#ff6b6b', 
                marginBottom: '20px',
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                padding: '10px',
                borderRadius: '8px',
                width: '100%',
                textAlign: 'center'
              }}
            >
              {error}
            </Typography>
          )}
          
          <Button 
            variant="contained" 
            fullWidth 
            onClick={handleLogin}
            disabled={loading}
            sx={{
              padding: '12px',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 'bold',
              textTransform: 'none',
              background: 'linear-gradient(90deg, #fdbb2d 0%, #b21f1f 100%)',
              '&:hover': {
                background: 'linear-gradient(90deg, #fdbb2d 0%, #b21f1f 80%)',
                boxShadow: '0 8px 15px rgba(0, 0, 0, 0.3)',
                transform: 'translateY(-2px)',
                transition: 'all 0.3s ease'
              },
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Login'
            )}
          </Button>
          
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.5)', 
              marginTop: '20px',
              textAlign: 'center'
            }}
          >
            © {new Date().getFullYear()} REGA | Admin Portal
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default Login;