import React, { useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';

const HomePage = ({ onToggleDarkMode, onFontSizeChange, fontSize }) => {
    const chatAreaRef = useRef(null);
    const [selectedChatId, setSelectedChatId] = useState(null);

    const handleSendMessage = (message) => {
        if (chatAreaRef.current) {
            chatAreaRef.current.handleUserMessage(message);
        }
    };

    const handleQuestionClick = (question) => {
        if (chatAreaRef.current) {
            chatAreaRef.current.handleQuestionClick(question);
        }
    };

    const toggleDarkMode = (isDark) => {
        document.body.classList.toggle('dark-mode', isDark);
    };

    return (
        <div className="app-container">
            <Navbar
                onToggleDarkMode={toggleDarkMode}
                onFontSizeChange={onFontSizeChange}
            />
            <div className="main-container">
                <Sidebar
                    onQuestionClick={handleQuestionClick}
                    selectedChatId={selectedChatId}
                    setSelectedChatId={setSelectedChatId}
                />
                <div className="chat-container">
                    <ChatArea
                        ref={chatAreaRef}
                        fontSize={fontSize}
                        chatId={selectedChatId}
                    />
                    <footer className="chat-footer">
                        <input
                            type="text"
                            placeholder="Digite sua mensagem"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSendMessage(e.target.value);
                                    e.target.value = '';
                                }
                            }}
                        />
                        <button
                            onClick={(e) => {
                                const input = e.target.previousSibling;
                                handleSendMessage(input.value);
                                input.value = '';
                            }}
                        >
                            Enviar
                        </button>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default HomePage;