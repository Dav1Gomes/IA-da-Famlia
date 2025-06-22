import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  Paper,
  Grid,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin/AdminPrincipal.css';
import '../../styles/admin/LancamentoConteudo.css';

const LancamentoConteudo = () => {
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

  const [editId, setEditId] = useState(null);
  const [editTitulo, setEditTitulo] = useState('');
  const [editDescricao, setEditDescricao] = useState('');
  const [editDataInicio, setEditDataInicio] = useState('');
  const [editDataFim, setEditDataFim] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5001/api/conteudos')
      .then(res => res.json())
      .then(data => {
        const mapped = data.map(item => ({
          id: item.id,
          titulo: item.titulo,
          descricao: item.descricao,
          dataInicio: item.data_inicio,
          dataFim: item.data_fim
        }));
        setConteudos(mapped);
      })
      .catch(err => {
        console.error('Erro ao carregar conteúdos', err);
        setSnackbarMessage('Erro ao carregar conteúdos.');
        setOpenSnackbar(true);
      });
  }, []);

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

    fetch('http://localhost:5001/api/conteudos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo,
        descricao,
        data_inicio: dataInicio,
        data_fim: dataFim
      })
    })
      .then(res => res.json())
      .then(newItem => {
        setConteudos(prev => [
          ...prev,
          {
            id: newItem.id,
            titulo: newItem.titulo,
            descricao: newItem.descricao,
            dataInicio: newItem.data_inicio,
            dataFim: newItem.data_fim
          }
        ]);
        setTitulo('');
        setDescricao('');
        setDataInicio('');
        setDataFim('');
        setSnackbarMessage('Conteúdo adicionado com sucesso!');
        setOpenSnackbar(true);
      })
      .catch(err => {
        console.error('Erro ao publicar', err);
        setSnackbarMessage('Erro ao adicionar conteúdo.');
        setOpenSnackbar(true);
      });
  };

  const pedirExclusao = id => {
    setConteudoToDelete(id);
    setDialogOpen(true);
  };
  const confirmarExclusao = () => {
    if (conteudoToDelete != null) {
      fetch(`http://localhost:5001/api/conteudos/${conteudoToDelete}`, {
        method: 'DELETE'
      })
        .then(res => {
          if (!res.ok) throw new Error();
          setConteudos(prev => prev.filter(item => item.id !== conteudoToDelete));
          setSnackbarMessage('Conteúdo excluído com sucesso!');
          setOpenSnackbar(true);
        })
        .catch(err => {
          console.error('Erro ao excluir', err);
          setSnackbarMessage('Erro ao excluir conteúdo.');
          setOpenSnackbar(true);
        })
        .finally(() => {
          setDialogOpen(false);
          setConteudoToDelete(null);
        });
    }
  };
  const cancelarExclusao = () => {
    setDialogOpen(false);
    setConteudoToDelete(null);
  };

  const abrirEdicao = item => {
    setEditId(item.id);
    setEditTitulo(item.titulo);
    setEditDescricao(item.descricao);
    setEditDataInicio(item.dataInicio);
    setEditDataFim(item.dataFim);
    setEditDialogOpen(true);
  };
  const salvarEdicao = () => {
    fetch(`http://localhost:5001/api/conteudos/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: editTitulo,
        descricao: editDescricao,
        data_inicio: editDataInicio,
        data_fim: editDataFim
      })
    })
      .then(res => {
        if (!res.ok) throw new Error();
        setConteudos(prev =>
          prev.map(c =>
            c.id === editId
              ? { ...c, titulo: editTitulo, descricao: editDescricao, dataInicio: editDataInicio, dataFim: editDataFim }
              : c
          )
        );
        setSnackbarMessage('Conteúdo atualizado com sucesso!');
        setOpenSnackbar(true);
        setEditDialogOpen(false);
      })
      .catch(() => {
        setSnackbarMessage('Erro ao atualizar conteúdo.');
        setOpenSnackbar(true);
      });
  };

  const formatarData = data => {
    if (!data) return '';
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <Box className="admin-page">
      <Typography variant="h4" className="admin-title">
        Lançar Conteúdo
      </Typography>

      <Box className="form-conteudo">
        <TextField
          label="Título"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Descrição"
          value={descricao}
          onChange={e => setDescricao(e.target.value)}
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
              onChange={e => setDataInicio(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Data Final"
              type="date"
              value={dataFim}
              onChange={e => setDataFim(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          sx={{ backgroundColor: 'var(--verde-agua)' }}
          onClick={publicar}
        >
          Publicar
        </Button>
      </Box>

      <Box className="conteudos-publicados">
        {conteudos.map(item => (
          <Paper key={item.id} className="conteudo-item">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6">{item.titulo}</Typography>
                <Typography variant="body1">{item.descricao}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Início:</strong> {formatarData(item.dataInicio)} —{' '}
                  <strong>Final:</strong> {formatarData(item.dataFim)}
                </Typography>
              </Box>
              <Box>
                <Button variant="outlined" sx={{ mr: 1 }} onClick={() => abrirEdicao(item)}>
                  Editar
                </Button>
                <Button variant="contained" color="error" onClick={() => pedirExclusao(item.id)}>
                  Excluir
                </Button>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>

      <footer className="admin-footer">
        <Button className="button-voltar" onClick={() => navigate('/admin')}>
          Voltar
        </Button>
        <img
          src={require('../../img/logoprefeitura2.png')}
          alt="Logo Prefeitura"
          className="footer-logo"
        />
      </footer>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />

      <Dialog open={dialogOpen} onClose={cancelarExclusao}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza que deseja excluir este conteúdo?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelarExclusao}>Cancelar</Button>
          <Button onClick={confirmarExclusao} sx={{ color: 'var(--vermelho)' }}>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Editar Conteúdo</DialogTitle>
        <DialogContent>
          <TextField
            label="Título"
            value={editTitulo}
            onChange={e => setEditTitulo(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Descrição"
            value={editDescricao}
            onChange={e => setEditDescricao(e.target.value)}
            fullWidth
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Data Início"
            type="date"
            value={editDataInicio}
            onChange={e => setEditDataInicio(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Data Fim"
            type="date"
            value={editDataFim}
            onChange={e => setEditDataFim(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancelar</Button>
          <Button onClick={salvarEdicao}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LancamentoConteudo;
