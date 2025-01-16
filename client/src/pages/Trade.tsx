import React, { useEffect, useState } from "react";
import AppCard from "../parts/AppCard";

import "./Trade.css";

function Mission({ reward, description, action=() => {}, author }) {
  return <div className="mission cols" style={{ gap: "15px" }}>
    <span className="syn">{reward}</span>
    <div>
      <h3>#{author}</h3>
      <p>{description}</p>
      <button onClick={action}>Tenter la mission</button>
    </div>
  </div>
}

export default function Trade({ me, token, session }) {

  return <div className="cols equal">
      <div className="bubble">
        <h1>Échanges</h1>
        <p>Le jeton SYN est au coeur de l'écosystème Synapse, il a pour rôle de rassembler la communauté autour d'objectifs communs et de pousser les utilisateurs ponctuels à l'engagement et à la découverte d'autres projets.</p>
      <ul>
        <li>Gain maximum de <span className="syn right-space">10</span> par Application et par jour</li>
        <li>Uniquement pour les utilisateurs vérifiés</li>
      </ul>
    </div>
    <div className="bubble">
      <h1>Missions</h1>
      <div className="missions">
        <Mission 
          reward={10} 
          description="Vérifier son compte"
          author="synapse-portal"
        />
        <Mission 
          reward={1} 
          description="Suivre un utilisateur"
          author="synapse-portal"
        />
        <Mission 
          reward={1} 
          description="Liker un projet"
          author="synapse-portal"
        />
        <Mission 
          reward={1} 
          description="Dépenser 1 SYN"
          author="synapse-portal"
        />
      </div>
    </div>
  </div>;
  
}