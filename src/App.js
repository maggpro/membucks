import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Mining from './pages/Mining';
import Rating from './pages/Rating';
import Tasks from './pages/Tasks';
import About from './pages/About';
import { MiningProvider } from './context/MiningContext';
import './styles/App.css';

function App() {
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;

      // Включаем расширенный вид
      tg.expand();

      // Скрываем кнопку
      tg.MainButton.hide();

      // Сообщаем Telegram, что приложение готово
      tg.ready();

      // Устанавливаем начальный путь на /mining
      window.location.hash = '#/mining';
    }
  }, []);

  return (
    <MiningProvider>
      <HashRouter>
        <div className="app">
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/mining" replace />} />
              <Route path="/mining" element={<Mining />} />
              <Route path="/rating" element={<Rating />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </MiningProvider>
  );
}

export default App;