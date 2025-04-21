// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Home from './pages/home/home';
// import BeforeLogin from './pages/beforelogin/beforelogin';
// import Login from './pages/login/login';
// import AdminHome from './admin/adminhome';
// import Register from './pages/register/register';
// import { UserAuthContextProvider } from './context/userAuthContext'; // Authorized users
// import { GuestProvider } from './context/guestAuthContext'; // Unauthorized users (guests)
// import YogaProgram from './pages/yogaprogram/yogaprogram';
// import YogaPose from './pages/yogapose/yogapose';
// import UserInformation from './pages/userinformation/userinformation';
// import UserHistoryAllProgramPlay from './pages/userhistoryallprogramplay/userhistoryallprogramplay';
// import UserHistoryAllProgramPlayDetails from './pages/userhistoryallprogramplaydetails/userhistoryallprogramplaydetails';
// import AddYogaProgram from './pages/AddYogaProgram/AddYogaProgram';
// import AddYogaPose from './pages/AddYogaPose/AddYogapose';
// import UserProgramAnalysis from './pages/userProgramAnalysis/userProgramAnalysis';
// import UserPoseAnalysis from './pages/userPoseAnalysis/userPoseAnalysis';
// import CreateNotifications from './pages/createnotifications/createnotifications';

// function App() {
//   return (
//     <UserAuthContextProvider> {/* Wrap your app with UserAuthContextProvider */}
//       <GuestProvider> {/* Wrap your app with GuestProvider for unauthorized users */}
//         <Router>
//           <Routes>
//             <Route path="/" element={<BeforeLogin />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/home" element={<Home />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/admin" element={<AdminHome />} /> {/* Adding Admin Home */}
//             <Route path="/yoga-program" element={<YogaProgram />} />
//             <Route path="/yoga-pose/:programId" element={<YogaPose />} />
//             <Route path="/userinformation" element={<UserInformation />} />
//             <Route path="/userhistoryallprogramplay" element={<UserHistoryAllProgramPlay />} />
            
//             <Route 
//           path="/userhistoryallprogramplaydetails" 
//           element={<UserHistoryAllProgramPlayDetails />} 
//         />
//         <Route path="/add-yoga-program" element={<AddYogaProgram/>}/>
//         <Route path="/add-yoga-pose/:programId" element={<AddYogaPose />} />
// <Route path="/userProgramAnalysis" element={<UserProgramAnalysis />} />
// <Route path="/userPoseAnalysis" element={<UserPoseAnalysis />} />
// <Route path="/create-notifications" element={<CreateNotifications />} />
//           </Routes>
//         </Router>
//       </GuestProvider>
//     </UserAuthContextProvider>
//   );
// }

// export default App;





// // App.jsx
// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Home from './pages/home/home';
// import BeforeLogin from './pages/beforelogin/beforelogin';
// import Login from './pages/login/login';
// import AdminHome from './admin/adminhome';
// import Register from './pages/register/register';
// import { UserAuthContextProvider } from './context/userAuthContext';
// import { GuestProvider } from './context/guestAuthContext';
// import YogaProgram from './pages/yogaprogram/yogaprogram';
// import YogaPose from './pages/yogapose/yogapose';
// import UserInformation from './pages/userinformation/userinformation';
// import UserHistoryAllProgramPlay from './pages/userhistoryallprogramplay/userhistoryallprogramplay';
// import UserHistoryAllProgramPlayDetails from './pages/userhistoryallprogramplaydetails/userhistoryallprogramplaydetails';
// import AddYogaProgram from './pages/AddYogaProgram/AddYogaProgram';
// import AddYogaPose from './pages/AddYogaPose/AddYogapose';
// import UserProgramAnalysis from './pages/userProgramAnalysis/userProgramAnalysis';
// import UserPoseAnalysis from './pages/userPoseAnalysis/userPoseAnalysis';
// import CreateNotifications from './pages/createnotifications/createnotifications';

// function App() {
//   return (
//     <UserAuthContextProvider>
//       <GuestProvider>
//         <Router>
//           <Routes>
//             <Route path="/" element={<BeforeLogin />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/home" element={<Home />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/admin" element={<AdminHome />} />
//             <Route path="/yoga-program" element={<YogaProgram />} />
//             <Route path="/yoga-pose/:programId" element={<YogaPose />} />
//             <Route path="/userinformation" element={<UserInformation />} />
//             <Route path="/userhistoryallprogramplay" element={<UserHistoryAllProgramPlay />} />
//             <Route 
//               path="/userhistoryallprogramplaydetails" 
//               element={<UserHistoryAllProgramPlayDetails />} 
//             />
//             <Route path="/add-yoga-program" element={<AddYogaProgram/>}/>
//             <Route path="/add-yoga-pose/:programId" element={<AddYogaPose />} />
//             <Route path="/userProgramAnalysis" element={<UserProgramAnalysis />} />
//             <Route path="/userPoseAnalysis" element={<UserPoseAnalysis />} />
//             <Route path="/create-notifications" element={<CreateNotifications />} />
//           </Routes>
//         </Router>
//       </GuestProvider>
//     </UserAuthContextProvider>
//   );
// }

// export default App;


// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home/home';
import BeforeLogin from './pages/beforelogin/beforelogin';
import Login from './pages/login/login';
import AdminHome from './admin/adminhome';
import Register from './pages/register/register';
import { UserAuthContextProvider } from './context/userAuthContext';
import { GuestProvider } from './context/guestAuthContext';
import YogaProgram from './pages/yogaprogram/yogaprogram';
import YogaPose from './pages/yogapose/yogapose';
import UserInformation from './pages/userinformation/userinformation';
import UserHistoryAllProgramPlay from './pages/userhistoryallprogramplay/userhistoryallprogramplay';
import UserHistoryAllProgramPlayDetails from './pages/userhistoryallprogramplaydetails/userhistoryallprogramplaydetails';
import AddYogaProgram from './pages/AddYogaProgram/AddYogaProgram';
import AddYogaPose from './pages/AddYogaPose/AddYogapose';
import UserProgramAnalysis from './pages/userProgramAnalysis/userProgramAnalysis';
import UserPoseAnalysis from './pages/userPoseAnalysis/userPoseAnalysis';
import CreateNotifications from './pages/createnotifications/createnotifications';
import ProgramHistoryManagement from './pages/programhistorymanagement/ProgramHistoryManagement';

function App() {
  return (
    <UserAuthContextProvider>
      <GuestProvider>
        <Router>
          <Routes>
            {/* <Route path="/" element={<BeforeLogin />} /> */}
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/yoga-program" element={<YogaProgram />} />
            <Route path="/yoga-pose/:programId" element={<YogaPose />} />
            <Route path="/userinformation" element={<UserInformation />} />
            <Route path="/userhistoryallprogramplay" element={<UserHistoryAllProgramPlay />} />
            <Route 
              path="/userhistoryallprogramplaydetails" 
              element={<UserHistoryAllProgramPlayDetails />} 
            />
            <Route path="/add-yoga-program" element={<AddYogaProgram/>}/>
            <Route path="/add-yoga-pose/:programId" element={<AddYogaPose />} />
            <Route path="/userProgramAnalysis" element={<UserProgramAnalysis />} />
            <Route path="/userPoseAnalysis" element={<UserPoseAnalysis />} />
            <Route path="/create-notifications" element={<CreateNotifications />} />
            <Route path="/program-history-management" element={<ProgramHistoryManagement />} />
          </Routes>
        </Router>
      </GuestProvider>
    </UserAuthContextProvider>
  );
}

export default App;