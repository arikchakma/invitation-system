import { Project } from '@prisma/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import NextLink from 'next/link';
import MaxWidthWrapper from '@/layouts/max-width-wrapper';
import CreateProject from '@/components/projects/create-project';
import Container from '@/layouts/container';

export default function Projects() {
	const { data: session } = useSession();

	const { data: projects } = useQuery<Project[]>(['projects'], async () => {
		const res = await fetch('/api/projects');
		return res.json();
	});

	if (!session) {
		return <div>Not signed in</div>;
	}

	return (
		<Container>
			<MaxWidthWrapper>
				<CreateProject />

				<div className="mt-10">
					<h2 className="text-2xl font-bold">Projects</h2>
					<div className="grid grid-cols-4 gap-5 mt-5">
						{projects?.map((project) => (
							<NextLink href={`/${project.slug}`} key={project.id}>
								<div className="bg-white rounded-md shadow hover:shadow-md p-5 border border-gray-100/40 transition">
									<p>{project.name}</p>
								</div>
							</NextLink>
						))}
					</div>
				</div>
			</MaxWidthWrapper>
		</Container>
	);
}
