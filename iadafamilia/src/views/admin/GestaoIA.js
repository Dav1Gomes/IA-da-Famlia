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
    fetch("http://localhost:5001/api/faq")
      .then((res) => res.json())
      .then((data) => {
        setFaq(data);
        setLoading(false);
      })
      .catch((error) => {
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

  const [editIndex, setEditIndex] = useState(null);
  const [editPergunta, setEditPergunta] = useState("");
  const [editResposta, setEditResposta] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const adicionarFaq = () => {
    if (!novaPergunta.trim() || !novaResposta.trim()) {
      setSnackbarMessage("Preencha a pergunta e a resposta!");
      setOpenSnackbar(true);
      return;
    }

    fetch("http://localhost:5001/api/faq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pergunta: novaPergunta,
        resposta: novaResposta,
      }),
    })
      .then((res) => res.json())
      .then((newItem) => {
        setFaq((prev) => [...prev, newItem]);
        setNovaPergunta("");
        setNovaResposta("");
        setSnackbarMessage("Pergunta adicionada com sucesso!");
        setOpenSnackbar(true);
      })
      .catch((err) => {
        console.error("Erro ao adicionar FAQ:", err);
        setSnackbarMessage("Erro ao adicionar pergunta.");
        setOpenSnackbar(true);
      });
  };

  const pedirExclusao = (index) => {
    setFaqToDelete(index);
    setDialogOpen(true);
  };
  const confirmarExclusao = () => {
    if (faqToDelete !== null) {
      const faqId = faq[faqToDelete].id;
      fetch(`http://localhost:5001/api/faq/${faqId}`, { method: "DELETE" })
        .then((resp) => {
          if (!resp.ok) throw new Error("Erro na resposta do servidor");
          const novaLista = [...faq];
          novaLista.splice(faqToDelete, 1);
          setFaq(novaLista);
          setSnackbarMessage("Pergunta excluída com sucesso!");
          setOpenSnackbar(true);
        })
        .catch(() => {
          setSnackbarMessage("Erro ao excluir pergunta!");
          setOpenSnackbar(true);
        })
        .finally(() => {
          setDialogOpen(false);
          setFaqToDelete(null);
        });
    }
  };
  const cancelarExclusao = () => {
    setDialogOpen(false);
    setFaqToDelete(null);
  };

  const abrirEdicao = (idx) => {
    setEditIndex(idx);
    setEditPergunta(faq[idx].pergunta);
    setEditResposta(faq[idx].resposta);
    setEditDialogOpen(true);
  };
  const salvarEdicao = () => {
    const faqItem = faq[editIndex];
    fetch(`http://localhost:5001/api/faq/${faqItem.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pergunta: editPergunta,
        resposta: editResposta,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        const updated = [...faq];
        updated[editIndex] = {
          ...faqItem,
          pergunta: editPergunta,
          resposta: editResposta,
        };
        setFaq(updated);
        setSnackbarMessage("Pergunta atualizada com sucesso!");
        setOpenSnackbar(true);
        setEditDialogOpen(false);
      })
      .catch(() => {
        setSnackbarMessage("Erro ao atualizar pergunta!");
        setOpenSnackbar(true);
      });
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
            key={item.id || idx}
            className="faq-item"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <ListItemText primary={item.pergunta} secondary={item.resposta} />
            <Box>
              <Button
                variant="outlined"
                sx={{ mr: 1 }}
                onClick={() => abrirEdicao(idx)}
              >
                Editar
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => pedirExclusao(idx)}
              >
                Excluir
              </Button>
            </Box>
          </ListItem>
        ))}
      </List>

      <Dialog open={dialogOpen} onClose={cancelarExclusao}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir esta pergunta?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelarExclusao}>Cancelar</Button>
          <Button onClick={confirmarExclusao} color="error">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
      >
        <DialogTitle>Editar Pergunta</DialogTitle>
        <DialogContent>
          <TextField
            label="Pergunta"
            value={editPergunta}
            onChange={(e) => setEditPergunta(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Resposta"
            value={editResposta}
            onChange={(e) => setEditResposta(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={salvarEdicao}>Salvar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />

      <footer className="admin-footer">
        <Button
          className="button-voltar"
          onClick={() => navigate("/admin")}
        >
          Voltar
        </Button>
        <img
          src={require("../../img/logoprefeitura2.png")}
          alt="Logo Prefeitura"
          className="footer-logo"
        />
      </footer>
    </Box>
  );
};

export default GestaoIA;
