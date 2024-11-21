const express = require('express');
const router = express.Router();
const User = require('../models/User');
const MiningHistory = require('../models/MiningHistory');
const { RedisService } = require('../services/redis');
const redis = require('redis');

// Middleware для проверки админа
const isAdmin = (req, res, next) => {
  const { adminKey } = req.headers;
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Получить статистику
router.get('/stats', isAdmin, async (req, res) => {
  try {
    const stats = {
      totalUsers: await User.countDocuments(),
      totalMined: await User.aggregate([
        { $group: { _id: null, total: { $sum: '$totalMined' } } }
      ]),
      activeMiners: await RedisService.getOnlineMiners(),
      topMiners: await User.find()
        .sort({ totalMined: -1 })
        .limit(10)
        .select('username totalMined miningPower equipment')
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Получить данные пользователя
router.get('/user/:telegramId', isAdmin, async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const miningHistory = await MiningHistory.find({ userId: user._id })
      .sort({ timestamp: -1 })
      .limit(50);

    res.json({ user, miningHistory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Получить все данные
router.get('/debug/all', isAdmin, async (req, res) => {
  try {
    const data = {
      users: await User.find(),
      miningHistory: await MiningHistory.find().sort({ timestamp: -1 }).limit(100),
      onlineMiners: await RedisService.getOnlineMiners(),
      rating: JSON.parse(await redis.get('global:rating') || '[]')
    };
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Поиск пользователя
router.get('/debug/user/:telegramId', isAdmin, async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId });
    const history = await MiningHistory.find({ userId: user._id })
      .sort({ timestamp: -1 })
      .limit(50);
    const sessionData = await redis.hgetall(`user:session:${req.params.telegramId}`);

    res.json({
      user,
      history,
      sessionData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;