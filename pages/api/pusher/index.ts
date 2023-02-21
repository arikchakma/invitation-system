import type { NextApiRequest, NextApiResponse } from 'next';
import { pusherServerClient } from '@/lib/pusher';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { message, sender } = req.body;
  try {
    const response = await pusherServerClient.trigger('chat', 'chat-event', {
      message,
      sender,
    });
  } catch (error) {
    console.error('Pusher error: ', error);
  }
  res.json({ message: 'completed' });
}
