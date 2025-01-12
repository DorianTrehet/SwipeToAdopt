import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './Chat.css';

const socket = io('http://localhost:5000');

const Chat = ({ from = 'user1', to = 'user2' }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState(new Set()); // Suivi des messages envoyés par l'utilisateur actuel

  useEffect(() => {
    // Créer une room unique pour chaque paire d'utilisateurs
    const room = [from, to].sort().join('-'); // La room est identifiée par les noms des utilisateurs, triés pour garantir une clé unique

    // Rejoindre la room
    socket.emit('joinRoom', room);

    // Écouter les messages provenant de la room
    socket.on('receiveMessage', (data) => {
      // N'ajouter le message que si ce n'est pas un message déjà envoyé par l'utilisateur actuel
      if (data.from !== from || !sentMessages.has(data.message)) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    });

    // Nettoyer l'écouteur de socket à la déconnexion du composant
    return () => {
      socket.off('receiveMessage');
    };
  }, [from, to, sentMessages]);

  const sendMessage = () => {
    if (!from || !to) {
      console.error('Les utilisateurs ne sont pas correctement définis');
      return;
    }

    // Ajouter le message à l'état avant de l'envoyer pour le rendre visible immédiatement
    setMessages((prevMessages) => [...prevMessages, { from, message }]);

    // Envoyer le message au serveur
    socket.emit('sendMessage', { from, to, message });

    // Ajouter le message à l'ensemble des messages envoyés
    setSentMessages((prevSentMessages) => new Set(prevSentMessages).add(message));

    // Réinitialiser le champ de message
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
