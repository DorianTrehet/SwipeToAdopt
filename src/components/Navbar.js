// Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Utilisation de Link et useNavigate

const Navbar = () => {
  const navigate = useNavigate(); // Hook pour rediriger l'utilisateur

  const handleLogout = () => {
    localStorage.removeItem('token'); // Suppression du jeton JWT
    navigate('/login'); // Redirection vers la page de connexion
  };

  return (
    <nav>
      <ul>
        <li><Link to="/">Accueil</Link></li>
        <li><Link to="/profile">Profil</Link></li>
        <li><Link to="/chat">Chat</Link></li>
        <li><Link to="/animals">Animaux</Link></li>
        <li><button onClick={handleLogout}>Déconnexion</button></li>
      </ul>
    </nav>
  );
};

export default Navbar;