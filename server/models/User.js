const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  telegramId: {
    type: Number,
    required: true,
    unique: true
  },
  username: String,
  balance: {
    type: Number,
    default: 0
  },
  equipment: {
    type: Number,
    default: 0
  },
  miningPower: {
    type: Number,
    default: 0
  },
  maxEnergy: {
    type: Number,
    default: 100
  },
  energy: {
    type: Number,
    default: 100
  },
  totalMined: {
    type: Number,
    default: 0
  },
  referralCode: String,
  referrer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  activeReferrals: {
    type: Number,
    default: 0
  },
  completedTasks: [{
    type: String,
    enum: ['channel_subscription', 'folder_subscription']
  }],
  lastMiningTime: Date,
  lastEnergyUpdate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
});

// Индексы для оптимизации запросов
UserSchema.index({ totalMined: -1 });
UserSchema.index({ telegramId: 1 });
UserSchema.index({ referralCode: 1 });

module.exports = mongoose.model('User', UserSchema);