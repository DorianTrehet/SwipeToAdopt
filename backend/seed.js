const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Animal = require('./models/Animal');
const User = require('./models/User');
const Chat = require('./models/Chat');

// Connexion à la base de données MongoDB
mongoose.connect('mongodb+srv://doriantrehet:PtmYNmhD4m4gRrY0@cluster0.v6how.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log('Connexion à la base de données réussie');

    // Liste des serveurs possibles dans le jeu
    const servers = ['Agride', 'Echo', 'Ilyzaelle', 'Jahash', 'Merkator'];

    // Générer des utilisateurs avec des données adaptées au nouveau schéma
    const users = [
      { email: 'user1@example.com', password: 'password1', name: 'User One', inGameUsername: 'PlayerOne', server: servers[0] },
      { email: 'user2@example.com', password: 'password2', name: 'User Two', inGameUsername: 'PlayerTwo', server: servers[1] },
      { email: 'user3@example.com', password: 'password3', name: 'User Three', inGameUsername: 'PlayerThree', server: servers[2] },
    ];

    for (let user of users) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }

    const createdUsers = await User.insertMany(users);
    console.log('Users added successfully');

    // Fonction pour générer des caractéristiques aléatoires
    const generateRandomStats = () => {
      const possibleStats = ['vitalité', 'sagesse', 'force', 'intelligence', 'chance', 'agilité', 'puissance', 'initiative', 'prospection', 'portée', 'invocations', 'tacle', 'fuite', 'dommages fixes', 'dommages critiques', 'dommages de poussée', 'dommages pièges', 'dommages %', 'dommages mélée', 'dommages distance', 'résistance neutre', 'résistance terre', 'résistance feu', 'résistance eau', 'résistance air', 'résistance critique', 'résistance poussée', 'résistance mêlée', 'résistance distance', 'soins', 'PA', 'PM', 'vol de vie'];
      const stats = [];
      const numStats = Math.floor(Math.random() * 2) + 1;

      for (let i = 0; i < numStats; i++) {
        const statName = possibleStats[Math.floor(Math.random() * possibleStats.length)];
        let statValue;

        if (statName === 'PA' || statName === 'PM') {
          statValue = 1;
        } else if (statName === 'portée' || statName === 'invocations') {
          statValue = Math.floor(Math.random() * 2) + 1;
        } else if (['dommages %', 'dommages mélée', 'dommages distance'].includes(statName)) {
          statValue = Math.floor(Math.random() * 10) + 1;
        } else {
          statValue = Math.floor(Math.random() * 100) + 1;
        }

        stats.push({ name: statName, value: statValue });
      }

      return stats;
    };

    // Fonction pour générer un animal aléatoire
    const generateAnimal = (index, userId) => {
      const name = `Animal-${index + 1}`;
      const level = Math.floor(Math.random() * 100) + 1;
      const price = Math.floor(Math.random() * 10000000) + 10000;

      const imageUrls = [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_355Bxco8BS6QRwljw55J9QxCBXnYvNujHg&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAOBTqdLa837UiB80UllQGUSbS-xoorn_P9w&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQM-izjpqR4u1CZuWGMCrBMD81MRvK-2lqurw&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS62BijnD3BY5Pm7tdWnjNihUdvXE0FOz7RxA&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwfphji0n9AVRGzdpMW6sbu9b4h_54F6Zdvw&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp4O0i_T_m8y_8fh3eHS9pN-3OhJRqkELHwg&s'
      ];

      const getRandomImageUrl = () => {
        const randomIndex = Math.floor(Math.random() * imageUrls.length);
        return imageUrls[randomIndex];
      };

      return {
        name,
        price,
        stats: generateRandomStats(),
        level,
        imageUrl: getRandomImageUrl(),
        upForAdoptionBy: userId,
      };
    };

    // Générer 40 animaux et les assigner à des utilisateurs
    const animals = [];
    for (let i = 0; i < 40; i++) {
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const animal = generateAnimal(i, randomUser._id);
      animals.push(animal);
    }

    // Insérer les animaux dans la base de données
    const createdAnimals = await Animal.insertMany(animals);
    console.log('Animals added successfully');

    // Mettre à jour les utilisateurs avec les IDs des animaux qu'ils ont mis en adoption
    for (let animal of createdAnimals) {
      await User.updateOne(
        { _id: animal.upForAdoptionBy },
        { $push: { animalsForAdoption: animal._id } }
      );
    }
    console.log('Users updated successfully');


    // Exemple de création d'un message dans un chat
    const newChat = new Chat({
      from: createdUsers[0]._id,
      to: createdUsers[1]._id,
      message: 'Hello, how are you?',
    });

    await newChat.save();
    console.log('Chat message saved successfully');

    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('Erreur de connexion à la base de données:', error);
    mongoose.connection.close();
  });
