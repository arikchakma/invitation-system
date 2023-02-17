import { NextApiRequest, NextApiResponse } from 'next';
import { withProjectAuth } from '@/lib/auth';
import { pusherServerClient } from '@/lib/pusher';

export default withProjectAuth(async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  project
) {
  if (req.method === 'GET') {
    // GET /api/projects/[slug]/message
    res.status(200).json(project);
  } else if (req.method === 'POST') {
    // POST /api/projects/[slug]/message
    const { message, sender } = req.body;
    console.log(message, sender);
    await pusherServerClient.trigger(
      `project-${project?.slug}`,
      'chat-event',
      {}
    );
    res.status(200).json({ message, sender });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
});
