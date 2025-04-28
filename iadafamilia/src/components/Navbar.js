import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Switch,
  IconButton,
  Button,
  Slider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";
import {getAuth} from "../util/RequireAuth.js"

const Navbar = ({ onToggleDarkMode, onFontSizeChange }) => {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const navigate = useNavigate();

  useEffect(() => {
    if (onToggleDarkMode) {
      onToggleDarkMode(darkMode);
    }
  }, [darkMode, onToggleDarkMode]);

  const toggleModal = () => setOpen(!open);
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const handleFontSizeChange = (value) => {
    setFontSize(value);
    if (onFontSizeChange) {
      onFontSizeChange(value);
    }
  };

  //Caso o usuário já esteja logado ele vai direto para a página admin
  const handleLogout = () => getAuth() ? navigate("/admin") : navigate("/login");

  return (
    <nav className="navbar">
      <h2 style={{ fontFamily: "var(--font-titles)" }}>IA da Família</h2>
      <IconButton className="settings-button" onClick={toggleModal}>
        <SettingsIcon />
      </IconButton>
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
    </nav>
  );
};

export default Navbar;
