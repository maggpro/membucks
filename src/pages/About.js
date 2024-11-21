import React from 'react';
import './About.css';

// Иконка доллара
const DollarIcon = () => (
  <span className="dollar-icon">$</span>
);

function About() {
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
            <h3>Что такое MemBucks?</h3>
            <p>MemBucks ($Bucks) — это мемкоин, созданный для сообщества Telegram. Общая эмиссия ограничена 100,000,000 $Bucks, которые будут распределены в течение 90 дней майнинга.</p>
          </section>

          <section className="about-section">
            <h3>Как начать майнинг?</h3>
            <p>1. Купите майнинговое оборудование за Telegram Stars</p>
            <p>2. Следите за уровнем энергии</p>
            <p>3. Запустите майнинг и собирайте награды</p>
            <p>4. Увеличивайте мощность, приобретая дополнительное оборудование</p>
          </section>

          <section className="about-section warning">
            <h3>⚠️ Важно!</h3>
            <p>Использование ботов и автоматизации строго запрещено. Все монеты, добытые с помощью ботов, будут конфискованы, а аккаунты заблокированы.</p>
          </section>

          <section className="about-section">
            <h3>Игровая механика</h3>
            <div className="mechanics-grid">
              <div className="mechanic-item">
                <h4>Энергия</h4>
                <p>Восстанавливается автоматически, когда майнинг остановлен</p>
              </div>
              <div className="mechanic-item">
                <h4>Оборудование</h4>
                <p>Каждая единица увеличивает мощность майнинга</p>
              </div>
              <div className="mechanic-item">
                <h4>Награда</h4>
                <p>Зависит от вашей мощности и имеет случайную вариацию ±20%</p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h3>Цель игры</h3>
            <p>Станьте одним из крупнейших майнеров MemBucks! Соревнуйтесь с другими игроками, увеличивайте свою мощность и собирайте как можно больше монет до окончания периода эмиссии.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default About;