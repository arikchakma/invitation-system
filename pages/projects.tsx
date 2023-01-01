import { Project } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';

export default function Projects() {
	const { data: session } = useSession();
	const utils = useQueryClient();
	const { register, handleSubmit } = useForm<{
		name: string;
		slug: string;
	}>();
	const { data: projects } = useQuery<Project[]>(['projects'], async () => {
		const res = await fetch('/api/projects');
		return res.json();
	});

	const createProject = useMutation({
		mutationFn: async (data: { name: string; slug: string }) => {
			return (
				await fetch('/api/projects', {
					method: 'POST',
					body: JSON.stringify(data),
				})
			).json() as Promise<Project>;
		},
	});

	const onSubmit = handleSubmit(async (data) => {
		const project = await createProject.mutateAsync(data, {
			onSuccess: async (project) => {
				console.log(project);
				utils.invalidateQueries(['projects']);
			},
		});

		console.log(project);
	});

	if (!session) {
		return <div>Not signed in</div>;
	}

	return (
		<main className="p-2">
			<form onSubmit={onSubmit} className="flex flex-col gap-2">
				<label className="block">
					<span className="text-gray-700">Project Name</span>
					<input
						type="text"
						{...register('name', { required: true })}
						placeholder="Arik Chakma"
						className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
					/>
				</label>
				<label>
					<span className="text-gray-700">Project Slug</span>
					<div className="flex mt-1">
						<span className="inline-flex border border-gray-300 border-r-0 bg-gray-100 items-center px-4 rounded-l-md text-gray-600">
							wth.is
						</span>
						<input
							type="text"
							{...register('slug', { required: true })}
							placeholder="arik-chakma"
							className="block w-full rounded-r-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
						/>
					</div>
				</label>
				<button type="submit" className="bg-black rounded-md text-white p-2">
					Create project
				</button>
			</form>
			<div>
				{projects?.map((project) => (
					<div key={project.id}>{project.name}</div>
				))}
			</div>
		</main>
	);
}
