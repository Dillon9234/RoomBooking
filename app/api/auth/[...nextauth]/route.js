import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from '@/utils/mongodb'
import nextCors from 'next-cors'

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (
          credentials.username === 'admin' &&
          credentials.password === 'password'
        ) {
          return { id: '1', name: 'Admin', role: 'admin' }
        }
        return null
      },
    }),
  ],
  session: {
    strategy: 'database',
  },
  callbacks: {
    async session({ session, user }) {
      session.user.role = user?.role || 'user'
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = async (req, res) => {
  await nextCors(req, res, {
    origin: 'http://localhost:5173', // Allow requests from React frontend
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })

  return NextAuth(req, res, authOptions)
}

export { handler as GET, handler as POST }
