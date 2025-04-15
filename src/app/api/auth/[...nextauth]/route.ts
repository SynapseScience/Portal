import NextAuth, { Session, CustomUser, JWT } from "next-auth";

const handler = NextAuth({
  providers: [
    {
      id: "synapse",
      name: "Synapse OAuth2",
      type: "oauth",
      authorization: process.env.NEXT_PUBLIC_SYNAPSE_STATIC + "/oauth/login",
      userinfo: process.env.NEXT_PUBLIC_SYNAPSE_API + "/me",
      token: {
        url: process.env.NEXT_PUBLIC_SYNAPSE_API + "/oauth/token",
        async request({ params, provider }) {
          const {
            code,
          } = params;
          const credentials = `${provider.clientId}:${provider.clientSecret}`;
          const base64Credentials = Buffer.from(credentials).toString("base64");

          const response = await fetch(
            process.env.NEXT_PUBLIC_SYNAPSE_API + "/oauth/token?grant_type=authorization_code&code=" + code, 
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${base64Credentials}`,
              },
            }
          );

          const tokens = await response.json();

          if (response.ok) {
            return { tokens }
          } else {
            throw new Error(`Exchange error: ${tokens.message}`);
          }
        }
      },
      clientId: process.env.SYNAPSE_ID,
      clientSecret: process.env.SYNAPSE_SECRET,
      async profile(profile) {
        return {
          ...profile,
          id: profile._id
        };
      }
    }
  ],
  debug: false && process.env.NODE_ENV !== "production",
  session: {
    strategy: "jwt",
    maxAge: 60 * 60
  },
  jwt: {
    maxAge: 60 * 60
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.user = profile;
        token.expiresAt = Math.floor(Date.now() / 1000) + 60 * 60;
      }
      return token;
    },
    async session({ session, token }) {
      
      if (token.expiresAt && Date.now() / 1000 > (token.expiresAt as number)) {
        return {} as Session;
      }
      
      session.accessToken = token.accessToken as string;
      if(token.user) session.user = token.user as CustomUser;

      return session;
    }
  }
});

export { handler as GET, handler as POST };