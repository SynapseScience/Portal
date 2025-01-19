import React from "react";
import "./Mention.css";

export default function Mention({ username }) {

  return <a 
    href={`${window.location.origin}/profile?username=${username}`}
    className="mention"
    >@{username}</a>

}