import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Session } from "./synapse-front.mjs";

import "./index.css";
import "./synapse-front.css";

import Layout from './parts/Layout';
import Home from './pages/Home';
import Devkit from './pages/Devkit';
import User from './pages/User';
import Application from './pages/Application';
import Trade from './pages/Trade';

const App = () => {
  const synapse = new Session("https://synapse-api.replit.app/api");
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    synapse.on('connected', (userInfo) => {
      setUser(userInfo);
      setToken(synapse.token);
    });

    synapse.update();
  }, [])
  
  return <Router>
      <Routes>
        <Route path="/" element={
          <Layout me={user} content={
            <Home 
              me={user} 
              token={token}
              session={synapse}
            />
          } />
        } />
        <Route path="/devkit" element={
          <Layout me={user} content={
            <Devkit 
              me={user} 
              token={token}
              session={synapse}
            />
          } />
        } />
        <Route path="/trade" element={
          <Layout me={user} content={
            <Trade 
              me={user} 
              token={token}
              session={synapse}
            />
          } />
        } />
      </Routes>
    </Router>
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)