import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
        console.log('Token envoyé:', token);

        if (!token) {
          console.log('Token is missing. Redirecting to login.');
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
        console.error('Error fetching user data:', error);
        if (error.response && error.response.status === 401) {
          console.log('Token is invalid or expired. Redirecting to login.');
          window.location.href = '/login';
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      <h2>Profile</h2>
      <div>
        <div>
          <strong>Name: </strong>
          <span>{user.name}</span>
        </div>

        <div>
          <strong>Email: </strong>
          <span>{user.email}</span>
        </div>

        <div>
          <strong>In-game Username: </strong>
          <span>{user.inGameUsername}</span>
        </div>

        <div>
          <strong>Server: </strong>
          <span>{user.server}</span>
        </div>
      </div>

      <div>
        <h3>Animals for Adoption</h3>
        {user.animalsForAdoption.length > 0 ? (
          <ul>
            {user.animalsForAdoption.map((animal, index) => (
              <li key={index}>{animal.name} - {animal.race}</li>
            ))}
          </ul>
        ) : (
          <p>No animals for adoption</p>
        )}
      </div>

      <div>
        <h3>Adopted Animals</h3>
        {user.adoptedAnimals.length > 0 ? (
          <ul>
            {user.adoptedAnimals.map((animal, index) => (
              <li key={index}>{animal.name} - {animal.race}</li>
            ))}
          </ul>
        ) : (
          <p>No animals adopted</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
