import React, { useState, useEffect } from "react";
import "./UserCard.css";

export default function UserCard({ user, me, session, token }) {

  let button = <></>;
  if(!user) return <></>;

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

  if(me) {
    if(me.username == user.username) {
      button = <button className="inverted disabled">Modifier mon profil</button>
    } else {
      if(followLine) {
        button = <button onClick={follow}>{followLine}</button>
      } else {
        if(me.following.includes(user.username)) {
          button = <button onClick={follow}>Ne plus suivre</button>
        } else {
          button = <button onClick={follow}>Commencer à suivre</button>
        }
      }
    }
  }

  return <div className="profile bubble"
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
    {button}
    <p>{user.description}</p>
  </div>

}