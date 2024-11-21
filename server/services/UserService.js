const User = require('../models/User');
const MiningHistory = require('../models/MiningHistory');
const { RedisService } = require('./redis');

class UserService {
  static async createUser(telegramId, username) {
    const user = new User({
      telegramId,
      username,
      referralCode: Math.random().toString(36).substring(7)
    });
    await user.save();
    return user;
  }

  static async updateMining(telegramId, reward) {
    const user = await User.findOneAndUpdate(
      { telegramId },
      {
        $inc: {
          balance: reward,
          totalMined: reward
        },
        lastMiningTime: new Date()
      },
      { new: true }
    );

    // Записываем в историю
    await MiningHistory.create({
      userId: user._id,
      telegramId,
      username: user.username,
      amount: reward,
      power: user.miningPower
    });

    // Обновляем кэш
    await RedisService.updateMiningStats(telegramId, {
      power: user.miningPower,
      lastReward: reward
    });

    return user;
  }

  static async updateEnergy(telegramId, energy) {
    const user = await User.findOneAndUpdate(
      { telegramId },
      {
        energy,
        lastEnergyUpdate: new Date()
      },
      { new: true }
    );

    await RedisService.setEnergy(telegramId, energy, user.maxEnergy);
    return user;
  }

  static async processReferral(referralCode, newUserId) {
    const referrer = await User.findOne({ referralCode });
    if (referrer) {
      await User.findByIdAndUpdate(referrer._id, {
        $inc: {
          activeReferrals: 1,
          maxEnergy: 20 // Бонус энергии за реферала
        }
      });
      await User.findByIdAndUpdate(newUserId, { referrer: referrer._id });
    }
  }
}

module.exports = UserService;