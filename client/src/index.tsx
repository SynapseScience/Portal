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

  useEffect(() => {
    synapse.on('connected', (user) => {
      setUser(user);
    });

    synapse.update();
  }, [])
  
  return <Router>
      <Routes>
        <Route path="/" element={
          <Layout me={user} content={<Home me={user} session={synapse} />} />
        } />
        <Route path="/devkit" element={
          <Layout me={user} content={<Devkit me={user} session={synapse} />} />
        } />
        <Route path="/trade" element={
          <Layout me={user} content={<Trade me={user} session={synapse} />} />
        } />
        <Route path="/application" element={
          <Layout me={user} content={<Application me={user} session={synapse} />} />
        } />
        <Route path="/user" element={
          <Layout me={user} content={<User me={user} session={synapse} />} />
        } />
      </Routes>
    </Router>
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)