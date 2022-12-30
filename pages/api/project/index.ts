import { withUserAuth } from '@/lib/auth';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default withUserAuth(
	async (req: NextApiRequest, res: NextApiResponse, session, user) => {
		// METHOD GET: /api/projects – get all projects
		if (req.method === 'GET') {
			/**
			 * TODO: 1. Get all projects for the user
			 * TODO: 2. Return the projects
			 */

			// 1. Get all projects for the user
			const projects = await prisma.project.findMany({
				where: {
					users: {
						some: {
							userId: user?.id,
						},
					},
				},
				select: {
					id: true,
					name: true,
					slug: true,
					users: {
						select: {
							role: true,
						},
					},
				},
			});

			if (!projects)
				return res.status(404).json({ error: 'No projects found' });

			// 2. Return the projects
			return res.status(200).json(projects);
		}
	},
	{
		needUserDetails: true,
	}
);
