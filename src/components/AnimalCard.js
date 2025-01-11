import React from 'react';
import './AnimalCard.css';
import TinderCard from 'react-tinder-card';

const AnimalCard = ({ name, level, price, stats, imageUrl, onSwipe }) => {
  return (
    <TinderCard onSwipe={(dir) => onSwipe(dir)}>
      <div className="animal-card">
        <img src={imageUrl} alt={name} className="animal-image" />
        <h3>{name}</h3>
        <p>Niveau : {level}</p>
        <p>Prix : {price.toLocaleString('fr-FR')} Kamas</p>
        <div className="stats">
          <h4>Caractéristiques :</h4>
          <ul>
            {stats.map((stat, index) => (
              <li key={index}>
                {stat.name} : {stat.value}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </TinderCard>
  );
};

export default AnimalCard;
