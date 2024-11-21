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
          <h2>MEMBUCKS</h2>
          <DollarIcon />
        </div>

        <div className="about-content">
          <section className="about-section highlight">
            <h3>О проекте</h3>
            <div className="info-box">
              <p>MemBucks ($BUCKS) — мемкоин, созданный для сообщества Telegram</p>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Эмиссия</span>
                  <span className="stat-value">100,000,000 $BUCKS</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Добыто</span>
                  <span className="stat-value">{percentMined}%</span>
                </div>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h3>Механика игры</h3>
            <div className="feature-list">
              <div className="feature-item">
                <span className="feature-dot">•</span>
                <span>Майнинг продолжается до полного распределения эмиссии</span>
              </div>
              <div className="feature-item">
                <span className="feature-dot">•</span>
                <span>Каждый цикл майнинга длится 3-11 секунд</span>
              </div>
              <div className="feature-item">
                <span className="feature-dot">•</span>
                <span>Награда имеет случайную вариацию ±20%</span>
              </div>
              <div className="feature-item">
                <span className="feature-dot">•</span>
                <span>Энергия тратится каждую секунду во время майнинга</span>
              </div>
              <div className="feature-item">
                <span className="feature-dot">•</span>
                <span>Восстановление энергии происходит только при остановке майнинга</span>
              </div>
            </div>
          </section>

          <section className="about-section accent">
            <h3>Оборудование</h3>
            <div className="specs-grid">
              <div className="spec-item">
                <span className="spec-label">Базовая мощность</span>
                <span className="spec-value">1.5 MH/s</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Стоимость</span>
                <span className="spec-value">300 Stars</span>
              </div>
            </div>
            <div className="bonus-box">
              <h4>Бонусы мощности</h4>
              <div className="bonus-item">
                <span className="bonus-value">+5 MH/s</span>
                <span className="bonus-desc">каждые 10 единиц</span>
              </div>
              <div className="bonus-item">
                <span className="bonus-value">+20 MH/s</span>
                <span className="bonus-desc">каждые 50 единиц</span>
              </div>
            </div>
            <div className="info-note">
              <p>Количество оборудования не ограничено. Чем больше оборудования, тем выше награда за майнинг.</p>
            </div>
          </section>

          <section className="about-section">
            <h3>Энергия</h3>
            <div className="energy-specs">
              <div className="energy-spec-item">
                <span className="spec-label">Начальный запас</span>
                <span className="spec-value">100</span>
              </div>
              <div className="energy-spec-item">
                <span className="spec-label">Время восстановления</span>
                <span className="spec-value">10 мин</span>
              </div>
              <div className="energy-spec-item">
                <span className="spec-label">Улучшение</span>
                <span className="spec-value">+100 / 300 Stars</span>
              </div>
            </div>
            <div className="info-note">
              <p>Энергия полностью восстанавливается за 10 минут при остановленном майнинге. Увеличение максимального запаса позволяет майнить дольше.</p>
            </div>
          </section>

          <section className="about-section">
            <h3>Рейтинг</h3>
            <div className="feature-list">
              <div className="feature-item">
                <span className="feature-dot">•</span>
                <span>Топ-100 лучших майнеров</span>
              </div>
              <div className="feature-item">
                <span className="feature-dot">•</span>
                <span>Отображение вашей позиции в рейтинге</span>
              </div>
              <div className="feature-item">
                <span className="feature-dot">•</span>
                <span>Специальное выделение топ-3 игроков</span>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h3>Советы</h3>
            <div className="feature-list">
              <div className="feature-item">
                <span className="feature-dot">•</span>
                <span>Покупайте оборудование для увеличения мощности</span>
              </div>
              <div className="feature-item">
                <span className="feature-dot">•</span>
                <span>Следите за бонусами при достижении порогов</span>
              </div>
              <div className="feature-item">
                <span className="feature-dot">•</span>
                <span>Увеличивайте запас энергии для длительного майнинга</span>
              </div>
              <div className="feature-item">
                <span className="feature-dot">•</span>
                <span>Останавливайте майнинг для восстановления энергии</span>
              </div>
            </div>
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