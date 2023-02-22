import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from '@/lib/auth';
import { pusherServerClient } from '@/lib/pusher';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const socket_id = req.body.socket_id;
  const { user_id } = req.headers;

  if (!user_id || typeof user_id !== 'string') {
    return res.status(404).send('User id not found.');
  }

  // Check that the socket_id is present
  if (!socket_id || Array.isArray(socket_id))
    return res.status(400).send('Bad request. Missing socket_id.');

  // Get user's details from the server
  const session = await getServerSession(req, res);

  // If the session doesn't exist or the user is not authenticated, return an error
  if (!session) return res.status(401).send('Unauthorized');

  const auth = pusherServerClient.authenticateUser(socket_id, {
    id: user_id,
    email: session.user?.email!,
  });

  res.send(auth);
}
