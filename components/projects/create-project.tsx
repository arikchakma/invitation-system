import { ProjectProps } from '@/types/project';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

export default function CreateProject() {
	const utils = useQueryClient();
  const { register, handleSubmit } = useForm<{
		name: string;
		slug: string;
	}>();

  const createProject = useMutation({
		mutationFn: async (data: { name: string; slug: string }) => {
			return (
				await fetch('/api/projects', {
					method: 'POST',
					body: JSON.stringify(data),
				})
			).json() as Promise<ProjectProps>;
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

  return (
    <div>
    <h1 className="font-bold text-3xl">Create Project</h1>
				<form onSubmit={onSubmit} className="flex flex-col gap-2 mt-5">
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
    </div>
  )
}