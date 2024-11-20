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
    tg.ready();

    // Расширяем на всю высоту
    tg.expand();

    // Запрашиваем полноэкранный режим
    tg.requestFullscreen();

    // Обработчик изменения полноэкранного режима
    tg.onEvent('fullscreenChanged', () => {
      if (tg.isFullscreen) {
        console.log('Приложение в полноэкранном режиме');
      }
    });

    // Обработчик ошибки перехода в полноэкранный режим
    tg.onEvent('fullscreenFailed', () => {
      console.log('Не удалось перейти в полноэкранный режим');
    });

    tg.MainButton.setParams({
      text: 'НАЧАТЬ МАЙНИНГ',
      color: '#00ff9d',
    });
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