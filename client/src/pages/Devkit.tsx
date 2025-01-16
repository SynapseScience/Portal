import React, { useState, useEffect } from "react";



export default function Devkit({ me, session }) {

  const [formData, setFormData] = useState({
    client_id: "",
    title: "",
    description: "",
    type: "Outil",
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
          "Authorization": "Bearer " + session.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(processedData),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log(data)
    } catch (error) {
      console.error("Erreur lors de la soumission :", error.message);
    }
  };

  return <div className="cols equal">
    <div className="bubble">
      <h1>Vos Applications</h1>
      <p>N'importe qui peut soumettre son projet à l'intégration dans l'écosystème Synapse. Chaque soumission sera traitée par un conseil de modération, puis approuvée ou non. Des permissions de base seront alors accordées. Pour obtenir plus d'accès, il sera nécessaire de contacter le support par mail ou sur le serveur discord de la communauté.</p>
      <ul>
        <li>Maximum de 3 applications par utilisateur</li>
      </ul>
    </div>
    <div className="bubble">
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
            <option>Outil</option>
            <option>Jeu</option>
            <option>Plate-forme</option>
            <option>Données</option>
            <option>Forum</option>
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
    </div>
  </div>;
}