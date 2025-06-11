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
        
        fetch('/api/chats', { method: 'POST', body: JSON.stringify({ user_id: userId, title: newChat.title }) });
    };

    const handleRemoveChat = (id) => {
        setChats(prevChats => prevChats.filter(chat => chat.id !== id));

        fetch(`/api/chats/${id}`, { method: 'DELETE' });
    };

    useEffect(() => {
        if (chats.length === 0) {
            const initialChat = { id: 1, title: 'Chat 1' };
            setChats([initialChat]);
            setSelectedChatId(1);

            fetch('/api/chats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, title: initialChat.title })
            });
        }
    }, []);

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
                                    style={{ fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                                >
                                    {chat.title}
                                    <IconButton
                                        onClick={(e) =>{
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

                        <div className={`noticias-container ${isNewsExpanded ? 'expanded' : ''}`} onClick={toggleNews}>
                            {!isNewsExpanded ? (
                                <div className="noticias-button">Notícias</div>
                            ) : (
                                <div className="noticias-content">
                                    <IconButton 
                                        className="close-news-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsNewsExpanded(false);
                                        }}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                    <h3>Notícias</h3>
                                    <div className="news-items">
                                        <h1>Aqui vão ficar as notícias</h1>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className='logo'>
                            <img src={logoprefeitura} alt='Logo da Prefeitura' className='logo-prefeitura' width={"240px"} />
                        </div>
                    </div>
                </>
            )}
        </aside>
    );
};

export default Sidebar;