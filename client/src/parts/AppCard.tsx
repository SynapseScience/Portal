import React from "react";

export default function AppCard({ app }) {
  return <div className="card">
    <h1>{app.title}</h1>
    <span>#{app.client_id}</span>
    <div className="cols">
      <button className="inverted">{app.stargazers.length} 🖤</button>
      <button>Visiter</button>
    </div>
    <p>{app.description}</p>
  </div>
}