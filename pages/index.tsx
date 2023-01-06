import { Inter } from '@next/font/google';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import MaxWidthWrapper from '@/layouts/max-width-wrapper';
import PendingInvitationsTable from '@/components/projects/pending-invitations-table';
import Container from '@/layouts/container';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
	const router = useRouter();
	const session = useSession();

	console.log(session);
	

	useEffect(() => {
		if (session?.status !== 'authenticated') {
			router.push('/login');
		}
	}, [session?.status, router]);

	return (
		<Container>
			<MaxWidthWrapper>
				<PendingInvitationsTable />
			</MaxWidthWrapper>
		</Container>
	);
}
