import { useMutation, useQuery } from '@tanstack/react-query';
import { timeAgo } from '@/lib/utils';
import { useRouter } from 'next/router';
import { InvitationsProps } from '@/types/project';

export default function PendingInvitationsTable() {
	const router = useRouter();
	const { data: pendingInivatations } = useQuery<InvitationsProps[]>(
		['pendingInvitations'],
		async () => {
			return (await fetch('/api/projects/get-user-invitations')).json();
		}
	);

	const acceptInvitation = useMutation(async (slug: string) => {
		return await fetch(`/api/projects/${slug}/invite/accept`, {
			method: 'POST',
			body: JSON.stringify({ slug }),
		});
	});

	return (
		<div>
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
		</div>
	);
}
