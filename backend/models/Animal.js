const mongoose = require('mongoose');

const AnimalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stats: [
    {
      name: { type: String, required: true },
      value: { type: Number, required: true }
    }
  ],
  level: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  upForAdoptionBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  adoptedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Animal', AnimalSchema);
