"use client"

import { useSession } from "next-auth/react";
import "../styles/MissionCard.css";
import { Mission } from "@/types/models";
import { useUser } from "@/context/UserContext";

export default function MissionCard({ mission }: { mission: Mission }) {

  const { user } = useUser();

  type EHandler = React.MouseEventHandler<HTMLButtonElement>;

  const redirect_closure = (url: string): EHandler => {
    function f() {
      window.open(url, "_self");
    }

    return f;
  };

  const done = user && mission.claimed.includes(user.username);
  const tryable = user && !done;

  return <div className="mission bubble outline">
    <div className="top">
      <h2>{mission.title}</h2>
      <div className={"button"}>
        <button className={tryable ? "" : "inverted disabled"} onClick={tryable ? redirect_closure(mission.link) : () => true}>{done ? "Effectuée" : "Effectuer"}</button>
        <span className="syn">+{mission.value}</span>
      </div>
    </div>
    <p>{mission.description}</p>
  </div>

}