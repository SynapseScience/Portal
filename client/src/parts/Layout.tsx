import React from "react";
import Button from "../synapse-button";

export default function Layout({ session, content }) {
  return <>
    <nav>
      <h1 id="title">Synapse</h1>
      <Button 
        host="https://synapse-api.replit.app"
        uri={window.location.origin}
        session={session}
        />
    </nav>
    <main>
      {content}
    </main>
  </>;
}