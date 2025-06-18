import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';

const ChatArea = forwardRef(({ fontSize, chatId }, ref) => {
    const [chatMessages, setChatMessages] = useState({});
    const [realChatId, setRealChatId ] = useState(null);
    const messagesEndRef = useRef(null);
    const messages = chatMessages[chatId] || [];

    const botResponses = {
        'Como posso marcar uma consulta?': 'Você pode marcar uma consulta pelo nosso aplicativo ou pelo telefone 0800-123-456.',
        'Remédios para dor de cabeça': 'Os remédios mais comuns para dor de cabeça incluem Paracetamol e Dipirona. Consulte um médico antes de usar.',
        'Qual o procedimento para exames de sangue?': 'Para exames de sangue, você deve agendar previamente e comparecer em jejum no laboratório mais próximo.',
    };

    const addMessage = async (text, sender) => {
        
        if (sender === 'user' && realChatId === null) {
            const res = await fetch('http://localhost:5001/api/chats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: text,
                    messages: [{text, sender}]
                })
            });

            if (!res.ok) throw new Error('Falha ao criar chat');
        
            const chat = await res.json();
            setRealChatId(chat.id);
            
        } else if (realChatId !== null) {
            await fetch(`http://localhost:5001/api/chats/${realChatId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({messages: [...(chatMessages[chatId] || []), { text, sender }] })
            });
            
        }
        setChatMessages(prev => ({ ...prev, [chatId]: [...(prev[chatId] || []), { text, sender }],}));
        scrollToBottom();
    };

    const handleQuestionClick = async (question) => {
        await addMessage(question, 'user');
        setTimeout(() => {
            const botResponse = botResponses[question]
                ? botResponses[question]
                : 'Não encontrei uma resposta para isso.';
            addMessage(botResponse, 'bot');
        }, 1000);
    };

    const handleUserMessage = async (userMessage) => {
    addMessage(userMessage, 'user');
    try {
        const response = await fetch('http://localhost:5000/api/detect_intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage }),
        });
        if (response.ok) {
            const data = await response.json();
            addMessage(data.response, 'bot');
        } else {
            addMessage('Desculpe, houve um erro ao processar sua mensagem.', 'bot');
        }
    } catch (error) {
        addMessage('Erro de conexão com o servidor do chatbot.', 'bot');
    }
};

    useImperativeHandle(ref, () => ({
        handleQuestionClick,
        handleUserMessage,
    }));

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="messages-container">
            {messages.map((msg, index) => (
                <div
                    key={index}
                    className={`chat-bubble ${msg.sender === 'user' ? 'user' : 'bot'}`}
                    style={{
                        fontSize: `${fontSize}px`,
                        fontFamily: msg.sender === 'user' ? 'var(--font-small)' : 'var(--font-body)',
                    }}
                >
                    {msg.text}
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
});

export default ChatArea;
