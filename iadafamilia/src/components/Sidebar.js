import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import logoprefeitura from '../img/logoprefeitura.png';

const Sidebar = ({ onQuestionClick, selectedChatId, setSelectedChatId }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isNewsExpanded, setIsNewsExpanded] = useState(false);
    const [noticias, setNoticias] = useState([]);
    const [chats, setChats] = useState([]);
    const userId = sessionStorage.getItem('userId');

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const toggleNews = (e) => {
        e.stopPropagation();
        setIsNewsExpanded(!isNewsExpanded);
    };

    const handleAddChat = () => {
        const newId = chats.length > 0 ? chats[chats.length - 1].id + 1 : 1;
        const newChat = { id: newId, title: `Chat ${newId}` };
        setChats(prevChats => [...prevChats, newChat]);
        const payload = { title: userId ? 'Novo chat' : 'Chat anônimo' };

        if (userId != null) {
            payload.user_id = userId;
        }

        fetch('http://localhost:5001/api/chats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            console.log('Chat criado:', data);
            // atualizar estado, etc.
        })
        .catch(err => console.error('Erro ao criar chat:', err));
    };

    const handleRemoveChat = (id) => {
        setChats(prevChats => prevChats.filter(chat => chat.id !== id));

        fetch(`http://localhost:5001/api/chats/${id}`, { method: 'DELETE' });
    };

    useEffect(() => {
        if (chats.length === 0) {
            const initialChat = { id: 1, title: 'Chat 1' };
            setChats([initialChat]);
            setSelectedChatId(1);
        } else {
            fetch(`http://localhost:5001/api/chats?user_id=${userId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
        }

        fetch('http://localhost:5001/api/conteudos')
            .then(res => res.json())
            .then(data => setNoticias(data))
            .catch(err => console.error('Erro ao carregar contéudos', err));
    }, [chats.length, userId, setSelectedChatId, setChats, setNoticias]);

    return (
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className={`sidebar-header ${isCollapsed ? 'collapsed' : ''}`}>
                <IconButton onClick={handleAddChat}>
                    <AddCircleIcon sx={{ color: 'var(--azul)' }} />
                </IconButton>
                <IconButton onClick={toggleSidebar}>
                    {isCollapsed ? (
                        <ArrowForwardIcon sx={{ color: 'var(--azul)' }} />
                    ) : (
                        <ArrowBackIcon sx={{ color: 'var(--azul)' }} />
                    )}
                </IconButton>
            </div>

            {!isCollapsed && (
                <>
                    <div className="sidebar-content">
                        <h3 style={{ fontFamily: 'var(--font-titles)' }}>Seus Chats</h3>
                        <ul>
                            {chats.map((chat) => (
                                <li
                                    key={chat.id}
                                    onClick={() => setSelectedChatId(chat.id)}
                                    className={`chat-item ${selectedChatId === chat.id ? 'selected' : ''}`}
                                    style={{
                                        fontFamily: 'var(--font-body)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    {chat.title}
                                    <IconButton
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveChat(chat.id);
                                        }}
                                        size="small"
                                        className="remove-chat-button"
                                        sx={{ color: 'red' }}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="sidebar-footer">
                        <div className="faq-container">
                            <h3 style={{ fontFamily: 'var(--font-titles)' }}>Perguntas Frequentes</h3>
                            <ul>
                                <li
                                    style={{ fontFamily: 'var(--font-body)', cursor: 'pointer' }}
                                    onClick={() => onQuestionClick('Como posso marcar uma consulta?')}
                                >
                                    Como posso marcar uma consulta?
                                </li>
                                <li
                                    style={{ fontFamily: 'var(--font-body)', cursor: 'pointer' }}
                                    onClick={() => onQuestionClick('Remédios para dor de cabeça')}
                                >
                                    Remédios para dor de cabeça
                                </li>
                                <li
                                    style={{ fontFamily: 'var(--font-body)', cursor: 'pointer' }}
                                    onClick={() => onQuestionClick('Qual o procedimento para exames de sangue?')}
                                >
                                    Qual o procedimento para exames de sangue?
                                </li>
                            </ul>
                        </div>

                        <div
                            className={`noticias-container ${isNewsExpanded ? 'expanded' : ''}`}
                            onClick={toggleNews}
                        >
                            {!isNewsExpanded ? (
                                <div className="noticias-button">Notícias</div>
                            ) : (
                                <div className="noticias-content" style={{ color: 'inherit' }}>
                                    <IconButton
                                        className="close-news-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsNewsExpanded(false);
                                        }}
                                        sx={{ color: 'inherit' }}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                    <h3 style={{ fontFamily: 'var(--font-titles)', color: 'inherit' }}>Notícias</h3>
                                    <div className="news-items">
                                        {noticias.length === 0 ? (
                                            <p style={{ fontFamily: 'var(--font-body)', color: 'inherit' }}>
                                                Sem notícias no momento
                                            </p>
                                        ) : (
                                            noticias.map((noticia, idx) => (
                                                <div key={idx} className="noticia">
                                                    <h4 style={{ fontFamily: 'var(--font-titles)', color: 'inherit' }}>
                                                        {noticia.titulo}
                                                    </h4>
                                                    <p style={{ fontFamily: 'var(--font-body)', color: 'inherit' }}>
                                                        {noticia.descricao}
                                                    </p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="logo">
                            <img
                                src={logoprefeitura}
                                alt="Logo da Prefeitura"
                                className="logo-prefeitura"
                                width="240px"
                            />
                        </div>
                    </div>
                </>
            )}
        </aside>
    );
};

export default Sidebar;
