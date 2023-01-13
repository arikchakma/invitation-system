// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { withProjectAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default withProjectAuth(
  async (req: NextApiRequest, res: NextApiResponse, project) => {
    if (req.method === 'GET') {
      // GET /api/projects/[slug]
      res.status(200).json(project);
    } else if (req.method === 'PUT') {
      // PUT /api/projects/[slug]
      const { name } = req.body;
      const updatedProject = await prisma.project.update({
        where: {
          id: project?.id,
        },
        data: {
          name,
        },
      });
      res.status(200).json(updatedProject);
    } else {
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
);
