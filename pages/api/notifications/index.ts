import { withUserAuth } from '@/lib/auth';

export default withUserAuth(
  async (req, res, session, user) => {
    res.json({ user, session });
  },
  {
    needUserDetails: true,
  }
);
