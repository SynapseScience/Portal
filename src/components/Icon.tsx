"use client"

import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "../styles/Icon.css";

import { library } from '@fortawesome/fontawesome-svg-core';
import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import * as regularIcons from '@fortawesome/free-regular-svg-icons';
import * as brandIcons from '@fortawesome/free-brands-svg-icons';

library.add(...Object.values(solidIcons).filter(icon => icon.iconName));
library.add(...Object.values(regularIcons).filter(icon => icon.iconName));
library.add(...Object.values(brandIcons).filter(icon => icon.iconName));

export default function Icon({ className="", name, outline=false, prefix="" }) {
  const iconPrefix = outline ? "far" : prefix;
  return <FontAwesomeIcon className={"icon " + className} icon={[iconPrefix, name]} />;
}