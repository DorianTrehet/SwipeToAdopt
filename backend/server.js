const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Swipe = require('./models/Swipe');
const Animal = require('./models/Animal');
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

    // Vérifier s'il y a un match
    if (like_dislike) {
      const animal = await Animal.findById(animal_id).populate('upForAdoptionBy');
      if (animal && animal.upForAdoptionBy) {
        return res.status(200).json({
          message: 'Swipe enregistré avec succès',
          matchedUser: animal.upForAdoptionBy
        });
      }
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
  logger.info(`Récupération de l'utilisateur actuel: ${userId}`);
  console.log('Utilisateur récupéré:', userId);

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
  socket.on('sendMessage', ({ from, to, message }) => {
    io.emit('receiveMessage', { from, to, message });
  });
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