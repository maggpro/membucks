const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('MongoDB подключена');

    // Создаем индексы
    const User = require('../models/User');
    await User.createIndexes();

    const MiningHistory = require('../models/MiningHistory');
    await MiningHistory.createIndexes();

  } catch (error) {
    console.error('Ошибка подключения к MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;