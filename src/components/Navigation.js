import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Navigation.css';

function Navigation() {
  return (
    <nav className="navigation">
      <div className="nav-links">
        <NavLink to="/mining" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Майнинг
        </NavLink>
        <NavLink to="/rating" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Рейтинг
        </NavLink>
        <NavLink to="/tasks" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Задания
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          О MemBucks
        </NavLink>
      </div>
    </nav>
  );
}

export default Navigation;