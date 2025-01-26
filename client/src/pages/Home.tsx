import React, { useEffect, useState } from "react";
import AppCard from "../parts/AppCard";

import "./Home.css";
import Icon from "../parts/Icon";

export default function Home({ me, token, session }) {
  const [apps, setApps] = useState([]);
  const [searchQuery, setQuery] = useState("");

  useEffect(() => {
    (async () => {
       try {
         const response = await fetch(session.apiUrl + '/applications?tags=indépendant,francophone');
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

  const search = async () => {
    try {
      let url = session.apiUrl + '/applications?tags=indépendant,francophone';
      url += `&search=${encodeURIComponent(searchQuery)}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const data = await response.json();
        setApps(data.applications);
      }
    } catch (err) {
      console.error(err)
    }
  }
  
  return <>
    <nav>
      <h1>Applications</h1>
      <div>
        <button className="inverted outline"><Icon name="heart" /></button>
        <button className="inverted outline"><Icon name="filter" /></button>
        <button className="inverted outline"><Icon name="sort" /></button>
        <input
          className="outline"
          placeholder="Rechercher une application"
          type="text"
          value={searchQuery}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") search();
          }}
        />
        <button onClick={search}><Icon name="magnifying-glass" /></button>
      </div>
    </nav>
    <div className="results">{
      apps.map(app => <AppCard key={app.id} app={app} me={me} session={session} token={token} />)
    }</div>
  </>;

}