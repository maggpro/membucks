import React from 'react';
import { useMining } from '../context/MiningContext';
import './Rating.css';

function Rating() {
  const { balance, miningPower, equipment } = useMining();

  // Генерируем данные для 100 майнеров
  const generateRatingData = () => {
    const data = [];
    const names = [
      "Crypto", "Moon", "Block", "Hash", "Coin", "Mining", "Star", "Power",
      "Bucks", "Mega", "Ultra", "Super", "Pro", "Master", "King", "Lord",
      "Elite", "Prime", "Alpha", "Omega"
    ];
    const suffixes = ["Miner", "Hunter", "Master", "Pro", "King", "Ninja", "Whale", "Boss"];

    for (let i = 0; i < 100; i++) {
      const name1 = names[Math.floor(Math.random() * names.length)];
      const name2 = suffixes[Math.floor(Math.random() * suffixes.length)];
      const username = `${name1}${name2}${Math.floor(Math.random() * 999)}`;

      // Уменьшаем значения с каждой позицией
      const powerBase = 850 - (i * 8);
      const equipmentBase = 450 - (i * 4);
      const minedBase = 15000 - (i * 145);

      data.push({
        rank: i + 1,
        username: username,
        mined: minedBase + Math.random() * 100,
        power: powerBase + Math.random() * 10,
        equipment: Math.max(1, Math.floor(equipmentBase + Math.random() * 5))
      });
    }
    return data;
  };

  const ratingData = generateRatingData();

  // Данные текущего игрока
  const currentPlayer = {
    rank: 156, // Пример позиции
    username: window.Telegram?.WebApp?.initDataUnsafe?.user?.username || 'User',
    mined: balance,
    power: miningPower,
    equipment: equipment
  };

  return (
    <div className="rating-page">
      <div className="rating-block">
        <h2>Топ-100 майнеров</h2>
        <div className="rating-list">
          {ratingData.map((miner) => (
            <div key={miner.rank} className={`rating-item rank-${miner.rank}`}>
              <div className="rating-item-header">
                <div className="rank-and-name">
                  <span className="rank">#{miner.rank}</span>
                  <span className="username">{miner.username}</span>
                </div>
                <span className="mined-amount">{miner.mined.toFixed(6)} $Bucks</span>
              </div>
              <div className="rating-item-details">
                <div className="detail-item">
                  <span className="detail-label">Мощность:</span>
                  <span className="detail-value">{miner.power.toFixed(1)} MH/s</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Оборудование:</span>
                  <span className="detail-value">{miner.equipment} шт.</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Фиксированная позиция игрока внизу */}
      <div className="current-player-container">
        <div className="current-player-block">
          <div className="rating-item current-player">
            <div className="rating-item-header">
              <div className="rank-and-name">
                <span className="rank">#{currentPlayer.rank}</span>
                <span className="username">{currentPlayer.username}</span>
              </div>
              <span className="mined-amount">{currentPlayer.mined.toFixed(6)} $Bucks</span>
            </div>
            <div className="rating-item-details">
              <div className="detail-item">
                <span className="detail-label">Мощность:</span>
                <span className="detail-value">{currentPlayer.power.toFixed(1)} MH/s</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Оборудование:</span>
                <span className="detail-value">{currentPlayer.equipment} шт.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Rating;