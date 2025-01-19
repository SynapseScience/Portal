import React, { useState, useEffect } from "react";
import AppCard from "../parts/AppCard";
import "./Devkit.css";

export default function Devkit({ me, token, session }) {

  const [formData, setFormData] = useState({
    client_id: "",
    title: "",
    description: "",
    type: "outil",
    uris: "",
    link: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
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
      const res = await fetch(session.apiUrl + "/application", {
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
      console.error("Erreur lors de la soumission :", error.message);
    }
  };

  const [apps, setApps] = useState([]);

  useEffect(() => {
    (async () => {
      try {
         
        let url = `${session.apiUrl}/drafts`
         
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
    <div className="bubble">
      <h1>Vos Applications</h1>
      <p>N'importe qui peut soumettre son projet à l'intégration dans l'écosystème Synapse. Chaque soumission sera traitée par un conseil de modération, puis approuvée ou non. Des permissions de base seront alors accordées. Pour obtenir plus d'accès, il sera nécessaire de contacter le support par mail ou sur le serveur discord de la communauté.</p>
      <ul>
        <li>Maximum de 3 applications par utilisateur (pour l'instant)</li>
      </ul>
      <div id="devkit-results">
        {apps.map(app => <AppCard app={app} session={session} token={token} />)}
      </div>
    </div>
    <div className="bubble">{
      client_secret ? 
      <div className="form bubble" style={{ border: "1px solid black" }}>
        <h1>Parfait !</h1>
        <p>Votre application a bien été enregistrée, en attente de validation. Contactez la modération pour faire avancer votre demande ! En attendant, n'oubliez pas de conserver précieusement votre client_secret pour cette application : <code>{client_secret}</code></p>
      </div>
      :
      <div className="form bubble" style={{ border: "1px solid black" }}>
        <h1>Nouvelle Application</h1>
        <div className="field">
          <span className="field-title">Identifiant</span>
          <input
            type="text"
            id="client_id"
            placeholder="myapplication123"
            value={formData.client_id}
            onChange={handleChange}
          />
        </div>
        <div className="field">
          <span className="field-title">Nom de l'application</span>
          <input
            type="text"
            id="title"
            placeholder="Mon application Synapse"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        <div className="field">
          <span className="field-title">Description</span>
          <textarea
            id="description"
            placeholder="Gestionnaire de bonbons au brocoli"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div className="field">
          <span className="field-title">Type</span>
          <select id="type" value={formData.type} onChange={handleChange}>
            <option value="outil">Outil</option>
            <option value="jeu">Jeu</option>
            <option value="plateforme">Plate-forme</option>
            <option value="données">Données</option>
            <option value="forum">Forum</option>
          </select>
        </div>
        <div className="field">
          <span className="field-title">URIs</span>
          <textarea
            id="uris"
            placeholder="https://my-app.com&#10;https://cdn-123.dev"
            value={formData.uris}
            onChange={handleChange}
          />
        </div>
        <div className="field">
          <span className="field-title">Lien</span>
          <input
            type="text"
            id="link"
            placeholder="https://my-app.com"
            value={formData.link}
            onChange={handleChange}
          />
        </div>
        <button onClick={handleSubmit}>Soumettre</button>
      </div>
    }</div>
  </div>;
}