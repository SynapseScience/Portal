import React, { useState, useEffect } from "react";
import Mention from "../parts/Mention";
import Icon from "../parts/Icon";
import "./AppPage.css";

function dateToString(dateSeed) {
  let date = new Date(dateSeed);
  let dd = ("" + date.getDate()).padStart(2, "0")
  let mm = ("" + (1 + date.getMonth())).padStart(2, "0")
  let yyyy = date.getFullYear()
  
  return `${dd}/${mm}/${yyyy}`
}

export default function AppPage({ me, session, token }) {

  const [app, setApp] = useState(null);
  const [likes, setLikes] = useState(null);
  const [liked, setLiked] = useState(false);
  const [tried, setTried] = useState(false);

  let client_id = "";
  const url = new URLSearchParams(window.location.search);
  if(url.has("id")) client_id = url.get("id") as string;

  useEffect(() => {
    (async () => {
      const url = `${session.apiUrl}/application?client_id=${client_id}`
      const response = await fetch(url, {
        method: "GET"
      })

      if(response.ok) {
        const appInfos = await response.json();
        setApp(appInfos);
        setLikes(appInfos.stargazers.length)
      }

      setTried(true);

    })();
  }, [client_id]);

  const redirect_closure = (url: string): Function => {
    function f() {
      window.open(url, "_blank");
    }

    return f;
  };

  if(app && likes == app.stargazers.length) {
    if(!liked && me && app.stargazers.includes(me.username)) setLiked(true);
  } 

  const like_closure = (client_id: string): Function => {
    async function f() {
      const response = await fetch(session.apiUrl + 
        `/like?client_id=${client_id}`, {
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

  const tagsTable = [
    {
      "test": (app) => app.verified,
      "line": "Média publié sur le catalogue public",
      "icon": "check"
    },
    {
      "test": (app) => !app.verified,
      "line": "Média en attente de vérification",
      "icon": "hourglass-half"
    },
    {
      "test": (app) => app.permissions.includes("economy"),
      "line": "Application intégrée à l'économie SYN",
      "icon": "coins"
    },
    {
      "test": (app) => app.tags.includes("partenaire"),
      "line": "Partenaire vérifié de l'écosystème Synapse",
      "icon": "handshake"
    },
    {
      "test": (app) => app.tags.includes("open-source"),
      "line": "Code source disponible en sources ouvertes",
      "icon": "git-alt",
      "prefix": "fab"
    },
    {
      "test": (app) => app.tags.includes("indépendant"),
      "line": "Aut.eur.rice indépendant.e",
      "icon": "person"
    }
    
  ]

  return tried && (app ? <div className="cols" style={{ gap: "0px" }}>
      <div className="bubble transparent">
        <div className="bubble outline app" style={{
           backgroundImage: app.thumbnail ? `url(${app.thumbnail})` : "url(none)"
         }}>
          <div className="banner"></div>
          <div className="details">
            <h1>{app.title}</h1>
            <span>#{app.client_id}{
            app.authors.length > 0 ? " par " : ""}{
              app.authors.map((author: string) => {
              if(author.startsWith("$")) {
                return author.replace("$", "").trim();
              } else return <Mention username={author} />;
            })}</span>
            <div className="cols">
              {me && <button 
                  onClick={like_closure(app.client_id)}
                  className="inverted outline"
                >{likes} {<Icon name="heart" outline={!liked} />}</button>
              }
              <button onClick={redirect_closure(app.link)}>Visiter</button>
            </div>
            <p>{app.description}</p>
            {/*
              <div className="tags">{
                app.tags.map(tag => <span className="tag">{tag}</span>)
              }</div>
            */}
              
            <span class="app-date">enregistée le {dateToString(app.creation)}</span>
          </div>
        </div>
      </div>
      <div className="bubble transparent" style={{ marginRight: "0px" }}>
        <h1>Particularités</h1>
        <div className="specs">{
          tagsTable.map(tag => {
            if(tag.test(app)) return <div>{
              <Icon name={tag.icon} prefix={tag.prefix ? tag.prefix : "fas"} />
            }{tag.line}</div>
            else return <></>;
          })
        }</div>
        <h1>Missions</h1>
        {
          app.permissions.includes("economy")
            ? <p>Fonctionnalité en développement.</p>
            : <p>Cette application n'est pas intégrée à l'économie SYN</p>
        }
      </div>
    </div> : <p>Application inconnue</p>
  )

}