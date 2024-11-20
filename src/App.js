import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Mining from './pages/Mining';
import Tasks from './pages/Tasks';
import About from './pages/About';
import './styles/App.css';

function App() {
  useEffect(() => {
    // Инициализация Telegram WebApp
    const tg = window.Telegram.WebApp;

    // Настраиваем параметры отображения
    tg.setHeaderColor('#1a1a1a'); // Устанавливаем цвет хедера
    tg.setBackgroundColor('#1a1a1a'); // Устанавливаем цвет фона

    // Включаем расширенный вид
    tg.expand();

    // Настраиваем параметры приложения
    tg.MainButton.setParams({
      text: 'НАЧАТЬ МАЙНИНГ',
      color: '#00ff9d',
      text_color: '#1a1a1a',
      is_visible: true,
      is_active: true
    });

    // Настраиваем viewport
    tg.viewportStableHeight = true;

    // Сообщаем Telegram, что приложение готово
    tg.ready();
  }, []);

  return (
    <HashRouter>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Mining />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;