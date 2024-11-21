const crypto = require('crypto');

const verifyTelegramWebAppData = (req, res, next) => {
  try {
    const { initData } = req.body;
    if (!initData) {
      return res.status(401).json({ error: 'No Telegram data provided' });
    }

    const data = new URLSearchParams(initData);
    const hash = data.get('hash');
    data.delete('hash');
    data.sort();

    const dataString = Array.from(data.entries())
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    const secretKey = crypto.createHmac('sha256', 'WebAppData')
      .update(process.env.BOT_TOKEN)
      .digest();

    const calculatedHash = crypto.createHmac('sha256', secretKey)
      .update(dataString)
      .digest('hex');

    if (calculatedHash !== hash) {
      return res.status(401).json({ error: 'Invalid Telegram data' });
    }

    req.telegramUser = JSON.parse(data.get('user'));
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

module.exports = verifyTelegramWebAppData;