import { ProjectProps } from '@/types/project';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

export default function useProject() {
	const router = useRouter();
	const { slug } = router.query as {
		slug: string;
	};
	const {
		data: project,
		error,
		status,
	} = useQuery<ProjectProps>(
		['project', slug],
		async () => {
			return (await fetch(`/api/projects/${slug}`)).json();
		},
		{
			enabled: !!slug,
		}
	);

	const isOwner = useMemo(() => {
		if (project && Array.isArray(project.users)) {
			return project.users[0].role === 'owner';
		}
	}, [project]);

	return {
		project,
		error,
		isOwner,
		status,
	};
}
