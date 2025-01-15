import React, { useEffect, useState } from "react";
import "./Home.css";
import AppCard from "../parts/AppCard";
import Icon from "../parts/Icon";

function MenuItem({ icon, text, disabled = false }) {
  return <a className={"menu-item" + (disabled ? " disabled" : "")}><Icon name={icon} outline={false} /> {text}</a>
}

export default function Home() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    (async () => {
       try {
         const response = await fetch('https://synapse-api.replit.app/api/applications');
         if (!response.ok) {
           throw new Error(`HTTP error! status: ${response.status}`);
         }
         const data = await response.json();
         setApps(data.applications);
       } catch (err) {
         console.error(err)
       }
     })()
  }, []);
  
  return <>
    <nav>
      <MenuItem icon="house" text="Applications" />
      <MenuItem icon="newspaper" text="Médias" disabled={true} />
      <MenuItem icon="calendar-check" text="Évènements" disabled={true} />
      <MenuItem icon="money-bill-trend-up" text="Échanges" disabled={true} />
      <MenuItem icon="gear" text="Devkit" />
    </nav>
    <main>
      <nav>
        <input placeholder="Rechercher un projet ou un utilisateur" type="text" />
        <button>rechercher</button>
      </nav>
      <div class="results"> {
        apps.map(app => <AppCard app={app} />)
      }</div>
    </main>
  </>;
}