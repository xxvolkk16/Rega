import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home/home';
import BeforeLogin from './pages/beforelogin/beforelogin';
import Login from './pages/login/login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BeforeLogin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
