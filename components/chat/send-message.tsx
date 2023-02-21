import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useIsSubscribed } from '@/lib/stores/pusher-store';
import { fetcher } from '@/utils/fetcher';
import useProject from '@/utils/use-project';

export default function SendMessage() {
  const [message, setMessage] = useState('');
  const { project } = useProject();
  const isSubscribed = useIsSubscribed();

  const { mutate: send, status } = useMutation({
    mutationFn: async () => {
      return (await fetcher(`/api/projects/${project?.slug}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      })) as Promise<{}>;
    },
    onSuccess: () => {
      setMessage('');
    },
  });

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        send();
      }}
    >
      <div className="relative z-10 flex items-center gap-2">
        <input
          type="text"
          name="message"
          placeholder="Message"
          required
          value={message}
          onChange={e => setMessage(e.target.value)}
          className="block w-full grow appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-black focus:outline-none focus:ring-black sm:text-sm"
        />
        <button
          type="submit"
          disabled={!isSubscribed || status === 'loading'}
          className="inline-flex h-full items-center justify-center rounded-md border border-transparent bg-black px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-60"
        >
          Send
        </button>
      </div>
    </form>
  );
}
