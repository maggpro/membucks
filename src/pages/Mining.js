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
  const TOTAL_SUPPLY = 100_000_000; // 100 миллионов $Bucks
  const [totalMined, setTotalMined] = useState(156842.123456); // Пример добытых монет
  const [minersOnline, setMinersOnline] = useState(127); // Пример онлайн майнеров

  // Добавляе новые состояния для оборудования и майнинга
  const [equipment, setEquipment] = useState(1); // Количество оборудования
  const [cycleReward, setCycleReward] = useState(0); // Награда за текущий цикл
  const [lastCycleTime, setLastCycleTime] = useState(0); // Время последнего цикла
  const TOTAL_PLAYERS = 100_000; // 100 тысяч игроков
  const MINING_PERIOD = 90 * 24 * 60 * 60; // 90 дней в секундах
  const CYCLE_TIME = 4; // среднее время цикла (3-5 секунд)
  const BASE_CYCLE_REWARD = (TOTAL_SUPPLY / TOTAL_PLAYERS / MINING_PERIOD) * CYCLE_TIME; // Базовая награда за цикл
  const EQUIPMENT_MULTIPLIER = 1.1; // +10% к добыче за каждую единицу

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
    if (isRecharging && energy < maxEnergy && !isActive) {
      const rechargeTime = 10 * 60 * 1000; // 10 минут в миллисекундах
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
  }, [isRecharging, maxEnergy, isActive]);

  // Функция для расчета награды за цикл с учетом оборудования
  const calculateCycleReward = () => {
    // Базовая награда
    const baseReward = BASE_CYCLE_REWARD;

    // Множитель от количества оборудования
    const equipmentBonus = Math.pow(EQUIPMENT_MULTIPLIER, equipment - 1);

    // Случайная вариация ±20%
    const variance = baseReward * 0.2;
    const minReward = baseReward - variance;
    const maxReward = baseReward + variance;
    const randomReward = minReward + Math.random() * (maxReward - minReward);

    // Итоговая награда с учетом бонуса от оборудования
    return randomReward * equipmentBonus;
  };

  // Функция покупки оборудования (без ограничения)
  const buyEquipment = () => {
    // Здесь будет проверка и списание Telegram Stars
    setEquipment(prev => prev + 1);
    setMiningPower(prev => prev * EQUIPMENT_MULTIPLIER);
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

  // Обновляем эффект майнинга
  useEffect(() => {
    let miningInterval;
    if (isActive) {
      miningInterval = setInterval(() => {
        // Проверяем энергию
        if (energy > 0) {
          // Уменьшаем энергию
          setEnergy(prev => {
            const newEnergy = prev - 1;
            if (newEnergy <= 0) {
              // Останавливаем майнинг при нулевой энергии
              setIsActive(false);
              // Начинаем восстановление
              setIsRecharging(true);
              // Устанавливаем время восстановления (10 минут)
              setRechargeTimeLeft(10 * 60 * 1000);
              return 0;
            }
            return newEnergy;
          });

          // Проверяем время цикла и добываем монеты только если есть энергия
          const cycleTime = 3000 + Math.random() * 2000;
          if (Date.now() - lastCycleTime >= cycleTime) {
            const reward = calculateCycleReward() * miningPower;
            setBalance(prev => prev + reward);
            setCycleReward(reward);
            setLastCycleTime(Date.now());

            // Добавляем запись в историю с временем
            setMiningHistory(prev => [{
              id: Date.now(),
              username: window.Telegram?.WebApp?.initDataUnsafe?.user?.username || 'User',
              power: miningPower,
              reward: reward,
              timestamp: Date.now() // Добавляем временную метку
            }, ...prev.slice(0, 9)]);
          }
        }
      }, 1000);
    }
    return () => clearInterval(miningInterval);
  }, [isActive, miningPower, lastCycleTime]);

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
          disabled={energy <= 0 && !isActive}
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