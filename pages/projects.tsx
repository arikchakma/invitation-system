import { useSession } from 'next-auth/react';

export default function Projects() {
	const { data: session } = useSession();

	if (!session) {
		return <div>Not signed in</div>;
	}

	return <div>Projects</div>;
}
