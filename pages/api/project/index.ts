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
		} else if (req.method === 'POST') {
			/**
			 * TODO: 1. Check if the user already has a project with the same name
			 * TODO: 2. Create a slug
			 * TODO: 3. Create a project
			 * TODO: 4. Add the user as a member of the project
			 * TODO: 5. Return the project
			 * TODO: 6. Handle errors
			 * TODO: 7. Return a success message
			 */
			const { name, slug } = req.body as {
				name: string;
				slug: string;
			};

			// Guard clause to check if the name and slug are valid
			if (!name || !slug)
				return res.status(400).json({ error: 'Invalid project name or slug' });

			// Chekc slug for invalid characters
			if (!/^[a-z0-9-]+$/.test(slug) || slug.includes(' '))
				return res.status(400).json({ error: 'Invalid project slug' });

			// 1. Check if the user already has a project with the same name
			const existingProject = await prisma.project.findFirst({
				where: {
					slug,
					users: {
						some: {
							userId: user?.id,
						},
					},
				},
			});

			if (existingProject)
				return res
					.status(400)
					.json({ error: 'Project with this name already exists' });
		}
	},
	{
		needUserDetails: true,
	}
);
