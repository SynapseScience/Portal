import React, { useState, useEffect } from "react";
import Mention from "./Mention";
import Icon from "./Icon";
import "../styles/AppCard.css";

export default function AppCard({ app, session, token }) {

  return <div className="card devkit outline">
    <h1>{app.verified ? <Icon name="circle-check" /> : <Icon name="hourglass-half" /> } {app.title}</h1>
    <span>#{app.client_id} par {app.authors.map((author: string) => 
      <Mention username={author} />
    )}</span>
    
    {app.permissions.length > 0 && <ul>{
       app.permissions.map((permission: string) => <li><code>{permission}</code></li>)    
    }</ul>}
  </div>

}