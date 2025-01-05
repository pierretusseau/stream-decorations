import NextAuth, {
  // AuthOptions
} from "next-auth";
import TwitchProvider from "next-auth/providers/twitch";
// import GithubProvider from "next-auth/providers/github"
// import GoogleProvider from "next-auth/providers/google"

// SRC => https://medium.com/@gabrielenapoli.dev/how-to-authenticate-with-twitch-and-next-js-bec0d35f0b46
// SRC => https://www.youtube.com/watch?app=desktop&v=W3HulvsuqGI&t=1180s

export const authOptions = {
  secret: process.env.AUTH_SECRET,
  // Configure one or more authentication providers
  providers: [
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID!,
    //   clientSecret: process.env.GITHUB_SECRET!,
    // }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_ID!,
    //   clientSecret: process.env.GOOGLE_SECRET!,
    // }),
    TwitchProvider({
      clientId: process.env.AUTH_TWITCH_ID!,
      clientSecret: process.env.AUTH_TWITCH_SECRET!,
      authorization: {
        params: {
          scope: 'openid user:read:email moderator:read:followers'
        }
      }
    }),
  ],
  callbacks: {
    // @ts-expect-error : Don't know the types for this
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    // @ts-expect-error : Don't know the types for this
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken
      return session
    }
  }
}

const handler = NextAuth(authOptions)
// export default handler
export { handler as GET, handler as POST }