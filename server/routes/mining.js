const express = require('express');
const router = express.Router();
const UserService = require('../services/UserService');
const { RedisService } = require('../services/redis');
const verifyTelegramWebAppData = require('../middleware/authMiddleware');

router.post('/start', verifyTelegramWebAppData, async (req, res) => {
  try {
    const { telegramId } = req.telegramUser;
    const sessionData = await RedisService.setUserSession(telegramId, {
      isActive: true,
      tabId: req.body.tabId
    });
    res.json({ success: true, session: sessionData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/stop', verifyTelegramWebAppData, async (req, res) => {
  try {
    const { telegramId } = req.telegramUser;
    await RedisService.setUserSession(telegramId, {
      isActive: false,
      tabId: req.body.tabId
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/update', verifyTelegramWebAppData, async (req, res) => {
  try {
    const { telegramId } = req.telegramUser;
    const { reward } = req.body;
    const user = await UserService.updateMining(telegramId, reward);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;