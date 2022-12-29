// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'GET') {
		/**
		 * GET: /api/projects/[slug]/invite – get all pending invitations
		 * TODO: 1. Check if the user is authenticated
		 * TODO: 2. Check if the user is the owner of the project
		 * TODO: 3. Get all pending invitations for the project
		 * TODO: 4. Return the invitations
		 */
		const { slug } = req.query;

		// Check if the slug is valid
		if (!slug || typeof slug !== 'string')
			return res.status(400).json({ error: 'Invalid project slug' });

		// 1. Check if the user is authenticated
		
	} else if (req.method === 'POST') {
		/**
		 * POST: /api/projects/[slug]/invite – invite a teammate
		 * TODO: 1. Check if the user is authenticated
		 * TODO: 2. Check if the user is the owner of the project
		 * TODO: 3. Check if the user is already a member of the project
		 * TODO: 4. Check if the user is already invited to the project
		 * TODO: 5. Create a token
		 * TODO: 6. Hash the token
		 * TODO: 7. Save the token to the database
		 * TODO: 8. Send an email to the user
		 * TODO: 9. Return a success message
		 */
	} else {
		res.setHeader('Allow', ['GET', 'POST']);
		return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
	}
}
