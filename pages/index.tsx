import { Inter } from '@next/font/google';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import MaxWidthWrapper from '@/layouts/max-width-wrapper';
import PendingInvitationsTable from '@/components/projects/pending-invitations-table';
import Container from '@/layouts/Container';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
	const router = useRouter();
	const session = useSession();

	useEffect(() => {
		if (!session) router.push('/login');
	});

	return (
		<Container>
			<MaxWidthWrapper>
				<PendingInvitationsTable />
			</MaxWidthWrapper>
		</Container>
	);
}
