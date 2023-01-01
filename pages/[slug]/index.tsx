import { Project } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

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

	console.log(router.query, project);

	return <div>index</div>;
}
