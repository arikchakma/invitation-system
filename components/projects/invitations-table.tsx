import { timeAgo } from '@/lib/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import useProject from '@/utils/use-project';

interface InvitationsProps {
	email: string;
	invitedAt: Date;
}

export default function InvitationsTable() {
	const router = useRouter();
	const { slug } = router.query as {
		slug: string;
	};
	const { project, isOwner } = useProject();
	const { data: invitations } = useQuery<InvitationsProps[]>(
		['invitations', slug],
		async () => {
			return (await fetch(`/api/projects/${slug}/invite`)).json();
		},
		{
			enabled: !!slug,
		}
	);

	const deleteInvitation = useMutation(async (email: string) => {
		return await fetch(`/api/projects/${slug}/invite`, {
			method: 'DELETE',
			body: JSON.stringify({ email }),
		});
	});

	return (
		<div>
			<h2 className="text-2xl font-bold mt-10">Invitations</h2>
			<ul className="mt-2">
				{invitations?.map((invite) => (
					<li key={invite.email}>
						<div className="flex items-center gap-5">
							<h4 className="font-medium text-sm">{invite?.email}</h4>
							<span className="text-xs text-gray-600">
								Invited {timeAgo(invite?.invitedAt)}
							</span>

							{isOwner && (
								<button className="text-xs bg-black text-white rounded px-2 py-1">
									Cancel
								</button>
							)}
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
