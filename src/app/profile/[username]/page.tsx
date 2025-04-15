"use client";

import React, { useState, useEffect } from "react";
import UserCard from "../../../components/UserCard";
import AppCard from "../../../components/AppCard";
import "./Profile.css";
import { notFound } from "next/navigation";
import { Application } from "@/types/models";

type P = { username: string; };

export default function Profile({ params }: { params: Promise<P> }) {
  
  const [displayedUser, setDisplayedUser] = useState(null);
  const [apps, setApps] = useState([]);
  const [tried, setTried] = useState(false);
  
  let p = React.use(params) as P;
  const username = p.username;
  if(!username) notFound();

  useEffect(() => {
    (async () => {
      const url = `${process.env.NEXT_PUBLIC_SYNAPSE_API}/user?username=${username}`
      const response = await fetch(url, {
        method: "GET"
      })
      
      if(response.ok) {
        const displayedUserInfos = await response.json();
        setDisplayedUser(displayedUserInfos);
      }

      setTried(true);
      
    })();
    
    (async () => {
      const url = `${process.env.NEXT_PUBLIC_SYNAPSE_API}/applications?author=${username}`
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
      displayedUser 
        ? <UserCard 
          displayedUser={displayedUser}
          setDisplayedUser={setDisplayedUser}
        /> 
        : <div className="bubble outline" style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "300px"
        }}>
          <h1>@{username}</h1>
          <span>Cette personne n'est pas encore enregistrée dans l'écosystème Synapse. Invitez-la à rejoidre en partageant la plate-forme !</span>
        </div>
    }</div>
    <div className="bubble right transparent" style={{ paddingLeft: "0px" }}>
      <h1>Applications</h1>
      <div id="my-apps">
        { apps.length > 0 ? apps.map((app: Application) => <AppCard 
          key={app.client_id}
          app={app}
        /> ) : <span>Cet utilisateur n'a pas d'applications vérifiées.</span> }
      </div>
    </div>
  </div>
}