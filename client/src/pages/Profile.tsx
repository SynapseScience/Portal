import React, { useState, useEffect } from "react";
import UserCard from "../parts/UserCard";
import AppCard from "../parts/AppCard";
import "./Profile.css";

export default function Profile({ me, session, token, setMe }) {
  
  const [user, setUser] = useState(null);
  const [apps, setApps] = useState([]);
  
  const [tried, setTried] = useState(false);
  let username = me ? me.username : null;
  const url = new URLSearchParams(window.location.search);
  if(url.has("username")) username = url.get("username");

  useEffect(() => {
    (async () => {
      const url = `${session.apiUrl}/user?username=${username}`
      const response = await fetch(url, {
        method: "GET"
      })
      
      if(response.ok) {
        const userInfos = await response.json();
        setUser(userInfos);
      }

      setTried(true);
      
    })();
    
    (async () => {
      const url = `${session.apiUrl}/applications?author=${username}`
      const response = await fetch(url, {
        method: "GET"
      })

      if(response.ok) {
        const data = await response.json();
        setApps(data.applications);
      }

      setTried(true);

    })();
    
  }, [username])

  return user ? <div className="cols" style={{ gap: "0px" }}>
    <div className="bubble transparent">
      <UserCard 
        user={user} 
        me={me} 
        session={session} 
        token={token} 
        setMe={setMe} 
        setUser={setUser} 
      />
    </div>
    <div className="bubble right transparent" style={{ paddingLeft: "0px" }}>
      <h1>Applications</h1>
      <div id="my-apps">
        { apps.length > 0 ? apps.map((app) => <AppCard 
          app={app} 
          me={me}
          session={session}
          token={token} 
        /> ) : <span>Cet utilisateur n'a pas d'applications vérifiées.</span> }
      </div>
    </div>
  </div> : <div className="bubble">{ 
    tried && <>
      <h1>Utilisateur non trouvé /:</h1>
      <p>Conseil de pro : tous les noms d'utilisateur sont en minuscule !</p>
    </>
  }</div>
}