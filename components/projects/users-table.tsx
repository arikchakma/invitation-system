import { cloneElement } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { ProjectUserProps } from '@/types/project';
import { timeAgo } from '@/lib/utils';
import { QueryError, fetcher } from '@/utils/fetcher';

export default function UsersTable() {
	const router = useRouter();
	const { slug } = router.query as {
		slug: string;
	};
	const {
		data: users,
		status,
		error,
	} = useQuery<ProjectUserProps[], QueryError>(
		['users', slug],
		async () => fetcher(`/api/projects/${slug}/users`),
		{
			enabled: !!slug,
		}
	);
	return (
		<div>
			<h2 className="text-2xl font-bold">Users</h2>
			<ul className="mt-2 flex flex-col gap-2">
				{status === 'success' && (
					<>
						{users?.map((user) => (
							<li key={user.id}>
								<div className="flex items-center justify-between bg-slate-200 gap-5 rounded-sm px-2 py-1">
									<h4 className="font-medium text-sm">{user?.email}</h4>
									<span className="text-xs text-gray-600">
										Joined {timeAgo(user?.joinedAt)}
									</span>
								</div>
							</li>
						))}
					</>
				)}

				{status === 'success' && (
					<>
						{users.length === 0 && (
							<li>
								<div className="bg-slate-200 rounded-sm font-semibold px-2">
									No Users found
								</div>
							</li>
						)}
					</>
				)}

				{status === 'loading' && (
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

				{status === 'error' && (
					<>
						<li>
							<div className="bg-slate-200 rounded-sm font-semibold px-2">
								{error?.message}
							</div>
						</li>
					</>
				)}
			</ul>
		</div>
	);
}
