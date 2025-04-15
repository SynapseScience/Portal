export interface Application {
  authors: string[];
  client_id: string;
  title: string;
  description: string;
  verified: boolean;
  link: string;
  creation: string;
  tags: string[];
  permissions: string[];
  stargazers: string[];
  type: string;
  thumbnail?: string;
}

export interface User {
  fullname: string;
  username: string;
  id: number;
  avatar?: string;
  following: string[];
  badges: string[];
  followers: string[];
  description: string;
  pronouns: string;
  balance: number;
}

export interface Mission {
  mission_id: string;
  value: number;
  title: string;
  creation: Date;
  description: string;
  link: string;
  application: string;
  claimed: string[];
}

export interface Item {
  item_id: string;
  value: number;
  title: string;
  creation: Date;
  description: string;
  link: string;
  application: string;
  claimed: string[];
  badge?: string;
}