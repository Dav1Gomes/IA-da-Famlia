import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import '../../styles/admin/AdminPrincipal.css';
import '../../styles/admin/GraficosRelatorios.css';

const atendimentosData = [
  { name: 'Seg', atendimentos: 12 },
  { name: 'Ter', atendimentos: 19 },
  { name: 'Qua', atendimentos: 7 },
  { name: 'Qui', atendimentos: 14 },
  { name: 'Sex', atendimentos: 20 },
];

const avaliacaoData = [
  { tipo: '1 - Péssimo', quantidade: 3 },
  { tipo: '2 - Ruim', quantidade: 7 },
  { tipo: '3 - Ok', quantidade: 15 },
  { tipo: '4 - Bom', quantidade: 30 },
  { tipo: '5 - Excelente', quantidade: 45 },
];

const GraficosRelatorios = () => {
  const navigate = useNavigate();

  return (
    <Box className="admin-page">
      <Typography variant="h4" className="admin-title" sx={{ mb: 4 }}>
        Gráficos e Relatórios
      </Typography>

      <Box className="grafico-container">
        <Typography variant="h6" sx={{ mb: 2 }}>Atendimentos por Dia</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={atendimentosData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="atendimentos" fill="var(--verde-agua)" />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <Box className="grafico-container">
        <Typography variant="h6" sx={{ mb: 2 }}>Avaliação dos Usuários</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={avaliacaoData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="tipo" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantidade" fill="var(--azul-claro)" />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <footer className="admin-footer">
        <Button className="button-voltar" onClick={() => navigate('/admin')}>
          Voltar
        </Button>
        <img src={require('../../img/logoprefeitura.png')} alt="Logo Prefeitura" className="footer-logo" />
      </footer>
    </Box>
  );
};

export default GraficosRelatorios;