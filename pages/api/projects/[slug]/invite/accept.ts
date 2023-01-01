import { withUserAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default withUserAuth(
	async (req: NextApiRequest, res: NextApiResponse, session) => {
		const { slug } = req.query as { slug: string };
		if (!slug || typeof slug !== 'string') {
			return res
				.status(400)
				.json({ error: 'Missing or misconfigured project slug' });
		}
		if (req.method === 'POST') {
			const invite = await prisma.projectInvite.findFirst({
				where: {
					email: String(session?.user?.email),
					project: {
						slug,
					},
				},
				select: {
					expires: true,
					projectId: true,
				},
			});
			if (!invite) {
				return res.status(404).json({ error: 'Invalid invitation' });
			} else if (invite.expires < new Date()) {
				return res.status(410).json({ error: 'Invitation expired' });
			} else {
				const response = await Promise.all([
					prisma.projectUser.create({
						data: {
							userId: String(session?.user?.id),
							role: 'member',
							projectId: invite.projectId,
						},
					}),
					prisma.projectInvite.delete({
						where: {
							email_projectId: {
								email: String(session?.user?.email),
								projectId: invite.projectId,
							},
						},
					}),
				]);
				return res.status(200).json(response);
			}
		}
	}
);
