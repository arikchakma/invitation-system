import { Inter } from '@next/font/google';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import NextLink from 'next/link';
import MaxWidthWrapper from '@/layouts/max-width-wrapper';
import PendingInvitationsTable from '@/components/projects/pending-invitations-table';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
	const router = useRouter();
	const session = useSession();

	useEffect(() => {
		if (!session) router.push('/login');
	});

	return (
		<main className="mt-20">
			<MaxWidthWrapper>
				<h1 className="text-3xl font-bold">{session?.data?.user?.email}</h1>
				<div className="flex gap-2">
					<NextLink
						href="/projects"
						className="bg-black inline-block text-white px-4 py-1 mt-2 rounded"
					>
						Projects
					</NextLink>
					<button
						className="bg-black text-white px-4 py-1 mt-2 rounded"
						onClick={() => {
							signOut();
						}}
					>
						Log Out
					</button>
				</div>

				<PendingInvitationsTable />
			</MaxWidthWrapper>
		</main>
	);
}
