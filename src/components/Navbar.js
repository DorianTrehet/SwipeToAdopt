// Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
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
        {isLoggedIn && <li><Link to="/profile">Profil</Link></li>}
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
