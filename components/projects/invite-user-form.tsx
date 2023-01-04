import useProject from '@/utils/use-project';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

export default function InviteUserForm() {
	const router = useRouter();
	const { slug } = router.query as {
		slug: string;
	};
	const utils = useQueryClient();
	const { register, handleSubmit } = useForm();
	const { project, status } = useProject();

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
	return (
		<form onSubmit={onSubmit} className="mt-10">
			<label>
				<span>
					Invite a user to{' '}
					{status === 'loading' ? (
						<span className="w-28 inline-block bg-slate-200 rounded h-4" />
					) : (
						<span>{project?.name}</span>
					)}
				</span>
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
	);
}
