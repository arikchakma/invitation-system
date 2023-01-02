import UsersTable from '@/components/projects/users-table';
import MaxWidthWrapper from '@/layouts/max-width-wrapper';
import { timeAgo } from '@/lib/utils';
import { ProjectUserProps } from '@/types/project';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import useProject from '@/utils/use-project';

interface InvitationsProps {
	email: string;
	invitedAt: Date;
}

export default function ProjectPage() {
	const router = useRouter();
	const utils = useQueryClient();
	const session = useSession();
	const { register, handleSubmit } = useForm();
	const { slug } = router.query as {
		slug: string;
	};
	const { project, isOwner } = useProject();

	const { data: users } = useQuery<ProjectUserProps[]>(
		['users', slug],
		async () => {
			return (await fetch(`/api/projects/${slug}/users`)).json();
		},
		{
			enabled: !!slug,
		}
	);

	const { data: invitations } = useQuery<InvitationsProps[]>(
		['invitations', slug],
		async () => {
			return (await fetch(`/api/projects/${slug}/invite`)).json();
		},
		{
			enabled: !!slug,
		}
	);

	const inviteUser = useMutation({
		mutationFn: async (data: { email: string }) => {
			return (
				await fetch(`/api/projects/${slug}/invite`, {
					method: 'POST',
					body: JSON.stringify(data),
				})
			).json();
		},
		onSuccess: (data) => {
			utils.invalidateQueries(['invitations', slug]);
		},
	});

	const onSubmit = handleSubmit((data) => {
		inviteUser.mutate(data as { email: string }, {
			onSuccess: (data) => {
				console.log(data);
			},
		});
	});

	console.log(router.query, project, users, invitations);

	return (
		<main className="mt-20">
			<MaxWidthWrapper>
				<div>
					<h1 className="font-bold text-3xl">{project?.name}</h1>
					<p>{project?.slug}</p>
				</div>

				<form onSubmit={onSubmit} className="mt-10">
					<label>
						<span>Invite a user to {project?.name}</span>
						<input
							type="text"
							placeholder="Email"
							className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
							{...register('email')}
						/>
					</label>
					<button
						type="submit"
						className="mt-2 w-full justify-center inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
					>
						Invite
					</button>
				</form>

				<div className="mt-10">
					<UsersTable />

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
				</div>
			</MaxWidthWrapper>
		</main>
	);
}
