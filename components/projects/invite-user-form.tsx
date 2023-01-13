import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import useProject from '@/utils/use-project';

export default function InviteUserForm() {
  const router = useRouter();
  const { slug } = router.query as {
    slug: string;
  };
  const utils = useQueryClient();
  const { register, handleSubmit } = useForm();
  const { project, status } = useProject();

  const inviteUser = useMutation({
    mutationFn: async (data: { email: string }) => {
      return (
        await fetch(`/api/projects/${slug}/invite`, {
          method: 'POST',
          body: JSON.stringify(data),
        })
      ).json();
    },
    onSuccess: data => {
      utils.invalidateQueries(['invitations', slug]);
    },
  });

  const onSubmit = handleSubmit(data => {
    inviteUser.mutate(data as { email: string }, {
      onSuccess: data => {
        console.log(data);
      },
    });
  });
  return (
    <form onSubmit={onSubmit} className="mt-10">
      <label>
        <span>
          Invite a user to{' '}
          {status === 'loading' ? (
            <span className="inline-block h-4 w-28 rounded bg-slate-200" />
          ) : (
            <span>{project?.name}</span>
          )}
        </span>
        <input
          type="text"
          placeholder="Email"
          className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-black focus:outline-none focus:ring-black sm:text-sm"
          {...register('email')}
        />
      </label>
      <button
        type="submit"
        className="mt-2 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
      >
        Invite
      </button>
    </form>
  );
}
