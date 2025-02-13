export interface Application {
  authors: string[];
  client_id: string;
  title: string;
  thumbnail?: string;
  description: string;
  verified: boolean;
  link: string;
  creation: string;
  tags: string[];
  permissions: string[];
  stargazers: string[];
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