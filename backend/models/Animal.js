const mongoose = require('mongoose');

const AnimalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  race: { type: String, required: true },
  age: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  likes: { type: Array, default: [] },
  dislikes: { type: Array, default: [] },
  upForAdoptionBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  adoptedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Animal', AnimalSchema);