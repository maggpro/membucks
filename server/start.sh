#!/bin/bash

# Проверяем и устанавливаем зависимости
npm install

# Запускаем сервер в production режиме
NODE_ENV=production node index.js