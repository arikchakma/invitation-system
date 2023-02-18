import { NextApiRequest, NextApiResponse } from 'next';
import { withProjectAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { pusherServerClient } from '@/lib/pusher';

export default withProjectAuth(async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  project,
  session
) {
  if (req.method === 'GET') {
    // GET /api/projects/[slug]/message
    res.status(200).json(project);
  } else if (req.method === 'POST') {
    // POST /api/projects/[slug]/message
    const { message } = req.body;
    await pusherServerClient.trigger(`project-${project?.id}`, 'chat-event', {
      message,
      sender: session?.user?.email,
    });
    res.status(200).json({ message, sender: session?.user?.email });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
});
