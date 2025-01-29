import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Session } from "./synapse-front.mjs";

import "./index.css";

import Layout from './parts/Layout';
import Home from './pages/Home';
import Devkit from './pages/Devkit';
import Profile from './pages/Profile';
import Trade from './pages/Trade';

const App = () => {
  const synapse = new Session("https://synapse-api.replit.app/api");
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [popup, setPopup] = useState(null);

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
          <Layout 
            popup={popup} 
            setPopup={setPopup}
            me={user} 
            content={
            <Home 
              setPopup={setPopup}
              me={user} 
              token={token}
              session={synapse}
            />
          } />
        } />
        <Route path="/devkit" element={
          <Layout 
            popup={popup} 
            setPopup={setPopup}
            me={user} 
            content={
            <Devkit 
              me={user}
              token={token}
              session={synapse}
            />
          } />
        } />
        <Route path="/trade" element={
          <Layout 
            popup={popup} 
            setPopup={setPopup}
            me={user} 
            content={
            <Trade 
              me={user}
              token={token}
              session={synapse}
            />
          } />
        } />
        <Route path="/profile" element={
          <Layout 
            popup={popup}
            setPopup={setPopup}
            me={user} 
            content={
            <Profile 
              me={user}
              token={token}
              session={synapse}
              setMe={setUser}
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