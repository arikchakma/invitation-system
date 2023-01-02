import { Inter } from '@next/font/google';
import { useQuery } from '@tanstack/react-query';
import { timeAgo } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
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

	console.log(pendingInivatations);

	return (
		<main className="flex items-center justify-center px-5 h-screen">
			<ul>
				{pendingInivatations?.map((invitation, index) => (
					<li key={invitation.email + index}>
						<h1>{invitation.email}</h1>
						<h2>{invitation.project.name}</h2>
						<p>Invited {timeAgo(invitation.createdAt)}</p>
					</li>
				))}
			</ul>
		</main>
	);
}
