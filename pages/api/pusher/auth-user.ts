import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from '@/lib/auth';
import { pusherServerClient } from '@/lib/pusher';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { socket_id } = req.body;

  // Check that the socket_id is present
  if (!socket_id)
    return res.status(400).send('Bad request. Missing socket_id.');

  // Get user's details from the server
  const session = await getServerSession(req, res);

  // If the session doesn't exist or the user is not authenticated, return an error
  if (!session) return res.status(401).send('Unauthorized');

  const auth = pusherServerClient.authenticateUser(socket_id, {
    id: session.user?.id!,
    email: session.user?.email!,
  });

  res.send(auth);
}
