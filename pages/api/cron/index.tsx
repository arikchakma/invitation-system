import sendMail from 'emails';
import ReminderEmail from 'emails/ReminderEmail';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'POST') {
		try {
			const { authorization } = req.headers;

			if (authorization === `Bearer ${process.env.API_SECRET_KEY}`) {
				const today = `${new Date().getDate()}-${
					new Date().getMonth() + 1
				}-${new Date().getFullYear()}`;

				sendMail({
					subject: `${today} - Did you code today?`,
					to: 'hello@arikko.com',
					component: <ReminderEmail headline={`${today} - Reminder`} />,
				});

				res.status(200).json({ success: true });
			} else {
				res.status(401).json({ success: false });
			}
		} catch (err) {
			res.status(500).json({ statusCode: 500, message: (err as any).message });
		}
	} else {
		res.setHeader('Allow', 'POST');
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
