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
    // Проверяем, запущено ли приложение в Telegram WebApp
    const isTelegramWebApp = window.Telegram?.WebApp;

    if (isTelegramWebApp) {
      const tg = window.Telegram.WebApp;

      // Расширяем приложение
      tg.expand();

      // Проверяем поддержку полноэкранного режима
      if (tg.platform !== 'unknown' && tg.version >= '6.1') {
        try {
          // Переходим в полноэкранный режим
          tg.requestFullscreen();

          // Отключаем свайпы для закрытия
          if (tg.disableVerticalSwipes) {
            tg.disableVerticalSwipes();
          }
        } catch (error) {
          console.log('Fullscreen not supported');
        }
      }

      // Скрываем главную кнопку
      tg.MainButton.hide();

      // Устанавливаем цвет хедера и фона
      if (tg.setHeaderColor && tg.themeParams?.bg_color) {
        tg.setHeaderColor(tg.themeParams.bg_color);
      }
      if (tg.setBackgroundColor && tg.themeParams?.bg_color) {
        tg.setBackgroundColor(tg.themeParams.bg_color);
      }

      // Включаем подтверждение закрытия
      if (tg.enableClosingConfirmation) {
        tg.enableClosingConfirmation();
      }

      // Сообщаем что приложение готово
      tg.ready();

      // Обработчик изменения полноэкранного режима
      if (tg.onEvent) {
        tg.onEvent('fullscreenChanged', () => {
          if (!tg.isFullscreen && tg.requestFullscreen) {
            tg.requestFullscreen();
          }
        });

        // Обработчик изменения безопасной зоны
        tg.onEvent('contentSafeAreaChanged', () => {
          if (tg.contentSafeAreaInset) {
            document.documentElement.style.setProperty(
              '--tg-content-safe-area-top',
              `${tg.contentSafeAreaInset.top}px`
            );
          }
        });
      }
    }

    // Устанавливаем начальный путь
    window.location.hash = '#/mining';
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