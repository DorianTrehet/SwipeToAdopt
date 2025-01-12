// UserProfileCard.js
import React from 'react';
import './UserProfileCard.css';

const UserProfileCard = ({ user }) => {
  return (
    <div className="user-profile-card">
      <img src={user.profilePicture || '/default-avatar.png'} alt={user.name} className="user-profile-image" />
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <p>In-game Username: {user.inGameUsername}</p>
      <p>Server: {user.server}</p>
    </div>
  );
};

export default UserProfileCard;
