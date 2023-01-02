import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { ProjectUserProps } from '@/types/project';
import { timeAgo } from '@/lib/utils';

export default function UsersTable() {
	const router = useRouter();
	const { slug } = router.query as {
		slug: string;
	};
	const { data: users } = useQuery<ProjectUserProps[]>(
		['users', slug],
		async () => {
			return (await fetch(`/api/projects/${slug}/users`)).json();
		},
		{
			enabled: !!slug,
		}
	);
	return (
		<div>
			<h2 className="text-2xl font-bold">Users</h2>
			<ul className="mt-2">
				{users?.map((user) => (
					<li key={user.id}>
						<div className="flex items-center gap-5">
							<h4 className="font-medium text-sm">{user?.email}</h4>
							<span className="text-xs text-gray-600">
								Joined {timeAgo(user?.joinedAt)}
							</span>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
