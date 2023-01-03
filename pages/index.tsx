import { Inter } from '@next/font/google';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import MaxWidthWrapper from '@/layouts/max-width-wrapper';
import { InvitationsProps } from '@/types/project';
import PendingInvitationsTable from '@/components/projects/pending-invitations-table';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
	const router = useRouter();
	const session = useSession();
	const { data: pendingInivatations } = useQuery<InvitationsProps[]>(
		['pendingInvitations'],
		async () => {
			return (await fetch('/api/projects/get-user-invitations')).json();
		}
	);

	useEffect(() => {
		if (!session) router.push('/login');
	});

	return (
		<main className="mt-20">
			<MaxWidthWrapper>
				<button
					className="bg-black text-white px-4 py-1 mt-2 rounded"
					onClick={() => {
						signOut();
					}}
				>
					Log Out
				</button>
				<PendingInvitationsTable />

				<div>
					{pendingInivatations?.length === 0 && <p>No pending invitations</p>}
				</div>
			</MaxWidthWrapper>
		</main>
	);
}
