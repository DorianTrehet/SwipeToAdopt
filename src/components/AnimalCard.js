import React, { useState } from 'react';
import './AnimalCard.css';
import TinderCard from 'react-tinder-card';

const AnimalCard = ({ name, level, price, stats, imageUrl, onSwipe, isSwipeable = true }) => {
  const [showHeart, setShowHeart] = useState(false);

  const handleSwipe = (dir) => {
    if (dir === 'right') {
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 500);  // Cache le cœur après l'animation
    }
    onSwipe(dir);
  };

  const cardContent = (
    <div className="animal-card">
      {showHeart && <div className="heart-animation">❤️</div>}
      <img src={imageUrl} alt={name} className="animal-image" />
      <h3>{name}</h3>
      <p>Niveau : {level}</p>
      <div className="stats">
        <h4>Caractéristiques :</h4>
        {stats.map((stat, index) => (
          <p key={index}>
            {stat.name} : {stat.value}
          </p>
        ))}
        <h4>Prix : {price.toLocaleString('fr-FR')} Kamas</h4>
      </div>
    </div>
  );

  return isSwipeable ? (
    <TinderCard onSwipe={handleSwipe}>
      {cardContent}
    </TinderCard>
  ) : (
    <div>{cardContent}</div>
  );
};

export default AnimalCard;
