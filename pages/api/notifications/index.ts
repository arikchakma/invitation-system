import { withUserAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

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
          message: true,
          createdAt: true,
          seen: true,
        },
      });

      if (!notifications) {
        return res.status(404).json({ message: 'No notifications found' });
      }

      return res.status(200).json(notifications);
    } else if (req.method === 'PUT') {
      const { id } = req.body;

      const notification = await prisma.notifications.update({
        where: {
          id,
        },
        data: {
          seen: true,
        },
      });

      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }

      return res.status(200).json({ notification });
    }
  },
  {
    needUserDetails: true,
  }
);
