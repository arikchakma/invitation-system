// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { withUserAuth } from '@/lib/auth';
import type { NextApiRequest, NextApiResponse } from 'next';

export default withUserAuth(
	async (req: NextApiRequest, res: NextApiResponse) => {
		res.status(200).json({ name: req.query });
	}
);
