import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth, { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import prisma from '@/lib/prisma';
import sendMail from 'emails';
import AccountCreated from 'emails/AccountCreated';

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		EmailProvider({
			sendVerificationRequest({ identifier, url }) {
				sendMail({
					to: identifier,
					component: <AccountCreated email={identifier} url={url} />,
				});
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
