import { useEffect, useRef, useState } from 'react';
import {
  PusherProvider,
  useCurrentMemberCount,
  useSubscribeToEvent,
} from '@/lib/stores/pusher-store';
import useProject from '@/utils/use-project';

function Chat() {
  const ref = useRef<HTMLDivElement>(null);
  const { project } = useProject();
  const [messages, setMessages] = useState<
    {
      sender: string;
      message: string;
    }[]
  >([]);
  useSubscribeToEvent('chat-event', data => {
    console.log(data);
    setMessages(messages => [...messages, data as any]);
  });

  useEffect(() => {
    ref.current?.scrollTo(0, ref.current.scrollHeight);
  }, [messages]);

  const active = useCurrentMemberCount();
  console.log(active);

  return (
    <main className="flex max-h-[356px] min-h-full flex-col">
      <div className="w-full rounded bg-gray-100 p-2 font-semibold text-gray-800">
        {active} active users.
      </div>
      <div className="h-[calc(100%-77px)] overflow-y-auto" ref={ref}>
        <ul className="flex flex-col justify-end divide-y divide-gray-200 py-2">
          {messages.map((message, index) => (
            <li key={index}>
              <div className="p-1">
                <p className="text-xs font-medium text-gray-600">
                  {message.sender}
                </p>
                <p className="font-medium">{message.message}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <form
        onSubmit={e => {
          e.preventDefault();
          const message = e.currentTarget.message.value;
          console.log(name, message);
          fetch(`/api/projects/${project?.slug}/message`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
          });
        }}
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            name="message"
            placeholder="Message"
            className="block w-full grow appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-black focus:outline-none focus:ring-black sm:text-sm"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-black px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            Send
          </button>
        </div>
      </form>
    </main>
  );
}

export default function ChatWrapper() {
  const { project } = useProject();

  return (
    <PusherProvider slug={`project-${project?.id}`}>
      <Chat />
    </PusherProvider>
  );
}
