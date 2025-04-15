"use client"

import { useSession } from "next-auth/react";
import "../styles/MissionCard.css";
import { Item } from "@/types/models";
import { useUser } from "@/context/UserContext";

export default function ItemCard({ item }: { item: Item }) {

  const { user, updateUser } = useUser();
  const { data: session } = useSession();
  const token = session ? session.accessToken : null;

  type EHandler = React.MouseEventHandler<HTMLButtonElement>;

  const buy_closure = (item_id: string): EHandler => {
    async function f() {
      let url = process.env.NEXT_PUBLIC_SYNAPSE_API + `/give?item_id=${item_id}`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + token
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else updateUser();
    }

    return f;
  };

  const tryable = user && user.balance >= item.value;
  const done = item.badge && user ? user.badges.includes(item.badge) : false

  return <div className="mission bubble outline">
    <div className="top">
      <h2>{item.title}</h2>
      <div className={"button"}>
        <button className={tryable && !done ? "" : "inverted disabled"} onClick={tryable 
        ? buy_closure(item.item_id) 
        : () => true
        }>{done ? "Obtenu" : "Obtenir"}</button>
        <span className="syn">-{item.value}</span>
      </div>
    </div>
    <p>{item.description}</p>
  </div>

}