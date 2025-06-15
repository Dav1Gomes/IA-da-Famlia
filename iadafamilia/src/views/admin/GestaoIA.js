import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../../styles/admin/AdminPrincipal.css";
import "../../styles/admin/GestaoIA.css";

const GestaoIA = () => {
  const navigate = useNavigate();
  const [faq, setFaq] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5001/api/faq')
      .then(res => res.json())
      .then(data => {
        setFaq(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao carregar FAQs:", error);
        setLoading(false);
      });
  }, []);

  const [novaPergunta, setNovaPergunta] = useState("");
  const [novaResposta, setNovaResposta] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState(null);

  const adicionarFaq = () => {
    if (!novaPergunta.trim() || !novaResposta.trim()) {
      setSnackbarMessage("Preencha a pergunta e a resposta!");
      setOpenSnackbar(true);
      return;
    }
    
    fetch('http://localhost:5001/api/faq', {
      method: 'POST', headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ pergunta: novaPergunta, resposta: novaResposta })
    });

    setFaq([...faq, { pergunta: novaPergunta, resposta: novaResposta }]);
    setNovaPergunta("");
    setNovaResposta("");
    setSnackbarMessage("Pergunta adicionada com sucesso!");
    setOpenSnackbar(true);
  };

  const pedirExclusao = (index) => {
    setFaqToDelete(index);
    setDialogOpen(true);
  };

  const confirmarExclusao = () => {
    if (faqToDelete !== null) {
      const faqId = faq[faqToDelete].id;
      fetch(`http://localhost:5001/api/faq/${faqId}`, { method: 'DELETE' })
        .then((resp) =>{
          if(!resp.ok) throw new Error('Erro na resposta do servidor');

          const novaLista = [...faq];
          novaLista.splice(faqToDelete, 1);
          setFaq(novaLista);
          setSnackbarMessage("Pergunta excluída com sucesso!");
          setOpenSnackbar(true);
          setDialogOpen(false);
          setFaqToDelete(null);
        })
        .catch(()=>{
          setSnackbarMessage("Erro ao excluir pergunta!");
          setOpenSnackbar(true);
          setDialogOpen(false);
          setFaqToDelete(null);
        });
    }
  };

  const cancelarExclusao = () => {
    setDialogOpen(false);
    setFaqToDelete(null);
  };

  return (
    <Box className="admin-page">
      <Typography variant="h4" className="admin-title">
        Gestão da IA
      </Typography>

      <Box className="faq-form">
        <Typography variant="h6" sx={{ mb: 2 }}>
          Nova Pergunta
        </Typography>
        <TextField
          label="Nova Pergunta"
          value={novaPergunta}
          onChange={(e) => setNovaPergunta(e.target.value)}
          fullWidth
          sx={{ mb: 4, maxWidth: "600px" }}
        />

        <Typography variant="h6" sx={{ mb: 2 }}>
          Resposta
        </Typography>
        <TextField
          label="Resposta"
          value={novaResposta}
          onChange={(e) => setNovaResposta(e.target.value)}
          fullWidth
          sx={{ mb: 4, maxWidth: "600px" }}
        />

        <Button
          variant="contained"
          sx={{ backgroundColor: "var(--verde-agua)" }}
          onClick={adicionarFaq}
        >
          Adicionar
        </Button>
      </Box>

      <List className="faq-list">
        {faq.map((item, idx) => (
          <ListItem
            key={idx}
            className="faq-item"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <ListItemText primary={item.pergunta} secondary={item.resposta} />
            <Button
              variant="contained"
              className="delete-button"
              onClick={() => pedirExclusao(idx)}
            >
              Excluir
            </Button>
          </ListItem>
        ))}
      </List>

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

      <Dialog open={dialogOpen} onClose={cancelarExclusao}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza que deseja excluir esta pergunta?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelarExclusao}>Cancelar</Button>
          <Button onClick={confirmarExclusao} sx={{ color: "var(--vermelho)" }}>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GestaoIA;
