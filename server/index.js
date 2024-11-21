require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const miningRoutes = require('./routes/mining');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3001;

// Подключаем базу данных
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Роуты
app.use('/api/mining', miningRoutes);
app.use('/api/admin', adminRoutes);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});