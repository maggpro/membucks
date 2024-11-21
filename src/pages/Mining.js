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

  // Добавляем состояния для информации о монете
  const TOTAL_SUPPLY = 100_000_000; // 100 миллионов $Bucks
  const TOTAL_PLAYERS = 100_000; // 100 тысяч игроков
  const MINING_PERIOD = 90 * 24 * 60 * 60; // 90 дней в секундах
  const CYCLE_TIME = 4; // среднее время цикла (3-5 секунд)

  // Базовая награда за цикл
  const BASE_CYCLE_REWARD = (TOTAL_SUPPLY / TOTAL_PLAYERS / MINING_PERIOD) * CYCLE_TIME;

  // Обновляем состояния
  const [totalMined, setTotalMined] = useState(0); // Начинаем с 0 добытых монет
  const [minersOnline, setMinersOnline] = useState(0); // Начинаем с 0 майнеров

  // Добавляем новые состояня для оборудования и майнинга
  const [equipment, setEquipment] = useState(1); // Количество оборудования
  const [cycleReward, setCycleReward] = useState(0); // Награда за текущий цикл
  const [lastCycleTime, setLastCycleTime] = useState(0); // Время последнего цикла

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
    if (!isActive && energy < maxEnergy) {
      const rechargeTime = 10 * 60 * 1000;
      const incrementPerSecond = maxEnergy / (rechargeTime / 1000);

      rechargeInterval = setInterval(() => {
        setEnergy(prev => {
          const newEnergy = prev + incrementPerSecond;
          if (newEnergy >= maxEnergy) {
            return maxEnergy;
          }
          return newEnergy;
        });
      }, 1000);
    }

    return () => clearInterval(rechargeInterval);
  }, [isActive, energy, maxEnergy]);

  // Функция для расчета награды за цикл
  const calculateCycleReward = () => {
    // Базовая награда
    const baseReward = BASE_CYCLE_REWARD;

    // Случайная вариация ±20%
    const variance = baseReward * 0.2;
    const minReward = baseReward - variance;
    const maxReward = baseReward + variance;

    return minReward + Math.random() * (maxReward - minReward);
  };

  // Функция для расчета мощности майнинга
  const calculateMiningPower = (equipmentCount) => {
    // Базовая мощность от количества оборудования
    const basePower = equipmentCount * 1.5;

    // Бонус за каждые 10 единиц оборудования (синергия)
    const synergyBonus = Math.floor(equipmentCount / 10) * 5;

    // Бонус за каждые 50 единиц (технологический прорыв)
    const techBonus = Math.floor(equipmentCount / 50) * 20;

    // Итоговая мощность
    return basePower + synergyBonus + techBonus;
  };

  // Функция покупки оборудования
  const buyEquipment = () => {
    // Здесь будет проверка и списание Telegram Stars
    setEquipment(prev => prev + 1);
    // Обновляем мощность по новой формуле
    setMiningPower(prev => calculateMiningPower(equipment + 1));
  };

  // Обновляем эффект майнинга
  useEffect(() => {
    let miningInterval;
    if (isActive && energy > 0) {
      miningInterval = setInterval(() => {
        const cycleTime = 3000 + Math.random() * 2000;

        if (Date.now() - lastCycleTime >= cycleTime) {
          const reward = calculateCycleReward() * miningPower;
          setBalance(prev => prev + reward);
          setCycleReward(reward);
          setLastCycleTime(Date.now());
          setTotalMined(prev => prev + reward);

          setMiningHistory(prev => [{
            id: Date.now(),
            username: window.Telegram?.WebApp?.initDataUnsafe?.user?.username || 'User',
            power: miningPower,
            reward: reward,
            timestamp: Date.now()
          }, ...prev.slice(0, 9)]);
        }

        setEnergy(prev => {
          const newEnergy = prev - 1;
          if (newEnergy <= 0) {
            setIsActive(false); // Останавливаем майнинг при нулевой энергии
            return 0;
          }
          return newEnergy;
        });
      }, 1000);
    }

    // Обновляем количество активных майнеров
    if (isActive) {
      setMinersOnline(prev => prev + 1);
    } else {
      setMinersOnline(prev => Math.max(0, prev - 1));
    }

    return () => {
      clearInterval(miningInterval);
      if (isActive) {
        setMinersOnline(prev => Math.max(0, prev - 1));
      }
    };
  }, [isActive, energy, miningPower, lastCycleTime]);

  const handleRecharge = () => {
    // Здесь будет логика проверки и списания Telegram Stars
    setMaxEnergy(prev => {
      const newMaxEnergy = prev + 100;
      // Заполняем энергию до нового максимума
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