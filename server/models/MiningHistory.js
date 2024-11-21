const mongoose = require('mongoose');

const MiningHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  telegramId: Number,
  username: String,
  amount: Number,
  power: Number,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Индекс для быстрого поиска по времени
MiningHistorySchema.index({ timestamp: -1 });
MiningHistorySchema.index({ userId: 1 });

module.exports = mongoose.model('MiningHistory', MiningHistorySchema);