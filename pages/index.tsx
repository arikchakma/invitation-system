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
	const session = useSession();

	const acceptInvitation = useMutation(async (slug: string) => {
		return await fetch(`/api/projects/${slug}/invite/accept`, {
			method: 'POST',
			body: JSON.stringify({ slug }),
		});
	});

	console.log(pendingInivatations, session);

	return (
		<main className="flex items-center justify-center px-5 h-screen">
			<ul>
				{pendingInivatations?.map((invitation, index) => (
					<li key={invitation.email + index}>
						<h1>{invitation.email}</h1>
						<h2>{invitation.project.name}</h2>
						<p>Invited {timeAgo(invitation.createdAt)}</p>
						<button
							onClick={() => {
								acceptInvitation.mutate(invitation.project.slug, {
									onSuccess: () => {
										router.push(`/${invitation.project.slug}`);
									},
								});
							}}
						>
							Accept
						</button>
					</li>
				))}
			</ul>
		</main>
	);
}
