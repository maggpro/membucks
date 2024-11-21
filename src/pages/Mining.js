import React from 'react';
import { useMining } from '../context/MiningContext';
import './Mining.css';

// Иконка звезды в SVG формате
const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
  </svg>
);

function Mining() {
  const {
    balance,
    miningPower,
    isActive,
    energy,
    maxEnergy,
    equipment,
    cycleReward,
    totalMined,
    minersOnline,
    miningHistory,
    TOTAL_SUPPLY,
    setIsActive,
    setEnergy,
    setMaxEnergy,
    buyEquipment
  } = useMining();

  // Форматирование больших чисел
  const formatLargeNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(Math.floor(num));
  };

  // Форматирование маленьких чисел (6 знаков после запятой)
  const formatSmallNumber = (num) => {
    return (num % 1).toFixed(6).substring(2);
  };

  const handleRecharge = () => {
    setMaxEnergy(prev => {
      const newMaxEnergy = prev + 100;
      setEnergy(newMaxEnergy);
      return newMaxEnergy;
    });
  };

  // Функция форматирования времени в UTC
  const formatUTCTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      timeZone: 'UTC',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleStartMining = () => {
    if (equipment === 0) {
      alert('Для начала майнинга необходимо купить оборудование');
      return;
    }
    setIsActive(true);
  };

  return (
    <div className="mining-page">
      <div className="profile-block">
        <div className="balance-container">
          <h2>Баланс</h2>
          <p className="balance-value">{balance.toFixed(8)} $Bucks</p>
        </div>

        <div className="energy-container">
          <div className="energy-header">
            <h2>Энергия</h2>
            <span className="energy-value">{Math.floor(energy)}/{maxEnergy}</span>
          </div>
          <div className="energy-bar-wrapper">
            <div
              className="energy-bar"
              style={{ width: `${(energy / maxEnergy) * 100}%` }}
            />
          </div>
          <button
            className="recharge-button"
            onClick={handleRecharge}
          >
            Заполнить - 300<StarIcon />
          </button>
        </div>
      </div>

      {/* Добавляем блок информации о монете */}
      <div className="coin-info-block">
        <h2>$Bucks</h2>
        <div className="emission-info">
          <div className="emission-header">
            <span>Эмиссия</span>
            <span className="total-supply">{formatLargeNumber(TOTAL_SUPPLY)} $Bucks</span>
          </div>
          <div className="emission-progress-wrapper">
            <div
              className="emission-progress"
              style={{ width: `${(totalMined / TOTAL_SUPPLY) * 100}%` }}
            />
          </div>
          <div className="emission-details">
            <span>Добыто: {formatLargeNumber(totalMined)}.{formatSmallNumber(totalMined)} $Bucks</span>
          </div>
        </div>
        <div className="miners-online">
          <span className="miners-label">Майнеров онлайн:</span>
          <span className="miners-count">{minersOnline}</span>
        </div>
      </div>

      {/* Добавляем блок информации о майнинге */}
      <div className="mining-info-block">
        <div className="mining-power-info">
          <div className="info-row">
            <span>Мощность майнинга</span>
            <span className="value">{miningPower.toFixed(1)} MH/s</span>
          </div>
          <div className="info-row">
            <span>Оборудование</span>
            <div className="equipment-control">
              <span>{equipment} шт.</span>
              <button className="buy-button" onClick={buyEquipment}>
                Купить - 300<StarIcon />
              </button>
            </div>
          </div>
          <div className="info-row">
            <span>Добыча за цикл</span>
            <span className="value">{cycleReward.toFixed(6)} $Bucks</span>
          </div>
        </div>

        <button
          className={`mining-control-button ${isActive ? 'active' : ''}`}
          onClick={isActive ? () => setIsActive(false) : handleStartMining}
          disabled={energy <= 0}
        >
          {isActive ? 'Остановить майнинг' : 'Запустить майнинг'}
        </button>
      </div>

      {/* Добавляем блок истории добычи */}
      <div className="mining-history-block">
        <h2>История добычи</h2>
        <div className="history-list">
          {miningHistory.map(record => (
            <div key={record.id} className="history-item">
              <div className="history-header">
                <span className="history-user">{record.username}</span>
                <span className="history-time">{formatUTCTime(record.timestamp)}</span>
              </div>
              <div className="history-details">
                <span className="history-power">Мощность: {record.power.toFixed(1)}</span>
                <span className="history-reward">{record.reward.toFixed(6)} $Bucks</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Mining;