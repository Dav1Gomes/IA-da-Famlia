import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import '../../styles/admin/AdminPrincipal.css';
import '../../styles/admin/GraficosRelatorios.css';

const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

const GraficosRelatorios = () => {
  const navigate = useNavigate();
  const [avaliacaoData, setNotas] = useState([]);
  const [atendimentosData, setAtendimentosData] = useState([]);
  
  useEffect(() => {
    fetch('http://localhost:5001/api/notas') 
        .then(res => res.json())
        .then(data => {
          const tNotas = [1, 2, 3, 4, 5].map(n => {
            const found = data.find(item => item.nota === n);
            return {
              tipo: `${n} - ${['Péssimo', 'Ruim', 'Ok', 'Bom', 'Excelente'][n - 1]}`,
              quantidade: found ? found.quantidade : 0
            };
          });
          setNotas(tNotas);
        })
        .catch(err => console.error(err));


    fetch('http://localhost:5001/api/chats_dia')
        .then(res => res.json())
        .then(data => {
          const format = diasSemana.map((dia, idx) =>{
            const found = data.find(d => Number(d.dia_semana) === idx);
            return { name: dia, atendimentos: found ? found.total : 0};
          });
          setAtendimentosData(format);
        })
    }, []);

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
        <img src={require('../../img/logoprefeitura2.png')} alt="Logo Prefeitura" className="footer-logo" />
      </footer>
    </Box>
  );
};

export default GraficosRelatorios;
