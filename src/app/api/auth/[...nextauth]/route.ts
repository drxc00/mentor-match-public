import NextAuth from "next-auth";
import User from "@/models/user.model";
import connect from "@/utils/db.config";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions, NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import { authOptions } from "@/utils/auth";

const bcryptjs = require("bcryptjs");

interface session {
    user: any
}
// const authOptions: NextAuthOptions = {
//     providers: [
//         CredentialsProvider({
//             id: "credentials",
//             name: "Credentials",
//             credentials: {
//                 username: { label: "username", type: "text" },
//                 password: { label: "password", type: "password" }
//             },
//             async authorize(credentials: any) {
//                 await connect();
//                 try {
//                     const userData = await User.findOne({ username: credentials.username });
//                     if (userData) {
//                         const isPasswordMatch = await bcryptjs.compare(credentials.password, userData.password);
//                         if (isPasswordMatch) {
//                             return userData;
//                         }
//                     }
//                     return null; // Return null if user is not found or password doesn't match
//                 } catch (err: any) {
//                     throw new Error(err.message);
//                 }
//             }
//         })
//     ],
//     session: {
//         strategy: "jwt",
//         maxAge: 30 * 24 * 60 * 60,
//     },
//     secret: process.env.NEXTAUTH_SECRET,
//     // jwt: {
//     //     signingKey: process.env.JWT_SIGNING_PRIVATE_KEY!,
//     // },
//     pages: {
//         signIn: '/login',
//         error: '/login'
//       },
//     callbacks: {
//         async jwt({ token, user, trigger, session }: any) {
//             if (user) {
//                 token.user = user;
//             }

//             // this is for updating the client token
//             if (trigger === 'update' && session){
//                 token.user.username = session.username;
//                 token.user.name = session.name;
//                 token.user.email = session.email;
//                 token.user.tags = session.tags;
//                 token.user.profile_picture = session.profile_picture;
//             }
            
//             return token;
//         },async session({ session: session, token }: { session: any; token: any }) {
//             session.user = token.user;
//             return session;
//         },
//     }
// };

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };