import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Switch,
  IconButton,
  Button,
  Slider,
  TextareaAutosize,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";
import { getAuth } from "../util/RequireAuth.js";

const Navbar = ({ onToggleDarkMode, onFontSizeChange }) => {
  const [open, setOpen] = useState(false);
  const [openFeedback, setOpenFeedback] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [nota, setNota] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (onToggleDarkMode) {
      onToggleDarkMode(darkMode);
    }
  }, [darkMode, onToggleDarkMode]);

  const toggleModal = () => setOpen(!open);
  const toggleFeedbackModal = () => setOpenFeedback(!openFeedback);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleFontSizeChange = (value) => {
    setFontSize(value);
    if (onFontSizeChange) {
      onFontSizeChange(value);
    }
  };

  const handleLogout = () =>
    getAuth() ? navigate("/admin") : navigate("/login");

  const handleEnviarFeedback = () => {
    console.log("Nota:", nota);
    console.log("Mensagem:", mensagem);
    
    fetch('http://localhost:5001/api/notas', {
      method: 'POST', headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ nota: nota, comentario: mensagem })
    });

    setOpenFeedback(false);
    setNota(null);
    setMensagem("");
  };

  return (
    <nav className="navbar">
      <h2 style={{ fontFamily: "var(--font-titles)" }}>IA da Família</h2>
      <IconButton className="settings-button" onClick={toggleModal}>
        <SettingsIcon />
      </IconButton>

      {/* Modal de Configurações */}
      <Modal open={open} onClose={toggleModal}>
        <Box className="modal-box">
          <div className="modal-header">
            <Typography variant="h6" style={{ fontFamily: "var(--font-body)" }}>
              Configurações
            </Typography>
            <IconButton className="close-button" onClick={toggleModal}>
              <CloseIcon />
            </IconButton>
          </div>
          <div className="config-item">
            <Typography style={{ fontFamily: "var(--font-body)" }}>
              Modo Escuro
            </Typography>
            <Switch checked={darkMode} onChange={toggleDarkMode} />
          </div>
          <div className="config-item">
            <Typography style={{ fontFamily: "var(--font-body)" }}>
              Ajustar Fonte
            </Typography>
            <Slider
              value={fontSize}
              min={11}
              max={28}
              step={1}
              onChange={(e, value) => handleFontSizeChange(value)}
            />
          </div>
          {/* Botão de Avaliação */}
          <Button
  onClick={toggleFeedbackModal}
  style={{
    backgroundColor: darkMode ? "#2783FF" : "#fdb91a",
    color: darkMode ? "white" : "black",
    padding: "6px 16px",
    borderRadius: "8px",
    fontFamily: "var(--font-small)",
    fontWeight: "bold",
    fontSize: "14px",
    cursor: "pointer",
    marginBottom: "10px",
    border: "none",
    transition: "background-color 0.3s",
  }}
  onMouseEnter={(e) =>
    (e.target.style.backgroundColor = darkMode ? "#1d65cc" : "#e5a900")
  }
  onMouseLeave={(e) =>
    (e.target.style.backgroundColor = darkMode ? "#2783FF" : "#fdb91a")
  }
>
  Avaliar Aplicativo
</Button>

          <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
            style={{
              fontFamily: "var(--font-small)",
            }}
          >
            Login Admin
          </Button>
        </Box>
      </Modal>

      {/* Modal de Avaliação */}
      <Modal open={openFeedback} onClose={toggleFeedbackModal}>
      <Box
        sx={{
          backgroundColor: darkMode ? "#1e1e1e" : "var(--white)",
          color: darkMode ? "var(--white)" : "var(--black)",
          padding: "30px",
          maxWidth: "500px",
          margin: "100px auto",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
          <div className="modal-header" style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" style={{ fontFamily: "var(--font-body)" }}>
              Avalie o Aplicativo
            </Typography>
            <IconButton onClick={toggleFeedbackModal}>
              <CloseIcon />
            </IconButton>
          </div>

          <Typography style={{ fontFamily: "var(--font-body)" }}>
            Escolha uma nota:
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Button
                key={n}
                variant={nota === n ? "contained" : "outlined"}
                color="primary"
                onClick={() => setNota(n)}
                sx={{ minWidth: "40px", padding: "6px 0" }}
              >
                {n}
              </Button>
            ))}
          </Box>

          <Typography style={{ fontFamily: "var(--font-body)" }}>
            Mensagem:
          </Typography>
          <TextareaAutosize
            minRows={4}
            placeholder="Deixe aqui sua sugestão ou opinião!"
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: `1px solid ${darkMode ? "#555" : "var(--cinza)"}`,
              backgroundColor: darkMode ? "#2a2a2a" : "var(--white)",
              color: darkMode ? "var(--white)" : "var(--black)",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              resize: "vertical",
            }}            
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleEnviarFeedback}
            sx={{
              alignSelf: "flex-end",
              fontFamily: "var(--font-small)",
            }}
          >
            Enviar
          </Button>
        </Box>
      </Modal>
    </nav>
  );
};

export default Navbar;