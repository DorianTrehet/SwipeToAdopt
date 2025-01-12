import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Profile from './components/Profile';
import Chat from './components/Chat';
import Login from './components/Login';
import Register from './components/Register';
import AnimalCard from './components/AnimalCard';
import UserProfileCard from './components/UserProfileCard';  // Nouveau composant pour les profils d'utilisateurs
import axios from 'axios';

const App = () => {
  const [animals, setAnimals] = useState([]);  // Ajouter un état pour stocker les animaux
  const [users, setUsers] = useState([]);  // Ajouter un état pour stocker les utilisateurs
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
      // Récupérer tous les utilisateurs
      axios.get('http://localhost:5000/users', {
        headers: { 'x-auth-token': token }
      })
      .then(response => setUsers(response.data))  // Stocker les utilisateurs dans l'état
      .catch(error => console.error('Erreur lors de la récupération des utilisateurs!', error));
    } else {
      console.error("Token non trouvé dans le localStorage");
    }
  }, [currentUser]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Récupérer les animaux
      axios.get('http://localhost:5000/animals', {
        headers: { 'x-auth-token': token }
      })
      .then(response => setAnimals(response.data))  // Stocker les animaux dans l'état
      .catch(error => console.error('Erreur lors de la récupération des animaux!', error));
    } else {
      console.error("Token non trouvé dans le localStorage");
    }
  }, [currentUser]);  // Charger les animaux lorsque currentUser change

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
      animal_id: animalId,
      like_dislike: like_dislike
    }, {
      headers: {
        'x-auth-token': token
      }
    })
    .then(response => {
      console.log('Swipe enregistré avec succès !');
      if (response.data.adoptedAnimal) {
        setCurrentUser((prevUser) => ({
          ...prevUser,
          adoptedAnimals: [...prevUser.adoptedAnimals, response.data.adoptedAnimal]
        }));
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
        <Route path="/" element={
          <div>
            <h1>Page d'accueil</h1>
            <div className="user-list">
              {users.map(user => (
                <UserProfileCard
                  key={user._id}
                  user={user}  // Passer chaque utilisateur au composant UserProfileCard
                />
              ))}
            </div>
          </div>
        } />
        
        {/* Route dynamique pour afficher un profil utilisateur spécifique */}
        <Route path="/profile/:userId" element={<Profile />} />
        
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
