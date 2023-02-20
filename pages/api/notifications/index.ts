import { withUserAuth } from '@/lib/auth';
import prisma  from '@/lib/prisma';

export default withUserAuth(
  async (req, res, session, user) => {
    if (req.method === 'GET') {
      const notifications = await prisma.notifications.findMany({
        where: {
          userId: user?.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          type: true,
        }
      })
    }
  },
  {
    needUserDetails: true,
  }
);
