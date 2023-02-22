import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from '@/lib/auth';
import { pusherServerClient } from '@/lib/pusher';

export default async function pusherAuthEndpoint(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { channel_name, socket_id } = req.body;
  const { user_id } = req.headers;

  // Check that the socket_id is present
  if (!socket_id)
    return res.status(400).send('Bad request. Missing socket_id.');

  let auth;
  // If the channel is a presence channel, authenticate the user
  if (/presence-/.test(channel_name)) {
    if (!user_id || typeof user_id !== 'string') {
      return res.status(404).send('User id not found');
    }

    // Get user's details from the server
    const session = await getServerSession(req, res);

    // If the session doesn't exist or the user is not authenticated, return an error
    if (!session) return res.status(401).send('Unauthorized');

    auth = pusherServerClient.authorizeChannel(socket_id, channel_name, {
      user_id,
      user_info: {
        name: session.user?.name!,
        email: session.user?.email!,
      },
    });
  } else {
    auth = pusherServerClient.authorizeChannel(socket_id, channel_name);
  }

  res.send(auth);
}
