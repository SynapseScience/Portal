import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Session } from "./synapse-front.mjs";

import "./index.css";
import "./synapse-front.css";

import Layout from './parts/Layout';
import Home from './pages/Home';
import User from './pages/User';
import Application from './pages/Application';

const App = () => {
  const synapse = new Session("https://synapse-api.replit.app/api");
  const [user, setUser] = useState(null);

  synapse.on('connected', (user) => {
    setUser(user);
  });

  synapse.update();
  
  return <Router>
      <Routes>
        <Route path="/" element={
          <Layout session={synapse} content={<Home me={user} />} />
        } />
        <Route path="/application" element={
          <Layout session={synapse} content={<Application me={user} />} />
        } />
        <Route path="/user" element={
          <Layout session={synapse} content={<User me={user} />} />
        } />
      </Routes>
    </Router>
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)