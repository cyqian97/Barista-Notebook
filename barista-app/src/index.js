import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './index.css';
import Beans from './Beans';
import Brews from './Brews';
import AddBrew from './AddBrew';
import reportWebVitals from './reportWebVitals';

// Home page component
function Home() {
  return (
    <div>
      <h1>Welcome to Barista Notebook</h1>
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/beans"><button>Coffee Beans</button></Link>
        <Link to="/addbrew"><button>Add Brew</button></Link>
        <Link to="/brews"><button>All Brews</button></Link> 
      </nav>
      <p>Select a page above to get started.</p>
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
