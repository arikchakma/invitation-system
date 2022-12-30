// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { withProjectAuth } from '@/lib/auth';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { hashToken } from '@/lib/hash-token';
import { randomBytes } from 'crypto';

export default withProjectAuth(
	async (req: NextApiRequest, res: NextApiResponse, project) => {
		const { slug } = req.query;

		// Check if the slug is valid
		if (!slug || typeof slug !== 'string')
			return res.status(400).json({ error: 'Invalid project slug' });

		if (req.method === 'GET') {
			/**
			 * GET: /api/projects/[slug]/invite – get all pending invitations
			 * TODO: 1. Get all pending invitations for the project
			 * TODO: 2. Return the invitations
			 */
			const invites = await prisma.projectInvite.findMany({
				where: {
					projectId: project?.id,
				},
				select: {
					email: true,
					createdAt: true,
				},
			});

			// 2. Return the invitations
			return res.status(200).json(
				invites.map((invite) => ({
					email: invite.email,
					invitedAt: invite.createdAt,
				}))
			);
		} else if (req.method === 'POST') {
			/**
			 * POST: /api/projects/[slug]/invite – invite a teammate
			 * TODO: 1. Check if the user is already a member of the project
			 * TODO: 2. Check if the user is already invited to the project
			 * TODO: 3. Create a token
			 * TODO: 4. Hash the token
			 * TODO: 5. Save the token to the database
			 * TODO: 6. Send an email to the user
			 * TODO: 7. Return a success message
			 */
			const { email } = req.body;
			const alreadyInTeam = await prisma.projectUser.findFirst({
				where: {
					projectId: project?.id,
					user: {
						email,
					},
				},
			});
			if (alreadyInTeam) {
				return res
					.status(400)
					.json({ error: 'User already exists in this project' });
			}

			// same method of generating a token as next-auth
			const token = randomBytes(32).toString('hex');
			const ONE_WEEK_IN_SECONDS = 604800;
			const expires = new Date(Date.now() + ONE_WEEK_IN_SECONDS * 1000);

			// create a project invite record and a verification request token that lasts for a week
			// here we use a try catch to account for the case where the user has already been invited
			// for which `prisma.projectInvite.create()` will throw a unique constraint error
			try {
				await prisma.projectInvite.create({
					data: {
						email,
						expires,
						projectId: String(project?.id),
					},
				});

				await prisma.verificationToken.create({
					data: {
						identifier: email,
						token: hashToken(token),
						expires,
					},
				});

				const params = new URLSearchParams({
					callbackUrl: `${process.env.NEXTAUTH_URL}/${slug}`,
					email,
					token,
				});

				const url = `${process.env.NEXTAUTH_URL}/api/auth/callback/email?${params}`;

				return res.status(200).json({ message: 'Invite sent', url });
			} catch (error) {
				return res.status(400).json({ error: 'User already invited' });
			}
		} else {
			res.setHeader('Allow', ['GET', 'POST']);
			return res
				.status(405)
				.json({ error: `Method ${req.method} Not Allowed` });
		}
	}
);
