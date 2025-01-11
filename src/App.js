// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Profile from './components/Profile';
import Chat from './components/Chat';
import Login from './components/Login';
import Register from './components/Register';
import AnimalCard from './components/AnimalCard';
import axios from 'axios';

const App = () => {
  const [animals, setAnimals] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [matchedUser, setMatchedUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:5000/current-user', {
        headers: { 'x-auth-token': token } 
      })
      .then(response => setCurrentUser(response.data))
      .catch(error => console.error('Erreur lors de la récupération de l\'utilisateur actuel!', error.response ? error.response.data : error));      
    } else {
      console.error("Token non trouvé dans le localStorage");
    }    
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:5000/animals', {
        headers: { 'x-auth-token': token }
      })
      .then(response => setAnimals(response.data))
      .catch(error => console.error("Erreur lors de la récupération des animaux!", error));
    } else {
      console.error("Token non trouvé dans le localStorage");
    }
  }, [currentUser]);

  const handleSwipe = (direction, animalId) => {
    if (!currentUser) {
      console.error('Utilisateur non connecté');
      return;
    }

    console.log(`Swipe direction: ${direction}, Animal ID: ${animalId}`);

    const like_dislike = direction === 'right';
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token non trouvé');
      return;
    }

    axios.post('http://localhost:5000/swipes', {
      user_id: currentUser._id,
      animal_id: animalId,
      like_dislike: like_dislike
    }, {
      headers: {
        'x-auth-token': token
      }
    })
    .then(response => {
      console.log('Swipe enregistré avec succès !');
      if (response.data.matchedUser) {
        setMatchedUser(response.data.matchedUser); // Set the matched user
      }
    })
    .catch(error => {
      console.error('Erreur lors de l\'enregistrement du swipe:', error.response ? error.response.data : error);
    });
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<h1>Page d'accueil</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<PrivateRoute element={Profile} />} />
        <Route path="/chat" element={<PrivateRoute element={Chat} />} />
        <Route path="/animals" element={
          <div className="animal-list">
            {animals.map(animal => (
              <AnimalCard
                key={animal._id}
                {...animal}
                onSwipe={(dir) => handleSwipe(dir, animal._id)}
              />
            ))}
          </div>
        } />
      </Routes>
      {matchedUser && <Chat currentUser={currentUser} matchedUser={matchedUser} />}
    </Router>
  );
};

export default App;