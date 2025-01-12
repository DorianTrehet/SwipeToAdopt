import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './Chat.css';

const socket = io('http://localhost:5000');

const Chat = ({ from = 'user1', to = 'user2' }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Créer une room unique pour chaque paire d'utilisateurs
    const room = [from, to].sort().join('-'); // La room est identifiée par les noms des utilisateurs, triés pour garantir une clé unique

    // Rejoindre la room
    socket.emit('joinRoom', room);

    // Écouter les messages provenant de la room
    socket.on('receiveMessage', (data) => {
      if ((data.from === from && data.to === to) || (data.from === to && data.to === from)) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    });

    // Nettoyer l'écouteur de socket à la déconnexion du composant
    return () => {
      socket.off('receiveMessage');
    };
  }, [from, to]);

  const sendMessage = () => {
    if (!from || !to) {
      console.error('Les utilisateurs ne sont pas correctement définis');
      return;
    }
    socket.emit('sendMessage', { from, to, message });
    setMessages((prevMessages) => [...prevMessages, { from, message }]);
    setMessage('');
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <p key={index}><strong>{msg.from}:</strong> {msg.message}</p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Entrez votre message"
      />
      <button onClick={sendMessage}>Envoyer</button>
    </div>
  );
};

export default Chat;
