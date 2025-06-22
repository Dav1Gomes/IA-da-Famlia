import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "../../styles/admin/AdminPrincipal.css";
import "../../styles/admin/GraficosRelatorios.css";

const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

const notaColors = {
  1: "#f15b5b",
  2: "#F58220",
  3: "#FCB81B",
  4: "#652E73",
  5: "#08B9AC",
};

const GraficosRelatorios = () => {
  const navigate = useNavigate();
  const [avaliacaoData, setNotas] = useState([]);
  const [atendimentosData, setAtendimentosData] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5001/api/notas")
      .then((res) => res.json())
      .then((data) => {
        const tNotas = [1, 2, 3, 4, 5].map((n) => {
          const found = data.find((item) => item.nota === n);
          return {
            tipo: `${n} - ${["Péssimo", "Ruim", "Ok", "Bom", "Excelente"][n - 1]}`,
            quantidade: found ? found.quantidade : 0,
          };
        });
        setNotas(tNotas);
      })
      .catch((err) => {
        console.error(err);
        setSnackbarMessage("Erro ao carregar notas.");
        setOpenSnackbar(true);
      });

    fetch("http://localhost:5001/api/chats_dia")
      .then((res) => res.json())
      .then((data) => {
        const format = diasSemana.map((dia, idx) => {
          const found = data.find((d) => Number(d.dia_semana) === idx);
          return { name: dia, atendimentos: found ? found.total : 0 };
        });
        setAtendimentosData(format);
      })
      .catch((err) => {
        console.error(err);
        setSnackbarMessage("Erro ao carregar atendimentos.");
        setOpenSnackbar(true);
      });

    fetch("http://localhost:5001/api/notas/comentarios")
      .then((res) => res.json())
      .then((data) => {
        setComentarios(data);
      })
      .catch((err) => {
        console.error(err);
        setSnackbarMessage("Erro ao carregar comentários.");
        setOpenSnackbar(true);
      });
  }, []);

  return (
    <Box className="admin-page">
      <Typography variant="h4" className="admin-title" sx={{ mb: 4 }}>
        Gráficos e Relatórios
      </Typography>

      <Box className="grafico-container" sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Atendimentos por Dia
        </Typography>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={atendimentosData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="atendimentos" fill="var(--verde-agua)" />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <Box className="grafico-e-lista" sx={{ display: "flex", gap: 4 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Avaliação dos Usuários
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={avaliacaoData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tipo" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantidade">
                {avaliacaoData.map((entry, index) => {
                  const nota = Number(entry.tipo.split(" ")[0]);
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={notaColors[nota] || "#888"}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Box className="comentarios-list">
          <Typography variant="h6" sx={{ mb: 1 }}>
            Avaliação dos Usuários / Nota
          </Typography>
          {comentarios.length === 0 ? (
            <Typography>Nenhum comentário encontrado.</Typography>
          ) : (
            <List>
              {comentarios.map(({ id, comentario, nota }) => (
                <ListItem key={id} className="comentario-item">
                  <span className="comentario-text">{comentario}</span>
                  <span
                    className="nota-text"
                    style={{ color: notaColors[nota] }}
                  >
                    {nota}
                  </span>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Box>

      <footer className="admin-footer">
        <Button className="button-voltar" onClick={() => navigate("/admin")}>
          Voltar
        </Button>
        <img
          src={require("../../img/logoprefeitura2.png")}
          alt="Logo Prefeitura"
          className="footer-logo"
        />
      </footer>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
};

export default GraficosRelatorios;
