import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';

const ChatArea = forwardRef(({ fontSize, chatId }, ref) => {
  const [chatMessages, setChatMessages] = useState({});
  const messagesEndRef = useRef(null);
  const messages = chatMessages[chatId] || [];

  const addMessage = (text, sender) => {
    setChatMessages(prev => ({
      ...prev,
      [chatId]: [
        ...(prev[chatId] || []),
        { text, sender }
      ]
    }));
    scrollToBottom();
  };

  const handleQuestionClick = (question) => {
    handleUserMessage(question);
  };

  const handleUserMessage = async (userMessage) => {
  addMessage(userMessage, 'user');

  try {
    const res = await fetch('http://localhost:5000/api/detect_intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!res.ok) throw new Error(`Status ${res.status}`);
    const { response } = await res.json();
    addMessage(response, 'bot');

  } catch (err) {
    console.error('Erro ao chamar serviço Python:', err);
    addMessage('Erro de conexão com o serviço de IA.', 'bot');
  }
};


  useImperativeHandle(ref, () => ({
    handleQuestionClick,
    handleUserMessage
  }));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="messages-container">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`chat-bubble ${msg.sender === 'user' ? 'user' : 'bot'}`}
          style={{
            fontSize: `${fontSize}px`,
            fontFamily: msg.sender === 'user'
              ? 'var(--font-small)'
              : 'var(--font-body)'
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
