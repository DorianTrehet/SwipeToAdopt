// Profile.js
import React, { useState, useEffect } from 'react';

const Profile = () => {
  // Exemple d'état pour les informations du profil
  const [user, setUser] = useState({
    name: '',
    email: '',
  });

  // Simulation de récupération des données utilisateur (à remplacer par une API réelle)
  useEffect(() => {
    // Ici, on suppose que les informations sont récupérées depuis un localStorage ou une API.
    const storedUser = {
      name: 'John Doe', // Exemple de nom
      email: 'johndoe@example.com', // Exemple d'email
    };
    setUser(storedUser);
  }, []);

  // État pour l'édition des informations
  const [isEditing, setIsEditing] = useState(false);
  const [newUserData, setNewUserData] = useState({ ...user });

  // Fonction pour gérer le changement des champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUserData({ ...newUserData, [name]: value });
  };

  // Fonction pour enregistrer les modifications
  const handleSave = () => {
    setUser({ ...newUserData });
    setIsEditing(false);
    // Vous pourriez envoyer ici les données mises à jour à une API ou les sauvegarder dans un localStorage.
  };

  return (
    <div>
      <h2>Profile</h2>
      {/* Affichage des informations utilisateur */}
      <div>
        <div>
          <strong>Name: </strong>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={newUserData.name}
              onChange={handleChange}
            />
          ) : (
            <span>{user.name}</span>
          )}
        </div>

        <div>
          <strong>Email: </strong>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={newUserData.email}
              onChange={handleChange}
            />
          ) : (
            <span>{user.email}</span>
          )}
        </div>
      </div>

      {/* Boutons pour éditer ou enregistrer */}
      <div>
        {isEditing ? (
          <button onClick={handleSave}>Save</button>
        ) : (
          <button onClick={() => setIsEditing(true)}>Edit</button>
        )}
      </div>
    </div>
  );
};

export default Profile;
