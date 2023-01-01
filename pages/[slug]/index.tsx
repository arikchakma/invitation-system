import { timeAgo } from '@/lib/utils';
import { Project, ProjectUser } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

interface ProjectUserProps {
	id: string;
	email: string;
	name: string;
	joinedAt: Date;
}

export default function ProjectPage() {
	const router = useRouter();
	const { slug } = router.query as {
		slug: string;
	};
	const { data: project } = useQuery<Project>(
		['project', slug],
		async () => {
			return (await fetch(`/api/projects/${slug}`)).json();
		},
		{
			enabled: !!slug,
		}
	);

	const { data: users } = useQuery<ProjectUserProps[]>(
		['users', slug],
		async () => {
			return (await fetch(`/api/projects/${slug}/users`)).json();
		},
		{
			enabled: !!slug,
		}
	);

	console.log(router.query, project, users);

	return (
		<main>
			<div>
				<h1 className="font-bold text-3xl">{project?.name}</h1>
				<p>{project?.slug}</p>
			</div>

			<div className="mt-10">
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
		</main>
	);
}
