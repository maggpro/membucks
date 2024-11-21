import React from 'react';
import { useMining } from '../context/MiningContext';
import './About.css';

const DollarIcon = () => (
  <span className="dollar-icon">$</span>
);

function About() {
  const { TOTAL_SUPPLY, totalMined } = useMining();
  const percentMined = ((totalMined / TOTAL_SUPPLY) * 100).toFixed(2);

  return (
    <div className="about-page">
      <div className="about-block">
        <div className="about-header">
          <DollarIcon />
          <h2>MemBucks</h2>
          <DollarIcon />
        </div>

        <div className="about-content">
          <section className="about-section">
            <h3>О проекте</h3>
            <p>MemBucks ($Bucks) — мемкоин, созданный для сообщества Telegram с ограниченной эмиссией в 100,000,000 $Bucks.</p>
            <p>Текущий прогресс: {percentMined}% монет уже добыто</p>
          </section>

          <section className="about-section">
            <h3>Майнинг</h3>
            <p>• Процесс майнинга продолжается до полного распределения эмиссии</p>
            <p>• Каждый цикл майнинга длится 3-11 секунд</p>
            <p>• Награда имеет случайную вариацию ±20% от базового значения</p>
            <p>• Для майнинга требуется энергия и оборудование</p>
          </section>

          <section className="about-section">
            <h3>Оборудование</h3>
            <p>• Базовая мощность: 1.5 MH/s за единицу</p>
            <p>• Стоимость: 300 Telegram Stars</p>
            <p>• Бонусы мощности:</p>
            <ul>
              <li>+5 MH/s каждые 10 единиц</li>
              <li>+20 MH/s каждые 50 единиц</li>
            </ul>
            <p>• Количество оборудования не ограничено</p>
          </section>

          <section className="about-section">
            <h3>Энергия</h3>
            <p>• Начальный запас: 100 единиц</p>
            <p>• Автоматическое восстановление за 10 минут</p>
            <p>• Возможность увеличения максимального запаса</p>
            <p>• Стоимость увеличения: 300 Telegram Stars</p>
            <p>• Каждое улучшение: +100 к максимуму энергии</p>
          </section>

          <section className="about-section">
            <h3>Стратегия игры</h3>
            <p>• Покупайте оборудование для увеличения базовой мощности</p>
            <p>• Следите за бонусами мощности при достижении порогов</p>
            <p>• Увеличивайте запас энергии для длительного майнинга</p>
            <p>• Следите за рейтингом майнеров</p>
            <p>• Выполняйте задания для получения бонусов</p>
          </section>

          <section className="about-section warning">
            <h3>⚠️ Важно!</h3>
            <p>Использование ботов и любых видов автоматизации строго запрещено. Нарушители будут заблокированы, а добытые монеты конфискованы.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default About;