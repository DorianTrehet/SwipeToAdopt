import React from 'react';
import { Link } from 'react-router-dom';
import './UserProfileCard.css';

const UserProfileCard = ({ user }) => {
  return (
    <Link to={`/profile/${user._id}`} className="user-profile-link">
      <div className="user-profile-card">
        <img src={user.profilePicture || '/default-avatar.png'} alt={user.name} className="user-profile-image" />
        <h3>{user.name}</h3>
        <p>{user.email}</p>
        <p>In-game Username: {user.inGameUsername}</p>
        <p>Server: {user.server}</p>
      </div>
    </Link>
  );
};

export default UserProfileCard;
