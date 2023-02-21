import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { pusherServerClient } from '@/lib/pusher';

export default async function pusherAuthEndpoint(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { channel_name, socket_id } = req.body;

  // Check that the socket_id is present
  if (!socket_id)
    return res.status(400).send('Bad request. Missing socket_id.');

  let auth;
  // If the channel is a presence channel, authenticate the user
  if (/presence-/.test(channel_name)) {
    // Get user's details from the server
    const session = await getServerSession(req, res);

    // If the session doesn't exist or the user is not authenticated, return an error
    if (!session) return res.status(401).send('Unauthorized');
    const projectId = channel_name.split('-')[2];

    const projectUser = await prisma.projectUser.findFirst({
      where: {
        userId: session.user?.id,
        projectId: projectId,
      },
    });

    if (!projectUser) return res.status(400).send('Unauthorized');

    auth = pusherServerClient.authorizeChannel(socket_id, channel_name, {
      user_id: session.user?.id!,
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
