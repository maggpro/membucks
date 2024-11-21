import React, { createContext, useContext, useState, useEffect } from 'react';

const MiningContext = createContext();

export function MiningProvider({ children }) {
  const [balance, setBalance] = useState(0);
  const [miningPower, setMiningPower] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [energy, setEnergy] = useState(100);
  const [maxEnergy, setMaxEnergy] = useState(100);
  const [equipment, setEquipment] = useState(0);
  const [cycleReward, setCycleReward] = useState(0);
  const [lastCycleTime, setLastCycleTime] = useState(0);
  const [totalMined, setTotalMined] = useState(0);
  const [minersOnline, setMinersOnline] = useState(0);
  const [miningHistory, setMiningHistory] = useState([]);
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const [tabId] = useState(Math.random().toString(36).substring(7));

  // Константы майнинга
  const TOTAL_SUPPLY = 100_000_000;
  const TOTAL_PLAYERS = 100_000;
  const CYCLE_TIME = 4;
  const BASE_CYCLE_REWARD = (TOTAL_SUPPLY / TOTAL_PLAYERS) * 0.0000003;

  // Добавляем состояния для отслеживания времени последних действий
  const [lastEquipmentPurchase, setLastEquipmentPurchase] = useState(0);
  const [lastEnergyUpgrade, setLastEnergyUpgrade] = useState(0);
  const [isPurchaseInProgress, setIsPurchaseInProgress] = useState(false);
  const [isUpgradeInProgress, setIsUpgradeInProgress] = useState(false);

  // Добавляем состояние для последней попытки
  const [lastMiningAttempt, setLastMiningAttempt] = useState({ success: true, reward: 0 });

  // Эффект для отслеживания онлайн майнеров
  useEffect(() => {
    if (isActive) {
      setMinersOnline(prev => prev + 1);
    }

    return () => {
      if (isActive) {
        setMinersOnline(prev => Math.max(0, prev - 1));
      }
    };
  }, [isActive]);

  // Эффект для майнинга
  useEffect(() => {
    let miningInterval;
    if (isActive && energy > 0) {
      miningInterval = setInterval(() => {
        const cycleTime = 3000 + Math.random() * 8000;

        if (Date.now() - lastCycleTime >= cycleTime) {
          // Добавляем шанс неудачи (1 из 10)
          const isSuccessful = Math.random() > 0.1;
          const reward = isSuccessful ? calculateCycleReward() * miningPower : 0;

          if (isSuccessful) {
            setBalance(prev => prev + reward);
            setTotalMined(prev => prev + reward);

            // Вибрация при успешной добыче
            if (window.Telegram?.WebApp?.HapticFeedback) {
              window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
            } else if (navigator.vibrate) {
              navigator.vibrate(50);
            }
          } else {
            // Вибрация при неудаче (другой паттерн)
            if (window.Telegram?.WebApp?.HapticFeedback) {
              window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
            } else if (navigator.vibrate) {
              navigator.vibrate([50, 100, 50]); // Двойная вибрация для неудачи
            }
          }

          setCycleReward(reward);
          setLastCycleTime(Date.now());
          setLastMiningAttempt({ success: isSuccessful, reward });

          setMiningHistory(prev => [{
            id: Date.now(),
            username: window.Telegram?.WebApp?.initDataUnsafe?.user?.username || 'User',
            power: miningPower,
            reward: reward,
            success: isSuccessful,
            timestamp: Date.now()
          }, ...prev.slice(0, 9)]);
        }

        setEnergy(prev => {
          const newEnergy = prev - 1;
          if (newEnergy <= 0) {
            setIsActive(false);
            return 0;
          }
          return newEnergy;
        });
      }, 1000);
    }

    return () => clearInterval(miningInterval);
  }, [isActive, energy, miningPower, lastCycleTime]);

  // Эффект для восстановления энергии
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

  // Добавим сохранение состояния в localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('miningState');
    if (savedState) {
      const state = JSON.parse(savedState);
      setBalance(state.balance || 0);
      setMiningPower(state.miningPower || 0);
      setEnergy(state.energy || 100);
      setMaxEnergy(state.maxEnergy || 100);
      setEquipment(state.equipment || 0);
      setTotalMined(state.totalMined || 0);
    }
  }, []);

  // Сохраняем состояние при изменении
  useEffect(() => {
    const state = {
      balance,
      miningPower,
      energy,
      maxEnergy,
      equipment,
      totalMined
    };
    localStorage.setItem('miningState', JSON.stringify(state));
  }, [balance, miningPower, energy, maxEnergy, equipment, totalMined]);

  // Проверка на мультиаккаунты и множественные вкладки
  useEffect(() => {
    // Сохраняем ID вкладки в localStorage
    const activeTabId = localStorage.getItem('activeTabId');
    const lastActive = parseInt(localStorage.getItem('lastActivityTime') || '0');
    const currentTime = Date.now();

    // Увеличиваем интервал проверки до 10 секунд
    if (currentTime - lastActive > 10000) {
      localStorage.setItem('activeTabId', tabId);
      localStorage.setItem('lastActivityTime', currentTime.toString());
    } else if (activeTabId && activeTabId !== tabId && isActive) {
      // Проверяем только если майнинг активен
      setIsActive(false);
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.showAlert('Майнинг уже запущен в другой вкладке');
      }
    }

    // Проверяем активность каждые 5 секунд вместо 1
    const checkInterval = setInterval(() => {
      if (isActive) { // Проверяем только при активном майнинге
        const currentTabId = localStorage.getItem('activeTabId');
        if (currentTabId === tabId) {
          localStorage.setItem('lastActivityTime', Date.now().toString());
        }
      }
    }, 5000);

    // Обработчик видимости страницы
    const handleVisibilityChange = () => {
      if (document.hidden && isActive) {
        setIsActive(false);
      }
    };

    // Обработчик фокуса окна
    const handleFocus = () => {
      if (isActive) { // Проверяем только при активном майнинге
        const currentTabId = localStorage.getItem('activeTabId');
        if (currentTabId && currentTabId !== tabId) {
          setIsActive(false);
          if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.showAlert('Майнинг уже запущен в другой вкладке');
          }
        }
      }
    };

    // Добавляем слушатели событий
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    // Проверка IP и User Agent
    const checkUserSession = async () => {
      try {
        const currentUserAgent = window.navigator.userAgent;
        const savedUserAgent = localStorage.getItem('userAgent');

        if (savedUserAgent && savedUserAgent !== currentUserAgent) {
          setIsActive(false);
          alert('Обнаружена попытка мультиаккаунтинга');
          return;
        }

        localStorage.setItem('userAgent', currentUserAgent);
      } catch (error) {
        console.error('Ошибка при проверке сессии:', error);
      }
    };

    checkUserSession();

    // Очистка при размонтировании
    return () => {
      clearInterval(checkInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      if (localStorage.getItem('activeTabId') === tabId) {
        localStorage.removeItem('activeTabId');
      }
    };
  }, [tabId, isActive]);

  // Защита от быстрого переключения вкладок
  useEffect(() => {
    if (isActive) {
      const lastMiningTime = parseInt(localStorage.getItem('lastMiningTime') || '0');
      const currentTime = Date.now();

      if (currentTime - lastMiningTime < 5000) {
        setIsActive(false);
        alert('Слишком частое переключение майнинга');
        return;
      }

      localStorage.setItem('lastMiningTime', currentTime.toString());
    }
  }, [isActive]);

  const calculateCycleReward = () => {
    const baseReward = BASE_CYCLE_REWARD;
    const variance = baseReward * 0.2;
    const minReward = baseReward - variance;
    const maxReward = baseReward + variance;
    return minReward + Math.random() * (maxReward - minReward);
  };

  // Обновляем функцию покупки оборудования
  const buyEquipment = async () => {
    const currentTime = Date.now();

    // Проверяем, не выполняется ли уже покупка
    if (isPurchaseInProgress) {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.showAlert('Дождитесь завершения предыдущей покупки');
      }
      return;
    }

    // Проверяем время с последней покупки (минимум 3 секунды между покупками)
    if (currentTime - lastEquipmentPurchase < 3000) {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.showAlert('Слишком частые запросы на покупку');
      }
      return;
    }

    try {
      setIsPurchaseInProgress(true);

      // Здесь будет запрос к API Telegram на списание Stars
      // const response = await fetch('your-api/purchase-equipment', {
      //   method: 'POST',
      //   body: JSON.stringify({ userId: window.Telegram?.WebApp?.initDataUnsafe?.user?.id })
      // });

      // if (!response.ok) throw new Error('Ошибка покупки');

      // Обновляем состояние после успешной покупки
      setEquipment(prev => prev + 1);
      setMiningPower(prev => prev + 1.5);
      setLastEquipmentPurchase(currentTime);

    } catch (error) {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.showAlert('Ошибка при покупке оборудования');
      }
    } finally {
      setIsPurchaseInProgress(false);
    }
  };

  // Обновляем функцию улучшения энергии
  const upgradeEnergy = async () => {
    const currentTime = Date.now();

    // Проверяем, не выполняется ли уже улучшение
    if (isUpgradeInProgress) {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.showAlert('Дождитесь завершения предыдущего улучшения');
      }
      return;
    }

    // Проверяем время с последнего улучшения (минимум 3 секунды между улучшениями)
    if (currentTime - lastEnergyUpgrade < 3000) {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.showAlert('Слишком частые запросы на улучшение');
      }
      return;
    }

    try {
      setIsUpgradeInProgress(true);

      // Здесь будет запрос к API Telegram на списание Stars
      // const response = await fetch('your-api/upgrade-energy', {
      //   method: 'POST',
      //   body: JSON.stringify({ userId: window.Telegram?.WebApp?.initDataUnsafe?.user?.id })
      // });

      // if (!response.ok) throw new Error('Ошибка улучшения');

      // Обновляем состояние после успешного улучшения
      setMaxEnergy(prev => {
        const newMaxEnergy = prev + 100;
        setEnergy(newMaxEnergy);
        return newMaxEnergy;
      });
      setLastEnergyUpgrade(currentTime);

    } catch (error) {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.showAlert('Ошибка при улучшении энергии');
      }
    } finally {
      setIsUpgradeInProgress(false);
    }
  };

  const startMining = () => {
    if (equipment === 0) {
      alert('Для начала майнинга необходимо купить оборудование');
      return;
    }

    const currentTabId = localStorage.getItem('activeTabId');
    if (currentTabId && currentTabId !== tabId) {
      alert('Майнинг уже запущен в другой вкладке');
      return;
    }

    setIsActive(true);
    localStorage.setItem('activeTabId', tabId);
    localStorage.setItem('lastActivityTime', Date.now().toString());
  };

  const value = {
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
    setEquipment,
    setMiningPower,
    setMaxEnergy,
    setEnergy,
    buyEquipment,
    upgradeEnergy,
    startMining,
    lastMiningAttempt,
  };

  return (
    <MiningContext.Provider value={value}>
      {children}
    </MiningContext.Provider>
  );
}

export function useMining() {
  const context = useContext(MiningContext);
  if (!context) {
    throw new Error('useMining must be used within a MiningProvider');
  }
  return context;
}