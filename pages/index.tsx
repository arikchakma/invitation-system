import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Inter } from '@next/font/google';
import { useSession } from 'next-auth/react';
import PendingInvitationsTable from '@/components/projects/pending-invitations-table';
import Container from '@/layouts/container';
import MaxWidthWrapper from '@/layouts/max-width-wrapper';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <Container>
      <MaxWidthWrapper>
        <PendingInvitationsTable />
      </MaxWidthWrapper>
    </Container>
  );
}
