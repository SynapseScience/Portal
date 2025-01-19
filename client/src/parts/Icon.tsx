import React from "react";
import { library } from '@fortawesome/fontawesome-svg-core';
import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

library.add(...Object.values(solidIcons).filter(icon => icon.iconName));

export default function Icon({ name }) {
  return <FontAwesomeIcon icon={name} />
}