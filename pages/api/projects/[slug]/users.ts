import { NextApiRequest, NextApiResponse } from 'next';
import { withProjectAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default withProjectAuth(
  async (req: NextApiRequest, res: NextApiResponse, project) => {
    const { slug } = req.query;
    if (!slug || typeof slug !== 'string') {
      return res
        .status(400)
        .json({ error: 'Missing or misconfigured project slug' });
    }

    // GET /api/projects/[slug]/users – get users for a specific project
    if (req.method === 'GET') {
      const projectId = project?.id as string;
      const users = await prisma.projectUser.findMany({
        where: {
          projectId,
        },
        select: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          createdAt: true,
        },
      });
      return res.status(200).json(
        users.map(u => ({
          ...u.user,
          joinedAt: u.createdAt,
        }))
      );
    } else {
      res.setHeader('Allow', ['GET']);
      return res
        .status(405)
        .json({ error: `Method ${req.method} Not Allowed` });
    }
  }
);
