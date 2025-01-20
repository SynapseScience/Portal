import React, { useState, useEffect } from "react";
import Mention from "./Mention";
import Icon from "./Icon";

export default function AppCard({ app, me, session, token }) {

  const redirect_closure = (url: string): Function => {
    function f() {
      window.location.href = url;
    }

    return f;
  };

  const [likes, setLikes] = useState(app.stargazers.length);
  const [liked, setLiked] = useState(false);

  if(likes == app.stargazers.length) {
    if(!liked && me && app.stargazers.includes(me.username)) setLiked(true);
  } 
  
  const like_closure = (client_id: string): Function => {
    async function f() {
      const response = await fetch(session.apiUrl + `/like?client_id=${client_id}`, {
        method: "PUT",
        headers: {
          "Authorization": "Bearer " + token
        }
      })

      if(response.ok) {
        const data = await response.json();

        setLikes(data.application.stargazers.length)
        setLiked(data.application.stargazers.includes(me.username));
      }
    }

    return f;
  }
  
  return <div className="card">
    <h1>{app.title}</h1>
    <span>#{app.client_id} par {app.authors.map((author: string) => 
      <Mention username={author} />
    )}</span>
    <div className="cols">
      <button onClick={like_closure(app.client_id)} className="inverted">{likes} {
        <Icon name="heart" outline={!liked} />
      }</button>
      <button onClick={redirect_closure(app.link)}>Visiter</button>
    </div>
    <p>{app.description}</p>
  </div>

}