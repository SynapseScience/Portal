import React from "react";
import "../styles/Mention.css";

export default function Mention({ username }: { username: string }) {

  return <a 
    href={`../../../../profile/${username}`}
    className="mention"
    >@{username}</a>

}