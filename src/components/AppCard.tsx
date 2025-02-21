import React, { useState } from "react";
import Mention from "./Mention";
import Icon from "./Icon";
import "../styles/AppCard.css";
import { useSession } from "next-auth/react";
import { Application } from "@/types/models";

export default function AppCard({ app }: { app: Application }) {

  type EHandler = React.MouseEventHandler<HTMLButtonElement>;

  const redirect_closure = (client_id: string): EHandler => {
    function f() {
      window.open(`${window.location.origin}/app/${client_id}`, "_self");
    }

    return f;
  };

  const { data: session } = useSession();
  const me = session ? session.user : null;
  
  const [likes, setLikes] = useState(app.stargazers.length);
  const [liked, setLiked] = useState(false);

  if(likes == app.stargazers.length) {
    if(!liked && me && app.stargazers.includes(me.username)) setLiked(true);
  } 
  
  const like_closure = (client_id: string): EHandler => {
    async function f() {
      const url = process.env.NEXT_PUBLIC_SYNAPSE_API + `/like?client_id=${client_id}`;
      const response = session && await fetch(url, {
        method: "PUT",
        headers: {
          "Authorization": "Bearer " + session.accessToken
        }
      })

      if(response && me && response.ok) {
        const data = await response.json();

        setLikes(data.application.stargazers.length)
        setLiked(data.application.stargazers.includes(me.username));
      }
    }

    return f;
  }
  
  return <div className="card outline" style={{
     backgroundImage: app.thumbnail ? `url(${app.thumbnail})` : "url(none)"
   }}>
    <div className="banner">
      {app.tags.includes("partenaire") ? <Icon className="outline" name="handshake" /> : <></>}
      {app.permissions.length > 0 ? <Icon className="outline" name="user-lock" /> : <></>}
      {app.permissions.includes("economy") ? <Icon className="outline" name="coins" /> : <></>}
    </div>
    <div className="details">
      <h1>{app.title}</h1>
      <span>#{app.client_id}{app.authors.length > 0 ? " par " : ""}{app.authors.map((author: string) => {
        if(author.startsWith("$")) {
          return author.replace("$", "").trim();
        } else return <Mention username={author} />;
      })}</span>
      <div className="cols">
        {me ? <button onClick={like_closure(app.client_id)} className="inverted outline">{likes} {
          <Icon name="heart" outline={!liked} />
        }</button> : <button className="inverted outline disabled">{likes} {
          <Icon name="heart" outline={true} />
        }</button>}
        <button onClick={redirect_closure(app.client_id)}>Détails</button>
      </div>
      <p>{app.description}</p>
    </div>
  </div>

}