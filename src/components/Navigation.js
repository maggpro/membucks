import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Navigation.css';

function Navigation() {
  return (
    <nav className="navigation">
      <div className="nav-links">
        <NavLink to="/mining" className="nav-link">Майнинг</NavLink>
        <NavLink to="/rating" className="nav-link">Рейтинг</NavLink>
        <NavLink to="/tasks" className="nav-link">Задания</NavLink>
        <NavLink to="/about" className="nav-link">О MemBucks</NavLink>
      </div>
    </nav>
  );
}

export default Navigation;