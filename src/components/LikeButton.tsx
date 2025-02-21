"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Application } from "@/types/models";
import Icon from "./Icon";

type LikeProps = {
  app: Application;
}

export default function LikeButton({ app }: LikeProps) {
  const { data: session } = useSession();
  const me = session ? session.user : null;

  let [likes, setLikes] = useState(app.stargazers.length);
  let [liked, setLiked] = useState(me ? app.stargazers.includes(me.username) : false);

  type EHandler = React.MouseEventHandler<HTMLButtonElement>;
  
  const like_closure = (client_id: string): EHandler => {
    async function f() {
      const url = process.env.NEXT_PUBLIC_SYNAPSE_API + `/like?client_id=${client_id}`;
      const response = session && await fetch(url, {
        method: "PUT",
        headers: {
          "Authorization": "Bearer " + session.accessToken
        }
      })

      if(response && me && response.ok) {
        const data = await response.json();

        setLikes(data.application.stargazers.length);
        setLiked(data.application.stargazers.includes(me.username));
      }
    }

    return f;
  }

  return me ? <button 
    onClick={like_closure(app.client_id)} 
    className="inverted outline">{likes} {
    <Icon name="heart" outline={!liked} />
  }</button> : <button className="inverted outline disabled">{likes} {
    <Icon name="heart" outline={true} />
  }</button>
  
}