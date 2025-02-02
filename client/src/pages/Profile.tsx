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

    })();
    
  }, [username])

  return tried && <div className="cols" style={{ gap: "0px" }}>
    <div className="bubble transparent">{
      user 
        ? <UserCard 
          user={user} 
          me={me} 
          session={session} 
          token={token} 
          setMe={setMe} 
          setUser={setUser} 
        /> 
        : <div className="bubble outline" style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px"
        }}>
          <h1>Utilisateur inconnu</h1>
          <span>Cette personne n'est pas encore enregistrée dans l'écosystème Synapse ! Invitez-la à rejoidre en partageant ce lien :</span>
          <code className="block">
            <a href={session.apiUrl.replace("fr/api", "fr") + "/oauth/register?username=" + username}
            >{session.apiUrl.replace("fr/api", "fr")}/oauth/register?username={username}</a>
          </code>
        </div>
    }</div>
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
  </div>
}