import React, { useState } from "react";
import "../styles/UserCard.css";
import { CustomUser } from "next-auth";
import { useSession } from "next-auth/react";
import { useUser } from "@/context/UserContext";

type Props = {
  displayedUser: CustomUser;
  setDisplayedUser: Function;
}

export default function UserCard({ displayedUser, setDisplayedUser }: Props) {
  let bttn = <></>;

  const { data: session } = useSession();
  const token = session ? session.accessToken : null;
  const { user, updateUser } = useUser();

  const [edition, setEdition] = useState(false);
  const [followers, setFollowers] = useState(displayedUser.followers.length);
  const [followLine, setFollowline] = useState("");
  const [formData, setFormData] = useState({
    fullname: "",
    pronouns: "",
    description: "",
  });

  if(!displayedUser) return <></>;

  const follow = async () => {
    const url = process.env.NEXT_PUBLIC_SYNAPSE_API + "/follow?username=" + displayedUser.username;
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

  if(user) {
    if(user.username !== displayedUser.username) {
      if(followLine) {
        bttn = <button onClick={follow}>{followLine}</button>
      } else {
        if(user.following.includes(displayedUser.username)) {
          bttn = <button 
            className="outline" 
            onClick={follow}>Ne plus suivre</button>
        } else {
          bttn = <button 
            className="outline" 
            onClick={follow}>Commencer à suivre</button>
        }
      }
    } else bttn = <button 
      className="inverted outline" 
      onClick={editProfile}>Modifier mon profil</button>;

    if(!edition && formData.fullname == "") setFormData({
      fullname: user.fullname,
      description: user.description,
      pronouns: user.pronouns
    })
  }

  type E = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
  
  const handleChange = (event: E) => {
    const { id, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const submitProfile = async () => {
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_SYNAPSE_API + "/me", {
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
        updateUser(data.user);
        setDisplayedUser(data.user);
      }

    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
    }
  }

  let placeholderBadges = [];

  for(let i=0; i < (8 - displayedUser.badges.length); i++) {
    placeholderBadges.push(
      <div className="badge placeholder"></div>
    )
  }

  return edition ? 
    <div className="profile form bubble outline">

      <div className="field">
        <span className="field-title">Nom d'usage</span>
        <span className="guide">40 caractères maximum</span>
        <input 
          type="text" 
          id="fullname" 
          placeholder="Richard Feynman" 
          maxLength={40}
          value={formData.fullname}
          onChange={handleChange}
          required 
        />
      </div>

      <div className="field">
        <span className="field-title">Pronoms</span>
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

      <div className="field">
        <span className="field-title">Description</span>
        <span className="guide">200 caractères maximum</span>
        <textarea
          id="description" 
          placeholder="Addict aux monoxyde de dihydrogène" 
          maxLength={200}
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div className="buttons">
        <button onClick={submitProfile}>Modifier</button>
      </div>
    </div>
    : 
    <div className="profile bubble outline">
    <div className="cols" style={{ gap: "20px" }} >
      <img alt="avatar" className="avatar" src={displayedUser.avatar && displayedUser.avatar.length ? displayedUser.avatar :
      `${process.env.NEXT_PUBLIC_SYNAPSE_STATIC}/assets/user.png` } />
      <div className="badges outline">{
        displayedUser.badges.map((badge: string) => {
          return <img
            className="badge"
            alt={"badge " + badge}
            src={`${window.location.origin}/badges/${badge}.png`} />
        })
      }{placeholderBadges}</div>
    </div>
    <h1>{displayedUser.fullname}</h1>
    <div className="details">
      <span>@{displayedUser.username} - {displayedUser.pronouns}</span>
      <span>{followers} abonnés - {displayedUser.following.length} abonnements</span>
    </div>
    {bttn}
    <p>{displayedUser.description}</p>
  </div>

}