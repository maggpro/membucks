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

  // Константы майнинга
  const TOTAL_SUPPLY = 100_000_000;
  const TOTAL_PLAYERS = 100_000;
  const CYCLE_TIME = 4;
  const BASE_CYCLE_REWARD = (TOTAL_SUPPLY / TOTAL_PLAYERS) * 0.0000003;

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

  const calculateCycleReward = () => {
    const baseReward = BASE_CYCLE_REWARD;
    const variance = baseReward * 0.2;
    const minReward = baseReward - variance;
    const maxReward = baseReward + variance;
    return minReward + Math.random() * (maxReward - minReward);
  };

  const buyEquipment = () => {
    setEquipment(prev => prev + 1);
    setMiningPower(prev => prev + 1.5);
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
    buyEquipment
  };

  return (
    <MiningContext.Provider value={value}>
      {children}
    </MiningContext.Provider>
  );
}

export function useMining() {
  return useContext(MiningContext);
}