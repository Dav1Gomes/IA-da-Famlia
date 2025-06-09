import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import BarChartIcon from '@mui/icons-material/BarChart';
import PublishIcon from '@mui/icons-material/Publish';
import LogoutIcon from '@mui/icons-material/Logout';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import logoprefeitura from '../../img/logoprefeitura2.png';
import SplitText from '../../components/SplitText';
import '../../styles/admin/AdminPrincipal.css';

const AdminPrincipal = () => {
    const navigate = useNavigate();
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

    const abrirDialogLogout = () => {
        setLogoutDialogOpen(true);
    };

    const confirmarLogout = () => {
        sessionStorage.clear();
        localStorage.clear();

        
        setLogoutDialogOpen(false);

        
        navigate('/');
    };

    const cancelarLogout = () => {
        setLogoutDialogOpen(false);
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
              <img src={logoprefeitura} alt="Logo da Prefeitura" className="logo-prefeitura" height={"100px"}/>
              <SplitText
                text="Olá admin!"
                className="admin-greeting"
                delay={100}
                animationFrom={{ opacity: 0, transform: 'translate3d(0,40px,0)' }}
                animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
                easing="easeOutCubic"
                threshold={0.2}
                rootMargin="-50px"
                onLetterAnimationComplete={() => console.log("Animação concluída!")}
              />
              <button className="logout-button" onClick={abrirDialogLogout}>
                <LogoutIcon className="logout-icon" />
                Logout
              </button>
            </div>

            <div className="admin-menu">
                <div className="menu-button" onClick={() => navigate('/admin/gestao-ia')}>
                    <SettingsIcon className="menu-icon" />
                    <span className="menu-label">Gestão da IA</span>
                </div>
                <div className="menu-button" onClick={() => navigate('/admin/graficos')}>
                    <BarChartIcon className="menu-icon" />
                    <span className="menu-label">Gráficos e Relatórios</span>
                </div>
                <div className="menu-button" onClick={() => navigate('/admin/lancar-conteudo')}>
                    <PublishIcon className="menu-icon" />
                    <span className="menu-label">Lançar Conteúdo</span>
                </div>
            </div>

            <Dialog
                open={logoutDialogOpen}
                onClose={cancelarLogout}
            >
                <DialogTitle>Confirmar Logout</DialogTitle>
                <DialogContent>
                    <Typography>Tem certeza que deseja sair?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelarLogout}>Cancelar</Button>
                    <Button onClick={confirmarLogout} sx={{ color: 'var(--vermelho)' }}>Sair</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AdminPrincipal;
