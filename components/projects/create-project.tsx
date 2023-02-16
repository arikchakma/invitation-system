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

  const onSubmit = handleSubmit(async data => {
    const project = await createProject.mutateAsync(data, {
      onSuccess: async project => {
        utils.invalidateQueries(['projects']);
      },
    });
  });

  return (
    <div>
      <h1 className="text-3xl font-bold">Create Project</h1>
      <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-2">
        <label className="block">
          <span className="text-gray-700">Project Name</span>
          <input
            type="text"
            {...register('name', { required: true })}
            placeholder="Arik Chakma"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200/50"
          />
        </label>
        <label>
          <span className="text-gray-700">Project Slug</span>
          <div className="mt-1 flex">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-100 px-4 text-gray-600">
              wth.is
            </span>
            <input
              type="text"
              {...register('slug', { required: true })}
              placeholder="arik-chakma"
              className="block w-full rounded-r-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200/50"
            />
          </div>
        </label>
        <button type="submit" className="rounded-md bg-black p-2 text-white">
          Create project
        </button>
      </form>
    </div>
  );
}
