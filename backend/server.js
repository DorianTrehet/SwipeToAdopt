const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Swipe = require('./models/Swipe');
const Animal = require('./models/Animal');
const Chat = require('./models/Chat');
const authenticateJWT = require('./middleware/auth');
const User = require('./models/User');
const winston = require('winston');
const http = require('http');
const cors = require('cors'); 
const app = express();
const server = http.createServer(app);

// ==============================
// Database Connection
// ==============================
mongoose.connect('mongodb+srv://doriantrehet:PtmYNmhD4m4gRrY0@cluster0.v6how.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à la base de données réussie'))
  .catch((error) => console.error('Erreur de connexion à la base de données:', error));

// ==============================
// Middleware
// ==============================
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

// ==============================
// Logger Configuration
// ==============================
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// ==============================
// Routes for Users
// ==============================
app.get('/users', authenticateJWT, async (req, res) => {
  try {
    // Récupérer tous les utilisateurs, en excluant le mot de passe et en incluant les animaux
    const users = await User.find()
      .select('-password')
      .populate('animalsForAdoption')
      .populate('adoptedAnimals');

    res.status(200).json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).send('Erreur lors de la récupération des utilisateurs');
  }
});

// ==============================
// Routes for Animals
// ==============================
app.post('/animals', authenticateJWT, async (req, res) => {
  const { name, level, price, stats, imageUrl } = req.body;
  const userId = req.user.id;

  try {
    const animal = new Animal({
      name,
      level,
      price,
      stats,
      imageUrl,
      upForAdoptionBy: userId
    });
    await animal.save();

    // Ajouter l'animal à la liste des animaux à adopter de l'utilisateur
    await User.findByIdAndUpdate(userId, { $push: { animalsForAdoption: animal._id } });

    res.status(201).send(animal);
  } catch (error) {
    console.error('Erreur lors de la création de l\'animal:', error);
    res.status(500).send('Erreur lors de la création de l\'animal');
  }
});

app.get('/animals', authenticateJWT, async (req, res) => {
  const userId = req.user.id;

  try {
    // Récupérer les ID des animaux déjà swipés par l'utilisateur
    const swipedAnimals = await Swipe.find({ user_id: userId }).distinct('animal_id');

    // Récupérer les animaux non publiés par l'utilisateur actuel et non swipés
    const animals = await Animal.find({
      upForAdoptionBy: { $ne: userId },
      _id: { $nin: swipedAnimals }
    });

    res.status(200).send(animals);
  } catch (error) {
    console.error('Erreur lors de la récupération des animaux:', error);
    res.status(500).send('Erreur lors de la récupération des animaux');
  }
});

// ==============================
// Routes for Swipes
// ==============================
app.post('/swipes', authenticateJWT, async (req, res) => {
  const { animal_id, like_dislike } = req.body;
  const userId = req.user.id;

  try {
    // Vérifier si le swipe existe déjà
    const existingSwipe = await Swipe.findOne({ user_id: userId, animal_id });
    if (existingSwipe) {
      return res.status(400).send('Vous avez déjà swipé cet animal');
    }

    // Enregistrer le nouveau swipe
    const newSwipe = new Swipe({
      user_id: userId,
      animal_id,
      like_dislike
    });
    await newSwipe.save();

    // Vérifier si l'utilisateur a aimé l'animal (swipe à droite)
    if (like_dislike) {
      const animal = await Animal.findById(animal_id);
      if (!animal) {
        return res.status(404).send('Animal non trouvé');
      }

      // Ajouter l'animal dans la liste des animaux adoptés de l'utilisateur
      const user = await User.findById(userId);
      user.adoptedAnimals.push(animal_id);
      await user.save();

      // Retourner l'animal adopté pour la réponse
      return res.status(200).json({
        message: 'Swipe enregistré avec succès',
        adoptedAnimal: animal
      });
    }

    res.status(200).send('Swipe enregistré avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du swipe:', error);
    res.status(500).send('Erreur lors de l\'enregistrement du swipe');
  }
});

// ==============================
// Routes for Current User
// ==============================
app.get('/current-user', authenticateJWT, async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId)
      .populate('animalsForAdoption')
      .populate('adoptedAnimals');

    if (!user) {
      logger.error(`Utilisateur non trouvé: ${userId}`);
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (err) {
    logger.error(`Erreur lors de la récupération de l'utilisateur: ${err}`);
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur' });
  }
});

// ==============================
// Authentication Routes
// ==============================
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// ==============================
// Socket.io Configuration
// ==============================
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('Un nouveau client est connecté :', socket.id);

  // Lorsque le message est envoyé, on l'enregistre dans la base de données
  socket.on('sendMessage', async ({ from, to, message }) => {
    const newMessage = new Chat({
      from,
      to,
      message,
    });

    try {
      // Sauvegarder le message dans la base de données
      await newMessage.save();
      console.log('Message enregistré:', newMessage);

      // Créer une room unique pour chaque paire d'utilisateurs
      const room = [from, to].sort().join('-'); // La room est identifiée par les noms des utilisateurs, triés pour garantir une clé unique

      // Joindre la room
      socket.join(room);

      // Émettre le message à la room correspondante
      io.to(room).emit('receiveMessage', { from, to, message });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du message:', error);
    }
  });

  // Gérer la déconnexion des utilisateurs
  socket.on('disconnect', () => {
    console.log('Client déconnecté :', socket.id);
  });
});

// ==============================
// Start Server
// ==============================
const port = process.env.PORT || 5000;
server.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});