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
  account: number;
}

export interface Mission {
  mission_id: string;
  reward: number;
  title: string;
  creation: Date;
  description: string;
  link: string;
  application: string;
  claimed: string[];
}