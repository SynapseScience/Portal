"use client"

import React, { useState, useEffect } from "react";
import DevAppCard from "../../components/DevAppCard";
import "./Devkit.css";
import { useSession } from "next-auth/react";
import { Application } from "@/types/models";

export default function Devkit() {

  const { data: session } = useSession();
  const me = session ? session.user : null;
  const token = session ? session.accessToken : null;

  const [formData, setFormData] = useState({
    client_id: "",
    title: "",
    description: "",
    type: "outil",
    uris: "",
    link: "",
  });

  type e = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

  const handleChange = (event: e) => {
    const { id, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    const { uris, ...rest } = formData;
    const processedData = {
      ...rest,
      uris: uris.split("\n").filter((uri) => uri.trim() !== ""),
    };

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_SYNAPSE_API + "/application", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(processedData),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setSecret(data.client_secret);
      
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
    }
  };

  const [apps, setApps] = useState([]);

  useEffect(() => {
    (async () => {
      try {
         
        const url = `${process.env.NEXT_PUBLIC_SYNAPSE_API}/drafts`
         
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setApps(data);
         
      } catch (err) {
        console.error(err)
      }
      
    })()
  }, [me, token]);

  const [client_secret, setSecret] = useState(null);

  return <div className="cols equal">
    <div className="bubble full-height">
      <h1>Vos Applications</h1>
      <p>N'importe qui peut soumettre son projet à l'intégration dans l'écosystème Synapse. Chaque soumission sera traitée par un conseil de modération, puis approuvée ou non. Des permissions de base seront alors accordées. Pour obtenir plus d'accès, il sera nécessaire de contacter le support par mail ou sur le serveur discord de la communauté.</p>
      <div id="devkit-results">
        {apps.map((app: Application) => <DevAppCard app={app} />)}
      </div>
    </div>
    <div className="bubble transparent">{
      me ?
      (client_secret ? 
      <div className="form bubble outline">
        <h1>Parfait !</h1>
        <p>Votre application a bien été enregistrée, en attente de validation. Contactez la modération pour faire avancer votre demande ! En attendant, n'oubliez pas de conserver précieusement votre client_secret pour cette application : <code>{client_secret}</code></p>
      </div>
      :
      <div className="form bubble outline">
        <h1>Nouvelle Application</h1>
        <div className="field">
          <span className="field-title">Identifiant</span>
          <span className="guide">3 à 25 caractères minuscules, points ou tirets</span>
          <input
            type="text"
            id="client_id"
            placeholder="myapplication123"
            value={formData.client_id}
            onChange={handleChange}
            pattern="[a-z0-9._\-]{3,25}" 
            minLength={3}
            maxLength={25} 
            required
          />
        </div>
        <div className="field">
          <span className="field-title">Nom de l'application</span>
          <span className="guide">40 caractères maximum</span>
          <input
            type="text"
            id="title"
            placeholder="Mon application Synapse"
            value={formData.title}
            onChange={handleChange}
            maxLength={40}
            required
          />
        </div>
        <div className="field">
          <span className="field-title">Description</span>
          <span className="guide">200 caractères maximum</span>
          <textarea
            id="description"
            placeholder="Gestionnaire de bonbons au brocoli"
            value={formData.description}
            onChange={handleChange}
            maxLength={200}
            required
          />
        </div>
        <div className="field">
          <span className="field-title">Type</span>
          <select id="type" value={formData.type} onChange={handleChange} required>
            <option value="outil">Outil</option>
            <option value="jeu">Jeu</option>
            <option value="plateforme">Plate-forme</option>
            <option value="données">Données</option>
            <option value="forum">Forum</option>
          </select>
        </div>
        <div className="field">
          <span className="field-title">URIs</span>
          <span className="guide">un lien valide par ligne</span>
          <textarea
            id="uris"
            placeholder="https://my-app.com&#10;https://cdn-123.dev"
            value={formData.uris}
            onChange={handleChange}
            required
          />
        </div>
        <div className="field">
          <span className="field-title">Page d'accueil</span>
          <span className="guide">URL invalide</span>
          <input
            type="url"
            id="link"
            placeholder="https://my-app.com"
            value={formData.link}
            onChange={handleChange}
            required
          />
        </div>
        <button onClick={handleSubmit}>Soumettre</button>
      </div>
    ) : <div className="form bubble outline">
          <h1>Oups...</h1>
          <p>Il vous faut être connecté pour soumettre une nouvelle application Synapse !</p>
        </div>}</div>
  </div>;
}