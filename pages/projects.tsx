import { useSession } from 'next-auth/react';

export default function Projects() {
	const { data: session } = useSession();
  
	return <div>Projects</div>;
}
