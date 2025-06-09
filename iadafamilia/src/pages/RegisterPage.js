import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box } from '@mui/material';
import { AccountCircle, Lock, Person } from '@mui/icons-material';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!name || !email || !password) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5001/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            if (response.ok) {
                navigate('/login');
            } else {
                const data = await response.json();
                alert(data.message || 'Erro ao registrar usuário.');
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Não foi possível registrar. Tente novamente mais tarde.');
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
            sx={{ backgroundColor: 'var(--white)' }}
        >
            <Typography variant="h4" mb={2} sx={{ color: 'var(--roxo)' }}>
                Cadastro
            </Typography>
            <form onSubmit={handleRegister} style={{ width: '300px' }}>
                <TextField
                    label="Nome"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    InputProps={{ startAdornment: <Person /> }}
                    sx={{ marginBottom: '15px' }}
                />
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
                    sx={{
                        backgroundColor: 'var(--roxo)',
                        color: 'var(--white)',
                        marginBottom: '10px',
                        '&:hover': {
                            backgroundColor: 'var(--roxo)',
                            opacity: 0.9,
                        },
                    }}
                >
                    Registrar
                </Button>
            </form>
            <Button
                onClick={() => navigate('/login')}
                sx={{
                    color: 'var(--roxo)',
                    textTransform: 'none',
                    '&:hover': {
                        textDecoration: 'underline',
                    },
                }}
            >
                Já tem uma conta? Entre
            </Button>
        </Box>
    );
};

export default RegisterPage;
