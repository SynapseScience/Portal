import React, { useState, useEffect } from "react";
import "./UserCard.css";

export default function UserCard({ user, me, session, token, setMe, setUser }) {

  if(!user) return <></>;
  let bttn = <button>Chargement...</button>;

  const [edition, setEdition] = useState(false);
  const [followers, setFollowers] = useState(user.followers.length);
  const [followLine, setFollowline] = useState(null);

  const follow = async () => {
    const url = session.apiUrl + "/follow?username=" + user.username;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Authorization": "Bearer " + token
      }
    })

    if(response.ok) {
      const userInfos = await response.json();
      setFollowers(userInfos.userB.followers.length);

      if(userInfos.userB.followers.includes(userInfos.user.username)) {
        setFollowline("Ne plus suivre");
      } else {
        setFollowline("Commencer à suivre");
      }
    }
  }

  const editProfile = () => {
    setEdition(true);
  }

  const [formData, setFormData] = useState({
    fullname: "",
    pronouns: "",
    description: "",
  });

  if(me) {
    if(me.username !== user.username) {
      if(followLine) {
        bttn = <button onClick={follow}>{followLine}</button>
      } else {
        if(me.following.includes(user.username)) {
          bttn = <button onClick={follow}>Ne plus suivre</button>
        } else {
          bttn = <button onClick={follow}>Commencer à suivre</button>
        }
      }
    } else bttn = <button 
      className="inverted" 
      onClick={editProfile}>Modifier mon profil</button>;

    if(!edition && formData.fullname == "") setFormData({
      fullname: me.fullname,
      description: me.description,
      pronouns: me.pronouns
    })
  }

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const submitProfile = async () => {
    try {
      const res = await fetch(session.apiUrl + "/me", {
        method: "PUT",
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      } else {
        const data = await res.json();
        setEdition(false);
        setMe(data.user);
        setUser(data.user);
      }

    } catch (error) {
      console.error("Erreur lors de la soumission :", error.message);
    }
  }

  return edition ? 
    <div className="profile form bubble"
      style={{ border: "1px solid black "}}>

      <div class="field">
        <span class="field-title">Nom d'usage</span>
        <span class="guide">40 caractères maximum</span>
        <input 
          type="text" 
          id="fullname" 
          placeholder="Richard Feynman" 
          maxlength="40"
          value={formData.fullname}
          onChange={handleChange}
          required 
        />
      </div>

      <div class="field">
        <span class="field-title">Pronoms</span>
        <select 
          id="pronouns"
          required
          value={formData.pronouns}
          onChange={handleChange} >
          <option value="il">il</option>
          <option value="elle">elle</option>
          <option value="iel">iel</option>
        </select>
      </div>

      <div class="field">
        <span class="field-title">Description</span>
        <span class="guide">200 caractères maximum</span>
        <textarea 
          type="text" 
          id="description" 
          placeholder="Addict aux monoxyde de dihydrogène" 
          maxlength="200"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div class="buttons">
        <button onClick={submitProfile}>Modifier</button>
      </div>
    </div>
    : 
    <div className="profile bubble"
    style={{ border: "1px solid black "}}>
    <div className="cols" style={{ gap: "20px" }} >
      <img className="avatar" src={user.avatar && user.avatar.length ? user.avatar :
      `${session.apiUrl.replaceAll('/api', '')}/assets/user.png` } />
      <div className="badges">{
        user.badges.map((badge: string) => {
          return <img
            src={`${window.location.origin}/static/badges/${badge}.png`} />
        })
      }</div>
    </div>
    <h1>{user.fullname}</h1>
    <div className="details">
      <span>@{user.username} - {user.pronouns}</span>
      <span>{followers} abonnés - {user.following.length} abonnements</span>
    </div>
    {bttn}
    <p>{user.description}</p>
  </div>

}