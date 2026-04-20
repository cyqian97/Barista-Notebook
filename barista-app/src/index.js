import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './index.css';
import Beans from './Beans';
import Brews from './Brews';
import AddBrew from './AddBrew';
import Equipment from './Equipment';
import reportWebVitals from './reportWebVitals';

function Home() {
  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="home-logo">☕</div>
        <h1>Barista Notebook</h1>
        <p className="home-subtitle">Your personal coffee brewing journal</p>
      </div>
      <nav className="home-nav">
        <Link to="/beans" className="nav-card">
          <span className="nav-card-icon">🫘</span>
          <span className="nav-card-title">Coffee Beans</span>
          <span className="nav-card-desc">Manage your bean collection</span>
        </Link>
        <Link to="/addbrew" className="nav-card">
          <span className="nav-card-icon">⚗️</span>
          <span className="nav-card-title">Add Brew</span>
          <span className="nav-card-desc">Record a new brewing session</span>
        </Link>
        <Link to="/brews" className="nav-card">
          <span className="nav-card-icon">📖</span>
          <span className="nav-card-title">All Brews</span>
          <span className="nav-card-desc">Browse your brew history</span>
        </Link>
        <Link to="/equipment" className="nav-card">
          <span className="nav-card-icon">🔧</span>
          <span className="nav-card-title">Equipment</span>
          <span className="nav-card-desc">Manage grinders & brew methods</span>
        </Link>
      </nav>
    </div>
  );
}

function Main() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/beans" element={<Beans />} />
        <Route path="/addbrew" element={<AddBrew />} />
        <Route path="/brews" element={<Brews />} />
        <Route path="/equipment" element={<Equipment />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);

reportWebVitals();
