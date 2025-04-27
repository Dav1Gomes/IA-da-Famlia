import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import '../../styles/admin/AdminPrincipal.css';
import '../../styles/admin/GraficosRelatorios.css';

const data = [
  { name: 'Seg', atendimentos: 12 },
  { name: 'Ter', atendimentos: 19 },
  { name: 'Qua', atendimentos: 7 },
  { name: 'Qui', atendimentos: 14 },
  { name: 'Sex', atendimentos: 20 },
];

const GraficosRelatorios = () => {
  const navigate = useNavigate();

  return (
    <Box className="admin-page">
      <Typography variant="h4" className="admin-title" sx={{ mb: 4 }}>
        Gráficos e Relatórios
      </Typography>

      <Box className="grafico-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="atendimentos" fill="var(--verde-agua)" />
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
