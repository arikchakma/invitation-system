import { createHash } from 'crypto';

export const hashToken = (token: string) => {
  return createHash('sha256')
    .update(`${token}${process.env.NEXTAUTH_SECRET}`)
    .digest('hex');
};
