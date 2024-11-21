import React, { useState, useEffect } from 'react';
import { useMining } from '../context/MiningContext';
import './Tasks.css';

function Tasks() {
  const { maxEnergy, setMaxEnergy } = useMining();
  const [referralLink, setReferralLink] = useState('');
  const [subscriptionTasks, setSubscriptionTasks] = useState([
    {
      id: 1,
      type: 'channel',
      title: 'Подписаться на канал MemBucks News',
      reward: '+10 энергии',
      status: 'active',
      link: 'https://t.me/membucks_news',
      chatId: '@membucks_news'
    },
    {
      id: 2,
      type: 'folder',
      title: 'Подписаться на папку каналов Crypto',
      reward: '+30 энергии',
      status: 'active',
      link: 'https://t.me/addlist/crypto',
      chatIds: ['@crypto_news', '@crypto_signals']
    }
  ]);

  // Получаем данные из Telegram WebApp
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      // Получаем реферальную ссылку
      const startParam = tg.initDataUnsafe?.start_param;
      if (startParam) {
        // Обработка реферальной ссылки
        handleReferral(startParam);
      }
    }
  }, []);

  // Обработка реферальной ссылки
  const handleReferral = async (referrerId) => {
    try {
      // Здесь будет запрос к бэкенду для обработки реферала
      // const response = await fetch('your-api/referral', {
      //   method: 'POST',
      //   body: JSON.stringify({ referrerId })
      // });
      // if (response.ok) {
      //   setMaxEnergy(prev => prev + 20);
      // }
    } catch (error) {
      console.error('Ошибка при обработке реферала:', error);
    }
  };

  // Проверка подписки на канал
  const checkSubscription = async (chatId) => {
    if (window.Telegram?.WebApp) {
      try {
        // В реальном приложении здесь будет запрос к боту через бэкенд
        // const response = await fetch('your-api/check-subscription', {
        //   method: 'POST',
        //   body: JSON.stringify({ chatId })
        // });
        // return response.ok;
        return true;
      } catch (error) {
        console.error('Ошибка при проверке подписки:', error);
        return false;
      }
    }
    return false;
  };

  // Копирование реферальной ссылки
  const copyReferralLink = () => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      const userId = tg.initDataUnsafe?.user?.id;
      const link = `https://t.me/membucks_bot?start=${userId}`;

      // Используем Telegram API для копирования
      tg.copyTextToClipboard(link);
      // Показываем уведомление
      tg.showAlert('Реферальная ссылка скопирована!');
    }
  };

  // Обработка клика по кнопке подписки
  const handleSubscribeClick = async (task) => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;

      // Открываем канал/чат в Telegram
      tg.openTelegramLink(task.link);

      // Через некоторое время проверяем подписку
      setTimeout(async () => {
        const isSubscribed = await checkSubscription(task.chatId);
        if (isSubscribed) {
          // Обновляем статус задания
          setSubscriptionTasks(prev =>
            prev.map(t => t.id === task.id ? {...t, status: 'completed'} : t)
          );
          // Начисляем награду
          setMaxEnergy(prev => prev + parseInt(task.reward));
          // Показываем уведомление
          tg.showAlert('Награда получена!');
        }
      }, 3000);
    }
  };

  // Пример данных для реферальной системы
  const referralStats = {
    totalReferrals: 12,
    activeMiners: 5,
    energyBonus: 20,
    totalEnergyGained: 100
  };

  return (
    <div className="tasks-page">
      {/* Блок рефералов */}
      <div className="tasks-block referral-block">
        <h2>Реферальная программа</h2>
        <div className="referral-stats">
          <div className="stat-row">
            <span className="stat-label">Всего приглашено</span>
            <span className="stat-value">{referralStats.totalReferrals}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Активных майнеров</span>
            <span className="stat-value">{referralStats.activeMiners}</span>
          </div>
          <div className="stat-row total">
            <span className="stat-label">Получено энергии</span>
            <span className="stat-value">+{referralStats.totalEnergyGained}</span>
          </div>
        </div>
        <div className="referral-info">
          <p className="info-text">
            Приглашайте друзей и получайте +{referralStats.energyBonus} к максимальному запасу энергии за каждого активного майнера
          </p>
          <button className="copy-link-button" onClick={copyReferralLink}>
            Скопировать ссылку
          </button>
        </div>
      </div>

      {/* Блок заданий на подписку */}
      <div className="tasks-block subscription-block">
        <h2>Задания</h2>
        <div className="tasks-list">
          {subscriptionTasks.map(task => (
            <div key={task.id} className={`task-item ${task.status}`}>
              <div className="task-header">
                <span className="task-title">{task.title}</span>
                <span className="task-reward">{task.reward}</span>
              </div>
              <div className="task-actions">
                {task.status === 'active' ? (
                  <button
                    className="task-button"
                    onClick={() => handleSubscribeClick(task)}
                  >
                    Подписаться
                  </button>
                ) : (
                  <span className="task-completed">Выполнено</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Tasks;