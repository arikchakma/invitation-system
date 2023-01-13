import { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { UserProps, WithProjectAuth, WithUserAuth } from '@/types/auth';
import { Session, unstable_getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

export async function getServerSession(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return (await unstable_getServerSession(req, res, authOptions)) as Session;
}

export const withProjectAuth =
  (handler: WithProjectAuth) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res);
    if (!session?.user?.id) return res.status(401).end('Unauthorized');

    const { slug } = req.query;
    if (!slug || typeof slug !== 'string') {
      return res
        .status(400)
        .json({ error: 'Missing or misconfigured project slug' });
    }

    const project = await prisma.project.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        users: {
          where: {
            userId: session.user.id,
          },
          select: {
            role: true,
          },
        },
      },
    });

    if (project) {
      // project exists but user is not part of it
      if (project.users.length === 0) {
        const pendingInvites = await prisma.projectInvite.findUnique({
          where: {
            email_projectId: {
              email: String(session?.user?.email),
              projectId: project.id,
            },
          },
          select: {
            expires: true,
          },
        });
        if (!pendingInvites) {
          return res.status(404).json({ error: 'Project not found' });
        } else if (pendingInvites.expires < new Date()) {
          return res.status(410).json({ error: 'Project invite expired' });
        } else {
          return res.status(409).json({ error: 'Project invite pending' });
        }
      }
    } else {
      // project doesn't exist
      return res.status(404).json({ error: 'Project not found' });
    }

    return handler(req, res, project, session);
  };

export const withUserAuth =
  (
    handler: WithUserAuth,
    {
      needUserDetails,
    }: {
      needUserDetails?: boolean;
    } = {
      needUserDetails: false,
    }
  ) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res);
    if (!session?.user?.id) return res.status(401).end('Unauthorized');

    if (req.method === 'GET') return handler(req, res, session);

    if (needUserDetails) {
      const user = (await prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      })) as UserProps;

      return handler(req, res, session, user);
    }

    return handler(req, res, session);
  };
