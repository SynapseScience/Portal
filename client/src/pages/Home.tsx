import React, { useEffect, useState } from "react";
import AppCard from "../parts/AppCard";

import "./Home.css";

export default function Home({ me, token, session }) {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    (async () => {
       try {
         const response = await fetch(session.apiUrl + '/applications');
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
        <h1>Applications</h1>
        <div>
          <input placeholder="Rechercher une application" type="text" />
          <button>rechercher</button>
        </div>
      </nav>
      <div class="results"> {
        apps.map(app => <AppCard app={app} session={session} token={token} />)
      }</div>
  </>;
}