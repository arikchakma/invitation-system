import { Inter } from '@next/font/google';
import { useMutation, useQuery } from '@tanstack/react-query';
import { timeAgo } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
	const router = useRouter();
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

	return (
		<main className="p-10">
			<ul className="max-w-xl">
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
