import React, { useState } from 'react';
import { Box, TextField, Typography, Button, Paper, Grid, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin/AdminPrincipal.css';
import '../../styles/admin/LancamentoConteudo.css';

const LancarConteudo = () => {
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [conteudos, setConteudos] = useState([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [conteudoToDelete, setConteudoToDelete] = useState(null);

  const publicar = () => {
    if (!titulo.trim() || !descricao.trim() || !dataInicio || !dataFim) {
      setSnackbarMessage('Preencha todos os campos!');
      setOpenSnackbar(true);
      return;
    }
  
    if (new Date(dataFim) < new Date(dataInicio)) {
      setSnackbarMessage('A data final não pode ser antes da data inicial!');
      setOpenSnackbar(true);
      return;
    }
  
    setConteudos([...conteudos, { titulo, descricao, dataInicio, dataFim }]);
    setTitulo('');
    setDescricao('');
    setDataInicio('');
    setDataFim('');
    setSnackbarMessage('Conteúdo adicionado com sucesso!');
    setOpenSnackbar(true);
  };

  const pedirExclusao = (index) => {
    setConteudoToDelete(index);
    setDialogOpen(true);
  };

  const confirmarExclusao = () => {
    if (conteudoToDelete !== null) {
      const novaLista = [...conteudos];
      novaLista.splice(conteudoToDelete, 1);
      setConteudos(novaLista);
      setSnackbarMessage('Conteúdo excluído com sucesso!');
      setOpenSnackbar(true);
    }
    setDialogOpen(false);
    setConteudoToDelete(null);
  };

  const cancelarExclusao = () => {
    setDialogOpen(false);
    setConteudoToDelete(null);
  };

  const formatarData = (data) => {
    if (!data) return '';
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <Box className="admin-page">
      <Typography variant="h4" className="admin-title">Lançar Conteúdo</Typography>

      <Box className="form-conteudo">
        <TextField
          label="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          fullWidth
          multiline
          rows={4}
          sx={{ mb: 2 }}
        />
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <TextField
              label="Data de Início"
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Data Final"
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
        <Button variant="contained" sx={{ backgroundColor: 'var(--verde-agua)' }} onClick={publicar}>
          Publicar
        </Button>
      </Box>

      <Box className="conteudos-publicados">
        {conteudos.map((item, idx) => (
          <Paper key={idx} className="conteudo-item">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6">{item.titulo}</Typography>
                <Typography variant="body1">{item.descricao}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Início:</strong> {formatarData(item.dataInicio)} — <strong>Final:</strong> {formatarData(item.dataFim)}
                </Typography>
              </Box>
              <Button
                variant="contained"
                className="delete-button"
                onClick={() => pedirExclusao(idx)}
              >
                Excluir
              </Button>
            </Box>
          </Paper>
        ))}
      </Box>

      <footer className="admin-footer">
        <Button className="button-voltar" onClick={() => navigate('/admin')}>
          Voltar
        </Button>
        <img src={require('../../img/logoprefeitura2.png')} alt="Logo Prefeitura" className="footer-logo" />
      </footer>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />

      <Dialog
        open={dialogOpen}
        onClose={cancelarExclusao}
      >
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza que deseja excluir este conteúdo?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelarExclusao}>Cancelar</Button>
          <Button onClick={confirmarExclusao} sx={{ color: 'var(--vermelho)' }}>Excluir</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LancarConteudo;
