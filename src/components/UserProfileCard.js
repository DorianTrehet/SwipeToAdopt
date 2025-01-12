import React from 'react';
import { Link } from 'react-router-dom';
import './UserProfileCard.css';

const UserProfileCard = ({ user }) => {
  return (
    <Link to={`/profile/${user._id}`} className="user-profile-link">
      <div className="user-profile-card">
        <h3>{user.name}</h3>
        <p><strong>In-game Username: </strong>{user.inGameUsername}</p>
        <p><strong>Server: </strong>{user.server}</p>
      </div>
    </Link>
  );
};

export default UserProfileCard;
