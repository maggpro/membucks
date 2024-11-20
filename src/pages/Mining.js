import React, { useState, useEffect } from 'react';
import './Mining.css';

function Mining() {
  const [balance, setBalance] = useState(0);
  const [miningPower, setMiningPower] = useState(1);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const tg = window.Telegram.WebApp;

    // Показываем кнопку при входе на страницу
    tg.MainButton.show();

    // Обработчик нажатия на главную кнопку
    const handleMainButton = () => {
      setIsActive(!isActive);
      if (!isActive) {
        tg.MainButton.setParams({
          text: 'ОСТАНОВИТЬ МАЙНИНГ',
          color: '#ff4444'
        });
      } else {
        tg.MainButton.setParams({
          text: 'НАЧАТЬ МАЙНИНГ',
          color: '#00ff9d'
        });
      }
    };

    tg.MainButton.onClick(handleMainButton);

    return () => {
      tg.MainButton.offClick(handleMainButton);
    };
  }, [isActive]);

  // Эффект для майнинга
  useEffect(() => {
    let miningInterval;
    if (isActive) {
      miningInterval = setInterval(() => {
        setBalance(prev => prev + miningPower);
      }, 1000);
    }
    return () => clearInterval(miningInterval);
  }, [isActive, miningPower]);

  return (
    <div className="mining-page">
      <div className="mining-stats">
        <div className="balance">
          <h2>Баланс</h2>
          <p className="value">{balance.toFixed(2)} MB</p>
        </div>
        <div className="mining-power">
          <h2>Мощность</h2>
          <p className="value">{miningPower.toFixed(2)} MB/s</p>
        </div>
      </div>
      <div className="mining-status">
        <div className={`status-indicator ${isActive ? 'active' : ''}`}>
          {isActive ? 'МАЙНИНГ АКТИВЕН' : 'МАЙНИНГ ОСТАНОВЛЕН'}
        </div>
      </div>
    </div>
  );
}

export default Mining;