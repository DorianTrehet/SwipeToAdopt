import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import AnimalCard from './AnimalCard';

const Profile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    inGameUsername: '',
    server: '',
    animalsForAdoption: [],
    adoptedAnimals: [],
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/login';
          return;
        }
        const response = await axios.get('http://localhost:5000/current-user', {
          headers: {
            'x-auth-token': token,
          },
        });
        setUser(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          window.location.href = '/login';
        }
      }
    };
    fetchUserData();
  }, []);

  const handleSwipe = (direction) => {
    console.log(`Animal swiped in the ${direction} direction`);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Profile</h2>
      </div>

      <div className="profile-section">
        <div>
          <strong>Name:</strong> <span>{user.name}</span>
        </div>
        <div>
          <strong>Email:</strong> <span>{user.email}</span>
        </div>
        <div>
          <strong>In-game Username:</strong> <span>{user.inGameUsername}</span>
        </div>
        <div>
          <strong>Server:</strong> <span>{user.server}</span>
        </div>
      </div>

      <div className="profile-section">
        <h3>Animals for Adoption</h3>
        {user.animalsForAdoption.length > 0 ? (
          <div className="animal-cards-container">
            {user.animalsForAdoption.map((animal) => (
              <AnimalCard
                key={animal._id}
                name={animal.name}
                level={animal.level}
                price={animal.price}
                stats={animal.stats}
                imageUrl={animal.imageUrl}
                onSwipe={handleSwipe}
                isSwipeable={false}
              />
            ))}
          </div>
        ) : (
          <p className="no-animals-message">No animals for adoption</p>
        )}
      </div>

      <div className="profile-section">
        <h3>Animals Adopted</h3>
        {user.adoptedAnimals.length > 0 ? (
          <div className="animal-cards-container">
            {user.adoptedAnimals.map((animal) => (
              <AnimalCard
                key={animal._id}
                name={animal.name}
                level={animal.level}
                price={animal.price}
                stats={animal.stats}
                imageUrl={animal.imageUrl}
                isSwipeable={false}
              />
            ))}
          </div>
        ) : (
          <p className="no-animals-message">No animals adopted yet</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
