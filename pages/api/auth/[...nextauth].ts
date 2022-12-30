import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth, { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import prisma from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		EmailProvider({
			server: {
				host: process.env.EMAIL_SERVER_HOST,
				port: process.env.EMAIL_SERVER_PORT,
				auth: {
					user: process.env.EMAIL_SERVER_USER,
					pass: process.env.EMAIL_SERVER_PASSWORD,
				},
			},
			from: process.env.EMAIL_FROM,
			sendVerificationRequest({ identifier: email, url, token, provider }) {
				// console.log('sendVerificationRequest: ', email, url, token, provider);
				console.log('Login url: ', url);
			},
		}),
	],
	callbacks: {
		async signIn({ user, account, profile, email, credentials }) {
			// Create username from name
			return true;
		},
		session: async ({ session, token }) => {
			if (session?.user) {
				session.user.id = token.sub as string;
			}
			return session;
		},
	},
	session: {
		strategy: 'jwt',
	},
	secret: process.env.NEXTAUTH_SECRET,
	debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);
