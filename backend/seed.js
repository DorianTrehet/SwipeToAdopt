// seed.js
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

  // Create users with predefined passwords
  const users = [
    { email: 'user1@example.com', password: 'password1', name: 'User One' },
    { email: 'user2@example.com', password: 'password2', name: 'User Two' },
    { email: 'user3@example.com', password: 'password3', name: 'User Three' },
  ];

  for (let user of users) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }

  const createdUsers = await User.insertMany(users);
  console.log('Users added successfully');

  // Liste des races d'animaux possibles
  const races = ['Golden Retriever', 'Chihuahua', 'Bulldog Anglais', 'Siamois', 'Beagle', 'Persan', 'Maine Coon', 'Rottweiler', 'Dalmatien', 'Cocker Spaniel'];

  // Liste des likes possibles
  const likes = ['Jouer', 'Câlins', 'Nager', 'Manger', 'Explorer', 'Dormir', 'Gratter', 'Jouer à la balle', 'Chasser des souris'];

  // Liste des dislikes possibles
  const dislikes = ['Chats', 'Eau', 'Bruits forts', 'Vélo', 'Orages', 'Autres animaux', 'Enfants bruyants'];

  // Fonction pour générer un animal aléatoire
  const generateAnimal = (index, userId) => {
    const name = `Animal-${index + 1}`;
    const age = Math.floor(Math.random() * 10) + 1; // Âge entre 1 et 10
    const race = races[Math.floor(Math.random() * races.length)];
    const likesArray = [likes[Math.floor(Math.random() * likes.length)]];
    const dislikesArray = [dislikes[Math.floor(Math.random() * dislikes.length)]];

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
      age,
      race,
      imageUrl: getRandomImageUrl(),
      likes: likesArray,
      dislikes: dislikesArray,
      upForAdoptionBy: userId,
    };
  };

  // Générer 40 animaux et assigner certains à des utilisateurs pour adoption
  const animals = [];
  for (let i = 0; i < 40; i++) {
    const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    const animal = generateAnimal(i, randomUser._id);
    animals.push(animal);
    randomUser.animalsForAdoption.push(animal._id);
  }

  const createdAnimals = await Animal.insertMany(animals);
  console.log('Animals added successfully');

  // Update users with their animals for adoption
  for (let user of createdUsers) {
    await user.save();
  }

  // Example of creating a new chat message
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