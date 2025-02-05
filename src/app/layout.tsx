"use client";

import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Button from "../components/synapse-button";
import Icon from "../components/Icon";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

interface Props {
  children: React.ReactNode;
}

function MenuItem({ icon, text, to, disabled = false }) {
  return (
    <a href={to} className={"menu-item" + (disabled ? " disabled" : "")}>
      <Icon name={icon} outline={false} /> {text}
    </a>
  );
}

export default function Layout({ children }: Props) {
  const popup = false;
  const setPopup = (param: any) => true;

  return (
    <SessionProvider>
      <html lang="fr">
        <head>
          <title>Synapse | Portail</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          />
          <link rel="icon" href={process.env.NEXT_PUBLIC_SYNAPSE_STATIC + "/assets/favicon.png"}/>
        </head>
        <body>
          <div id="root">
            <div id="screen" className={popup ? "" : "disabled"} onClick={() => setPopup(null)} />
            <nav>
              <h1 id="title">Synapse</h1>
              <Button
                me={0}
                host="https://api.connectome.fr"
                uri={typeof window !== "undefined" ? window.location.origin : "null"}
              />
            </nav>
            <main>
              <nav>
                <MenuItem to="/" icon="house" text="Applications" />
                <MenuItem to="/social" icon="comments" text="Communauté" disabled />
                <MenuItem to="/medias" icon="newspaper" text="Médias" disabled />
                <MenuItem to="/events" icon="calendar-check" text="Évènements" disabled />
                <MenuItem to="/trade" icon="money-bill-trend-up" text="Échanges" disabled />
                <MenuItem to="/devkit" icon="gear" text="Devkit" />
              </nav>
              <main>{children}</main>
            </main>
            <div id="popup" className={"bubble outline " + (popup ? "" : "disabled")}>{popup}</div>
          </div>
        </body>
      </html>
    </SessionProvider>
  );
}
