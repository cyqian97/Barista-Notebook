import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import './index.css';
import App from './App';
import AddBrew from './AddBrew';
import reportWebVitals from './reportWebVitals';

function Main() {
  return (
    <BrowserRouter>
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/beans"><button>Coffee Beans</button></Link>
        <Link to="/brew"><button>Add Brew</button></Link>
      </nav>
      <Routes>
        <Route path="/" element={<Navigate to="/beans" />} />
        <Route path="/beans" element={<App />} />
        <Route path="/brew" element={<AddBrew />} />
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
