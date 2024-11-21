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
      tg.expand();
      tg.MainButton.hide();
      tg.ready();
    }
  }, []);

  return (
    <MiningProvider>
      <HashRouter>
        <div className="app">
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/mining" />} />
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