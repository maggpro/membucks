const Redis = require('ioredis');
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
});

const KEYS = {
  USER_SESSION: 'user:session:',
  USER_MINING: 'user:mining:',
  USER_ENERGY: 'user:energy:',
  GLOBAL_RATING: 'global:rating',
  ONLINE_MINERS: 'miners:online',
  MINING_STATS: 'mining:stats'
};

const RedisService = {
  // Сессии пользователей
  async setUserSession(telegramId, data) {
    await redis.hset(`${KEYS.USER_SESSION}${telegramId}`, {
      isActive: data.isActive.toString(),
      lastUpdate: Date.now().toString(),
      tabId: data.tabId
    });
    await redis.expire(`${KEYS.USER_SESSION}${telegramId}`, 3600); // TTL 1 час
  },

  // Майнинг статистика
  async updateMiningStats(telegramId, data) {
    await redis.hset(`${KEYS.USER_MINING}${telegramId}`, {
      power: data.power.toString(),
      lastReward: data.lastReward.toString(),
      timestamp: Date.now().toString()
    });
  },

  // Энергия
  async setEnergy(telegramId, energy, maxEnergy) {
    await redis.hset(`${KEYS.USER_ENERGY}${telegramId}`, {
      current: energy.toString(),
      max: maxEnergy.toString(),
      lastUpdate: Date.now().toString()
    });
  },

  // Рейтинг
  async updateRating() {
    const users = await User.find()
      .sort({ totalMined: -1 })
      .limit(100)
      .select('username totalMined miningPower equipment');

    await redis.set(KEYS.GLOBAL_RATING, JSON.stringify(users), 'EX', 60);
  },

  // Онлайн майнеры
  async updateOnlineMiners(count) {
    await redis.set(KEYS.ONLINE_MINERS, count.toString());
  }
};

module.exports = { redis, RedisService, KEYS };