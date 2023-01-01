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
				<label className="block">
					<span className="text-gray-700">Name</span>
					<input
						type="text"
						{...register('name', { required: true })}
						placeholder="Arik Chakma"
						className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
					/>
				</label>
				<label>
					<span className="text-gray-700">Slug</span>
					<input
						type="text"
						{...register('slug', { required: true })}
						placeholder="arik-chakma"
						className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
					/>
				</label>
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
