import React, { useState, useEffect } from "react";
import Mention from "./Mention";

export default function AppCard({ app, session, token }) {

  const redirect_closure = (url: string): Function => {
    function f() {
      window.location.href = url;
    }

    return f;
  };

  const [likes, setLikes] = useState(app.stargazers.length);
  
  const like_closure = (client_id: string): Function => {
    async function f() {
      const response = await fetch(session.apiUrl + `/like?client_id=${client_id}`, {
        method: "PUT",
        headers: {
          "Authorization": "Bearer " + token
        }
      })

      const data = await response.json();
      if(data.application) {
        setLikes(data.application.stargazers.length)
      }
    }

    return f;
  }
  
  return <div className="card">
    <h1>{app.title}</h1>
    <span>#{app.client_id} par {app.authors.map(author => 
      <Mention username={author} />
    )}</span>
    <div className="cols">
      <button onClick={like_closure(app.client_id)} className="inverted">{likes} 🖤</button>
      <button onClick={redirect_closure(app.link)}>Visiter</button>
    </div>
    <p>{app.description}</p>
  </div>

}