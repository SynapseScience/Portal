"use client"

import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "../styles/Icon.css";

import { library, IconDefinition, IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';
import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import * as regularIcons from '@fortawesome/free-regular-svg-icons';
import * as brandIcons from '@fortawesome/free-brands-svg-icons';

let fas = Object.values(solidIcons) as IconDefinition[];
let far = Object.values(regularIcons) as IconDefinition[];
let fab = Object.values(brandIcons) as IconDefinition[];

library.add(...fas.filter(icon => icon.iconName));
library.add(...far.filter(icon => icon.iconName));
library.add(...fab.filter(icon => icon.iconName));

type P = {
  className?: string;
  name: string;
  outline?: boolean;
  prefix?: string;
}

export default function Icon({ className="", name, outline=false, prefix="fas" }: P) {
  const iconName = name as IconName;
  const iconPrefix = outline ? "far" : prefix as IconPrefix;
  return <FontAwesomeIcon className={"icon " + className} icon={[iconPrefix, iconName]} />;
}