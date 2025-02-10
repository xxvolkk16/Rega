import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@mui/material'; 
import './register.css'; // Reuse the same CSS for styling
import logo from '../../picture/regalogo.png';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your registration logic here
    };

    return (
        <div className="background-container">
            
            <Container maxWidth="sm">
                <Box className="login-container">
                <img src={logo} alt="Logo" className="login-logo" />
                    <Typography variant="h5" component="h1" gutterBottom style={{ color: '#fff' }}>
                        Register
                    </Typography>
                    <form onSubmit={handleSubmit} className="login-form">
                        <TextField
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                            InputLabelProps={{ style: { color: '#fff' } }}  // Adjust label color
                            InputProps={{ style: { color: '#fff' } }}      // Adjust input text color
                        />
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                            InputLabelProps={{ style: { color: '#fff' } }}  // Adjust label color
                            InputProps={{ style: { color: '#fff' } }}      // Adjust input text color
                        />
                        <TextField
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                            InputLabelProps={{ style: { color: '#fff' } }}  // Adjust label color
                            InputProps={{ style: { color: '#fff' } }}      // Adjust input text color
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            className="MuiButton-root"
                        >
                            Register
                        </Button>
                    </form>
                    <Typography variant="body2" className="signup-link" style={{ color: '#fff' }}>
                        Already have an account? <Link to="/login" style={{ color: '#fff' }}>Login here</Link>
                    </Typography>
                </Box>
            </Container>
        </div>
    );
};

export default Register;
