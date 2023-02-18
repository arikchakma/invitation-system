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
    const messages = await prisma.projectMessages.findMany({
      where: {
        projectId: project?.id,
      },
      select: {
        id: true,
        message: true,
        user: {
          select: {
            email: true,
          },
        },
      },
    });
    const formattedMessages = messages.map(m => ({
      id: m.id,
      message: m.message,
      sender: m.user.email,
    }));
    res.status(200).json({ messages: formattedMessages });
  } else if (req.method === 'POST') {
    // POST /api/projects/[slug]/message
    const { message } = req.body;
    const m = await prisma.projectMessages.create({
      data: {
        message,
        userId: session?.user?.id!,
        projectId: project?.id!,
      },
    });
    await pusherServerClient.trigger(`project-${project?.id}`, 'chat-event', {
      id: m.id,
      message,
      sender: session?.user?.email,
    });
    res.status(200).json({ message, sender: session?.user?.email });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
});
