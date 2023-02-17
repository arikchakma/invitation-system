import type { NextApiRequest, NextApiResponse } from 'next';
import { pusherServerClient } from '@/lib/pusher';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { message, sender } = req.body;
  await pusherServerClient.trigger('chat', 'chat-event', {
    message,
    sender,
  });

  res.json({ message: 'completed' });
}
