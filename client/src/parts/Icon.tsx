import React from "react";
import { library } from '@fortawesome/fontawesome-svg-core';
import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import * as regularIcons from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./Icon.css";

library.add(...Object.values(solidIcons).filter(icon => icon.iconName));
library.add(...Object.values(regularIcons).filter(icon => icon.iconName));

export default function Icon({ className = "", name, outline = false }) {
  const iconPrefix = outline ? "far" : "fas";
  return <FontAwesomeIcon className={"icon " + className} icon={[iconPrefix, name]} />;
}