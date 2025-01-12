// Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);  // Pour stocker les informations de l'utilisateur actuel

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      // Récupérer les données du currentUser depuis l'API
      axios.get('http://localhost:5000/current-user', {
        headers: {
          'x-auth-token': token,
        },
      })
      .then((response) => {
        setCurrentUser(response.data);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération de l\'utilisateur actuel:', error);
      });
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="hamburger" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul className={`navbar-list ${menuOpen ? 'open' : ''}`}>
        <li><Link to="/">Accueil</Link></li>
        {isLoggedIn && currentUser && (
          <li><Link to={`/profile/${currentUser._id}`}>Profil</Link></li>
        )}
        {isLoggedIn && <li><Link to="/chat">Chat</Link></li>}
        {isLoggedIn && <li><Link to="/animals">Animaux</Link></li>}
        {!isLoggedIn && <li><Link to="/login">Connexion</Link></li>}
        {!isLoggedIn && <li><Link to="/register">Inscription</Link></li>}
        {isLoggedIn && <li><button onClick={handleLogout}>Déconnexion</button></li>}
      </ul>
    </nav>
  );
};

export default Navbar;
