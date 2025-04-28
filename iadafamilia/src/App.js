import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPrincipal from './views/admin/AdminPrincipal';
import GestaoIA from './views/admin/GestaoIA';
import GraficosRelatorios from './views/admin/GraficosRelatorios';
import LancarConteudo from './views/admin/LancamentoConteudo';
import './App.css';
import RequiredAuth from './util/RequireAuth.js';

function App() {
    const [darkMode, setDarkMode] = useState(false);
    const [fontSize, setFontSize] = useState(16);

    const toggleDarkMode = (isDark) => {
        setDarkMode(isDark);
        document.body.classList.toggle('dark-mode', isDark);
    };

    const handleFontSizeChange = (size) => {
        setFontSize(size);
    };

    return (
        <Router>
            <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
                <Routes>
                    <Route path="/" element={<Navigate to="/home" />} />
                    <Route
                        path="/dashboard"
                        element={<DashboardPage />}
                    />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route
                        path="/home"
                        element={
                            <HomePage
                                onToggleDarkMode={toggleDarkMode}
                                onFontSizeChange={handleFontSizeChange}
                                fontSize={fontSize}
                            />
                        }
                    />
                    <Route path="/admin" element={
                        <RequiredAuth redirectTo="/login">
                            <AdminPrincipal />
                        </RequiredAuth>} 
                    />
                    <Route path="/admin/gestao-ia" element={
                        <RequiredAuth redirectTo="/login">
                            <GestaoIA />
                        </RequiredAuth>} 
                    />
                    <Route path="/admin/graficos" element={
                        <RequiredAuth redirectTo="/login">
                            <GraficosRelatorios />
                        </RequiredAuth>} 
                    />
                    <Route path="/admin/lancar-conteudo" element={
                        <RequiredAuth redirectTo="/login">
                            <LancarConteudo />
                        </RequiredAuth>} 
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
