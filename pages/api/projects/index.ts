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

			// 2. Return the projects
			return res.status(200).json(projects);
		} else if (req.method === 'POST') {
			/**
			 * TODO: 1. Check validation of the name and slug
			 * TODO: 2. Check if the user already has a project with the same name
			 * TODO: 3. Create a project
			 * TODO: 4. Return a success message
			 */
			const { name, slug } = req.body as {
				name: string;
				slug: string;
			};

			// 1. Guard clause to check if the name and slug are valid
			if (!name || !slug)
				return res.status(400).json({ error: 'Invalid project name or slug' });

			// Chekc slug for invalid characters
			if (!/^[a-z0-9-]+$/.test(slug) || slug.includes(' '))
				return res.status(400).json({ error: 'Invalid project slug' });

			// 2. Check if the user already has a project with the same name
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

			// 3. Create a project
			const project = await prisma.project.create({
				data: {
					name,
					slug,
					users: {
						create: {
							role: 'owner',
							user: {
								connect: {
									id: user?.id,
								},
							},
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
							createdAt: true,
						},
					},
				},
			});

			// 4. Return a success message
			return res.status(201).json(project);
		}
	},
	{
		needUserDetails: true,
	}
);
