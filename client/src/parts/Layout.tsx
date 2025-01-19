import React from "react";
import Button from "../synapse-button";
import Icon from "./Icon";
import "./Layout.css";

function MenuItem({ icon, text, to, disabled = false }) {
  return <a href={to} className={"menu-item" + (disabled ? " disabled" : "")}>
    <Icon name={icon} outline={false} /> {text}</a>
}

export default function Layout({ content, me }) {
  return <>
    <nav>
      <h1 id="title">Synapse</h1>
      <Button
        me={me}
        host="https://synapse-api.replit.app"
        uri={window.location.origin}
        />
    </nav>
    <main>
      <nav>
        <MenuItem to="/" icon="house" text="Applications" />
        <MenuItem to="/social" icon="comments" text="Communauté" disabled={true} />
        <MenuItem to="/medias" icon="newspaper" text="Médias" disabled={true} />
        <MenuItem to="/events" icon="calendar-check" text="Évènements" disabled={true} />
        <MenuItem to="/trade" icon="money-bill-trend-up" text="Échanges" disabled={true} />
        <MenuItem to="/devkit" icon="gear" text="Devkit" />
      </nav>
      <main>
        { content }
      </main>
    </main>
  </>;
}