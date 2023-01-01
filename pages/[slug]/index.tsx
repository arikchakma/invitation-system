import { Project, ProjectUser } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

interface ProjectUserProps extends ProjectUser {
	email: string;
	name: string;
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
			<h1>{project?.name}</h1>

			<div>
				<h2>Users</h2>
				<ul>
					{users?.map((user) => (
						<li key={user.id}>{user?.email}</li>
					))}
				</ul>
			</div>
		</main>
	);
}
