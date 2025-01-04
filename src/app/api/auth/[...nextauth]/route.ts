import NextAuth, { AuthOptions } from "next-auth";

export type TwitchProfile = {
  sub: string
  preferred_username: string
  email: string
  picture: string
}

export default function TwitchProvider(
  options: unknown
): unknown {
  return {
    wellKnown: "https://id.twitch.tv/oauth2/.well-known/openid-configuration",
    id: "twitch",
    name: "Twitch",
    type: "oauth",
    authorization: {
      params: {
        scope: "openid user:read:email user:read:follows",
        claims: {
          id_token: {
            email: null,
            picture: null,
            preferred_username: null,
          },
        },
      },
    },
    idToken: true,
    profile(profile: TwitchProfile) {
      return {
        id: profile.sub,
        name: profile.preferred_username,
        email: profile.email,
        image: profile.picture,
      }
    },
    style: {
      logo: "/twitch.svg",
      logoDark: "/twitch-dark.svg",
      bg: "#fff",
      text: "#65459B",
      bgDark: "#65459B",
      textDark: "#fff",
    },
    options,
  }
}

export const authOptions: AuthOptions = {
  secret: "MXsqeQSZqvht5RE6U7Sg/EqtgKKctiyNm5qA0GoS/HM=",
  providers: [
    TwitchProvider({
      clientId: process.env.TWITCH_CLIENT_ID,
      clientSecret: process.env.TWITCH_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    // async session ({ session, token, user }) {
    //   return {...session, token }
    // },
    // async jwt ({ token, user, account, profile }) {
    //   return {...token, ...account}
    // }
    async session ({ session, token }) {
      return {...session, token }
    },
    async jwt ({ token, account }) {
      return {...token, ...account}
    }
  }
};

const handler =  NextAuth(authOptions)

export { handler as GET, handler as POST }