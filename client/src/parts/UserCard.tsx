import React from "react";

export default function UserCard({ user, me, session, token }) {

  let button = <></>;

  if(me) {
    if(me.username == user.username) {
      // button = <button className="inverted">Modifier mon profil</button>
    } else {
      if(me.following.includes(user.username)) {
        button = <button>Ne plus suivre</button>
      } else {
        button = <button>Commencer à suivre</button>
      }
    }
  }

  return user && <div className="profile bubble"
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
    <span><span>@{user.username}</span> - <span>{user.pronouns}</span></span>
    <span>
      <span>{user.followers.length}</span> abonnés - <span>{
      user.following.length
      }</span> abonnements</span>
    {button}
    <p>{user.description}</p>
  </div>

}