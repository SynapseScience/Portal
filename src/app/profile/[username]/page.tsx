import React, { useState, useEffect } from "react";
import UserCard from "../../../components/UserCard";
import AppCard from "../../../components/AppCard";
import "./Profile.css";
import { notFound } from "next/navigation";
import { useSession } from "next-auth/react";

interface Props { 
  params: { 
    username: string;
  } 
}

export default function Profile({ params }) {

  const { data: session } = useSession();
  const me = session ? session.user : null;
  const token = session ? session.accessToken : null;

  const setMe = (userInfos) => {
    if(session) session.user = userInfos;
  }
  
  const [user, setUser] = useState(null);
  const [apps, setApps] = useState([]);
  const [tried, setTried] = useState(false);
  
  let p = React.use(params);
  const username = p.username;
  if(!username) notFound();

  useEffect(() => {
    (async () => {
      const url = `${process.env.NEXT_PUBLIC_SYNAPSE_API}/user?username=${username}`
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
      user 
        ? <UserCard 
          user={user} 
          me={me}
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
            <a href={process.env.NEXT_PUBLIC_SYNAPSE_STATIC + "/oauth/register?username=" + username}
            >{process.env.NEXT_PUBLIC_SYNAPSE_STATIC}/oauth/register?username={username}</a>
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