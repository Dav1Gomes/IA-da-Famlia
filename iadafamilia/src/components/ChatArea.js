import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';

const ChatArea = forwardRef(({ fontSize }, ref) => {
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    const botResponses = {
        'Como posso marcar uma consulta?': 'Você pode marcar uma consulta pelo nosso aplicativo ou pelo telefone 0800-123-456.',
        'Remédios para dor de cabeça': 'Os remédios mais comuns para dor de cabeça incluem Paracetamol e Dipirona. Consulte um médico antes de usar.',
        'Qual o procedimento para exames de sangue?': 'Para exames de sangue, você deve agendar previamente e comparecer em jejum no laboratório mais próximo.',
    };

    const addMessage = (text, sender) => {
        setMessages((prev) => [...prev, { text, sender }]);
        scrollToBottom();
    };

    const handleQuestionClick = (question) => {
        addMessage(question, 'user');
        setTimeout(() => {
            const botResponse = botResponses[question]
                ? botResponses[question]
                : 'Não encontrei uma resposta para isso.';
            addMessage(botResponse, 'bot');
        }, 1000);
    };

    const handleUserMessage = (userMessage) => {
        addMessage(userMessage, 'user');
        setTimeout(() => {
            const botResponse = `Resposta do bot para: "${userMessage}" - Esta é uma resposta simulada.`;
            addMessage(botResponse, 'bot');
        }, 1000);
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
