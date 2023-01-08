import { timeAgo } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import useProject from '@/utils/use-project';
import { InvitationsProps } from '@/types/project';
import { cloneElement } from 'react';
import { QueryError } from '@/utils/fetcher';

export default function InvitationsTable() {
	const router = useRouter();
	const { slug } = router.query as {
		slug: string;
	};
	const utils = useQueryClient();
	const { isOwner } = useProject();
	const { data: invitations, status } = useQuery<
		InvitationsProps[],
		QueryError
	>(
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

	const handleDeleteInvitation = (email: string) => {
		deleteInvitation.mutate(email, {
			onSuccess: () => {
				utils.invalidateQueries(['invitations', slug]);
			},
		});
	};

	return (
		<div>
			<h2 className="text-2xl font-bold mt-10">Invitations</h2>
			<ul className="mt-2 flex flex-col gap-2">
				{status === 'success' ? (
					<>
						{invitations?.map((invite) => (
							<li key={invite.email}>
								<div className="flex items-center gap-5 bg-slate-200 rounded-sm px-2 py-1">
									<h4 className="font-medium text-sm">{invite?.email}</h4>
									<span className="text-xs text-gray-600">
										Invited {timeAgo(invite?.invitedAt)}
									</span>

									{isOwner && (
										<button
											className="text-xs bg-black text-white rounded px-2 py-1"
											onClick={() => handleDeleteInvitation(invite.email)}
										>
											Cancel
										</button>
									)}
								</div>
							</li>
						))}
					</>
				) : (
					<>
						{Array.from({ length: 2 }).map((_, i) =>
							cloneElement(
								<li>
									<div className="h-8 bg-slate-200 rounded-sm" />
								</li>,
								{ key: i }
							)
						)}
					</>
				)}
			</ul>
		</div>
	);
}
