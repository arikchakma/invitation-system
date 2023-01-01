import { Project } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';

export default function Projects() {
	const { data: session } = useSession();
	const { register, handleSubmit } = useForm();
	const { data: projects } = useQuery<Project[]>(['projects'], async () => {
		const res = await fetch('/api/projects');
		return res.json();
	});

	const onSubmit = handleSubmit(async (data) => {
		const project = (await (
			await fetch('/api/projects', {
				method: 'POST',
				body: JSON.stringify(data),
			})
		).json()) as Project;

		console.log(project);
	});

	if (!session) {
		return <div>Not signed in</div>;
	}

	return (
		<main className="p-2">
			<form onSubmit={onSubmit} className="flex flex-col gap-2">
				<input type="text" {...register('name')} placeholder="Name" />
				<input type="text" {...register('slug')} placeholder="Slug" />
				<button type="submit">Create project</button>
			</form>
			<div>
				{projects?.map((project) => (
					<div key={project.id}>{project.name}</div>
				))}
			</div>
		</main>
	);
}
