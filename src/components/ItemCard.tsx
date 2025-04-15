"use client"

import { useSession } from "next-auth/react";
import "../styles/MissionCard.css";
import { Item } from "@/types/models";

export default function ItemCard({ item }: { item: Item }) {
  
  const { data: session } = useSession();
  const me = session ? session.user : null;
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
      }
    }

    return f;
  };

  const tryable = me && me.balance >= item.value;

  return <div className="mission bubble outline">
    <div className="top">
      <h2>{item.title}</h2>
      <div className={"button"}>
        <button className={tryable ? "" : "inverted disabled"} onClick={tryable 
        ? buy_closure(item.item_id) 
        : () => true
        }>Acheter</button>
        <span className="syn">-{item.value}</span>
      </div>
    </div>
    <p>{item.description}</p>
  </div>

}