import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box } from '@mui/material';
import { AccountCircle, Lock } from '@mui/icons-material';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
    
        if (email === 'admin' && password === 'admin') {
            sessionStorage.setItem('authToken', 'true');
            navigate('/admin');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
    
            if (response.ok) {
                sessionStorage.setItem('authToken', 'true');
                navigate('/home');
            } else {
                const data = await response.json();
                alert(data.message || 'Erro ao fazer login.');
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
            sx={{ backgroundColor: '#FFFFFF' }}
        >
            <Typography variant="h4" mb={2} sx={{ color: '#5C2D53' }}>
                Login
            </Typography>
            <form onSubmit={handleLogin} style={{ width: '300px' }}>
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputProps={{ startAdornment: <AccountCircle /> }}
                    sx={{ marginBottom: '15px' }}
                />
                <TextField
                    label="Senha"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{ startAdornment: <Lock /> }}
                    sx={{ marginBottom: '15px' }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ backgroundColor: '#5C2D53', color: '#FFFFFF', marginBottom: '10px' }}
                >
                    Entrar
                </Button>
            </form>
        </Box>
    );
};

export default LoginPage;
