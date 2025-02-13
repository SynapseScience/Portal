import { DefaultSession, NextAuthJWT } from "next-auth";
import { User } from "./models";

declare module "next-auth" {
  
  type CustomUser = User;
  
  interface Session {
    accessToken: string;
    user: User;
  }

  interface JWT {
    accessToken?: string;
    user?: User;
    expiresAt?: number;
  }
}