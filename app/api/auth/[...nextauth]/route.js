import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/utils/mongodb";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Replace this with your own authentication logic (check DB, hash passwords, etc.)
        if (credentials.username === "admin" && credentials.password === "password") {
          return { id: "1", name: "Admin", role: "admin" }; // Example user object
        }
        return null; // Authentication failed
      }
    })
  ],
  session: {
    strategy: "database", // Uses MongoDB sessions instead of JWT
  },
  callbacks: {
    async session({ session, user }) {
      session.user.role = user?.role || "user";
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
