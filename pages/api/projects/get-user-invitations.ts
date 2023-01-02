import { withUserAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default withUserAuth(
	async (req, res, session, user) => {
		if (req.method === 'GET') {
			/**
			 * GET: /api/projects/[slug]/invite – get all pending invitations
			 * TODO: 1. Get all pending invitations for the project
			 * TODO: 2. Return the invitations
			 */
			const invites = await prisma.projectInvite.findMany({
				where: {
					email: user?.email,
				},
				select: {
					email: true,
					createdAt: true,
				},
			});

			res.status(200).json(invites);
		} else {
			res.setHeader('Allow', ['GET']);
			return res
				.status(405)
				.json({ error: `Method ${req.method} Not Allowed` });
		}
	},
	{
		needUserDetails: true,
	}
);
