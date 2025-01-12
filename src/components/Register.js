// Register.js
import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [inGameUsername, setInGameUsername] = useState('');
  const [server, setServer] = useState('');
  const [message, setMessage] = useState('');

  const servers = ['Agride', 'Echo', 'Ilyzaelle', 'Jahash', 'Merkator'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        email, password, name, imageUrl, inGameUsername, server
      });
      localStorage.setItem('token', res.data.token); // Sauvegarder le jeton JWT
      setMessage('Inscription réussie !');
    } catch (error) {
      setMessage('Erreur lors de l’inscription.');
    }
  };

  return (
    <div className="register-container">
      <h2>Inscription</h2>
      {message && <p className="message">{message}</p>}
      <form className="register-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Pseudo *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe *"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Nom en jeu *"
          value={inGameUsername}
          onChange={(e) => setInGameUsername(e.target.value)}
          required
        />
        <select
          value={server}
          onChange={(e) => setServer(e.target.value)}
          required
        >
          <option value="">Choisir un serveur *</option>
          {servers.map((serverOption, index) => (
            <option key={index} value={serverOption}>
              {serverOption}
            </option>
          ))}
        </select>
        <br />
        <p>Vous avez déjà un compte ? <a href="/login">Connectez-vous</a></p>
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
};

export default Register;
