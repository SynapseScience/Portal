"use client"

import { useSession } from "next-auth/react";
import "../styles/MissionCard.css";
import { Mission } from "@/types/models";

export default function MissionCard({ mission }: { mission: Mission }) {

  const { data: session } = useSession();
  const me = session ? session.user : null;

  type EHandler = React.MouseEventHandler<HTMLButtonElement>;

  const redirect_closure = (url: string): EHandler => {
    function f() {
      window.open(url, "_self");
    }

    return f;
  };

  const done = me && mission.claimed.includes(me.username);
  const tryable = me && !done;

  return <div className="mission bubble outline">
    <div className="top">
      <h2>{mission.title}</h2>
      <div className={"button"}>
        <button className={tryable ? "" : "inverted disabled"} onClick={tryable ? redirect_closure(mission.link) : () => true}>{done ? "Effectuée" : "Effectuer"}</button>
        <span className="syn">+{mission.reward}</span>
      </div>
    </div>
    <p>{mission.description}</p>
  </div>

}