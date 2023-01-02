import { Inter } from '@next/font/google';
import { useMutation, useQuery } from '@tanstack/react-query';
import { timeAgo } from '@/lib/utils';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
	const router = useRouter();
	const session = useSession();
	const { data: pendingInivatations } = useQuery<
		{
			email: string;
			createdAt: Date;
			project: {
				name: string;
				slug: string;
			};
		}[]
	>(['pendingInvitations'], async () => {
		return (await fetch('/api/projects/get-user-invitations')).json();
	});

	const acceptInvitation = useMutation(async (slug: string) => {
		return await fetch(`/api/projects/${slug}/invite/accept`, {
			method: 'POST',
			body: JSON.stringify({ slug }),
		});
	});

	useEffect(() => {
		if (!session) router.push('/login');
	});

	return (
		<main className="p-10">
			<button
				className="bg-black text-white px-4 py-1 mt-2 rounded"
				onClick={() => {
					signOut();
				}}
			>
				Log Out
			</button>
			<ul className="max-w-xl mt-10 flex flex-col gap-5">
				{pendingInivatations?.map((invitation, index) => (
					<li key={invitation.email + index}>
						<div>
							<p>
								<strong>{invitation.project.name}</strong> has invited you{' '}
								<strong>{timeAgo(invitation.createdAt)}</strong> to join their
								project. By accepting this invitation you will be able to view
								and edit the project.
							</p>
							<button
								onClick={() => {
									acceptInvitation.mutate(invitation.project.slug, {
										onSuccess: () => {
											router.push(`/${invitation.project.slug}`);
										},
									});
								}}
								className="bg-black text-white px-4 py-1 mt-2 rounded"
							>
								Accept
							</button>
						</div>
					</li>
				))}
			</ul>

			<div>
				{pendingInivatations?.length === 0 && <p>No pending invitations</p>}
			</div>
		</main>
	);
}
