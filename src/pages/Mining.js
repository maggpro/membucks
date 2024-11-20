import React, { useState, useEffect } from 'react';
import './Mining.css';

// Иконка звезды в SVG формате
const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
  </svg>
);

function Mining() {
  const [balance, setBalance] = useState(0);
  const [miningPower, setMiningPower] = useState(1);
  const [isActive, setIsActive] = useState(false);
  const [energy, setEnergy] = useState(100);
  const [maxEnergy, setMaxEnergy] = useState(100);
  const [isRecharging, setIsRecharging] = useState(false);
  const [rechargeTimeLeft, setRechargeTimeLeft] = useState(0);

  // Добавляем состояния для информации о монете
  const TOTAL_SUPPLY = 1000000; // Общая эмиссия
  const [totalMined, setTotalMined] = useState(156842.123456); // Пример добытых монет
  const [minersOnline, setMinersOnline] = useState(127); // Пример онлайн майнеров

  // Добавляем новые состояния для оборудования и майнинга
  const [equipment, setEquipment] = useState(1); // Количество оборудования
  const [cycleReward, setCycleReward] = useState(0); // Награда за текущий цикл
  const [lastCycleTime, setLastCycleTime] = useState(0); // Время последнего цикла
  const BASE_CYCLE_REWARD = 0.1; // Базовая награда за цикл

  // Добавляем состояние для истории добычи
  const [miningHistory, setMiningHistory] = useState([
    {
      id: 1,
      username: 'John Doe',
      power: 32.0,
      reward: 2.675128
    },
    {
      id: 2,
      username: 'Alice Smith',
      power: 45.5,
      reward: 3.892456
    },
    // Примеры записей
  ]);

  // Форматирование больших чисел
  const formatLargeNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(Math.floor(num));
  };

  // Форматирование маленьких чисел (6 знаков после запятой)
  const formatSmallNumber = (num) => {
    return (num % 1).toFixed(6).substring(2);
  };

  // Обработка восстановления энергии
  useEffect(() => {
    let rechargeInterval;
    if (isRecharging && energy < maxEnergy) {
      const rechargeTime = 3 * 60 * 60 * 1000; // 3 часа в миллисекундах
      const incrementPerSecond = maxEnergy / (rechargeTime / 1000);

      rechargeInterval = setInterval(() => {
        setEnergy(prev => {
          const newEnergy = prev + incrementPerSecond;
          if (newEnergy >= maxEnergy) {
            setIsRecharging(false);
            return maxEnergy;
          }
          return newEnergy;
        });

        setRechargeTimeLeft(prev => {
          const newTime = prev - 1000;
          return newTime > 0 ? newTime : 0;
        });
      }, 1000);
    }
    return () => clearInterval(rechargeInterval);
  }, [isRecharging, maxEnergy]);

  // Функция для расчета слуайной награды за цикл
  const calculateCycleReward = () => {
    const variance = BASE_CYCLE_REWARD * 0.2; // 20% вариация
    const minReward = BASE_CYCLE_REWARD - variance;
    const maxReward = BASE_CYCLE_REWARD + variance;
    return minReward + Math.random() * (maxReward - minReward);
  };

  // Функция для покупки оборудования
  const buyEquipment = () => {
    // Здесь будет проверка и списание Telegram Stars
    setEquipment(prev => prev + 1);
    setMiningPower(prev => prev + 1);
  };

  // Обновляем эффект майнинга
  useEffect(() => {
    let miningInterval;
    if (isActive && energy > 0) {
      miningInterval = setInterval(() => {
        // Генерируем случайное время цикла (3-5 секунд)
        const cycleTime = 3000 + Math.random() * 2000;

        if (Date.now() - lastCycleTime >= cycleTime) {
          const reward = calculateCycleReward() * miningPower;
          setBalance(prev => prev + reward);
          setCycleReward(reward);
          setLastCycleTime(Date.now());

          // Добавляем запись в историю
          setMiningHistory(prev => [{
            id: Date.now(), // Используем timestamp как id
            username: window.Telegram?.WebApp?.initDataUnsafe?.user?.username || 'User',
            power: miningPower,
            reward: reward
          }, ...prev.slice(0, 9)]); // Сохраняем только последние 10 записей
        }

        setEnergy(prev => {
          const newEnergy = prev - 1;
          if (newEnergy <= 0) {
            setIsActive(false);
            setIsRecharging(true);
            setRechargeTimeLeft(3 * 60 * 60 * 1000);
            return 0;
          }
          return newEnergy;
        });
      }, 1000);
    }
    return () => clearInterval(miningInterval);
  }, [isActive, energy, miningPower, lastCycleTime]);

  const handleRecharge = () => {
    // Здесь будет логика проверки и списания Telegram Stars
    setMaxEnergy(prev => prev + 100);
    setEnergy(prev => prev + 100);
  };

  const formatTime = (ms) => {
    const hours = Math.floor(ms / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((ms % (60 * 1000)) / 1000);
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mining-page">
      <div className="profile-block">
        <div className="balance-container">
          <h2>Баланс</h2>
          <p className="balance-value">{balance.toFixed(2)} $Bucks</p>
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
            disabled={energy === maxEnergy}
          >
            Пополнить - 300<StarIcon />
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
            <span className="value">{miningPower.toFixed(1)}</span>
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
          onClick={() => setIsActive(!isActive)}
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
              <div className="history-user">{record.username}</div>
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