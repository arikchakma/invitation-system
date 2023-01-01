import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export default function Projects() {
	const { data: session } = useSession();
	const { data: projects } = useQuery(['projects'], async () => {
		const res = await fetch('/api/projects');
		return res.json();
	});

	if (!session) {
		return <div>Not signed in</div>;
	}

	if (projects?.length === 0) {
		return <div>No projects found</div>;
	}

	return <div>Projects</div>;
}
