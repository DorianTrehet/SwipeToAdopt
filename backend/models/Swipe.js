const mongoose = require('mongoose');

const SwipeSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  animal_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
  like_dislike: { type: Boolean, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Swipe', SwipeSchema);