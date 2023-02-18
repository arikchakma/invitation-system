import { useEffect, useRef, useState } from 'react';
import cn from 'clsx';
import {
  PusherProvider,
  useCurrentMemberCount,
  useSubscribeToEvent,
} from '@/lib/stores/pusher-store';
import useProject from '@/utils/use-project';

function Chat() {
  const ref = useRef<HTMLDivElement>(null);
  const { project } = useProject();
  const [overlay, setOverlay] = useState({
    top: false,
    bottom: false,
  });
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
    ref.current?.scrollTo(
      0,
      ref.current.scrollHeight - ref.current.clientHeight
    );
  }, [messages]);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;

    if (target.scrollHeight > target.clientHeight)
      setOverlay(prev => ({ ...prev, top: true }));

    const scroll = (e: Event) => {
      if (target.scrollTop === 0) {
        console.log('Scrolled to top');
        setOverlay(prev => ({ top: false, bottom: true }));
      } else if (
        Math.round(target.scrollTop + target.clientHeight) ===
        target.scrollHeight
      ) {
        console.log('Scrolled to bottom');
        setOverlay(prev => ({ top: true, bottom: false }));
      } else if (target.scrollTop + target.clientHeight < target.scrollHeight) {
        console.log('Scrolled to middle');
        setOverlay(prev => ({ top: true, bottom: true }));
      } else {
        console.log('Scrolled to unknown');
        setOverlay(prev => ({ top: false, bottom: false }));
      }
    };

    target.addEventListener('scroll', scroll);
    return () => target.removeEventListener('scroll', scroll);
  }, [messages]);

  const active = useCurrentMemberCount();
  // console.log(active, overlay);

  return (
    <main className="flex max-h-[356px] min-h-full flex-col">
      <div className="w-full rounded bg-gray-100 p-2 font-semibold text-gray-800">
        {active} active users.
      </div>
      <div className="relative h-[calc(100%-77px)] overflow-hidden">
        <div className="h-full overflow-y-auto" ref={ref}>
          <ul className="flex flex-col justify-end divide-y divide-gray-200">
            {messages.map((message, index) => (
              <li key={index}>
                <div className="p-2">
                  <p className="text-xs font-medium text-gray-600">
                    {message.sender}
                  </p>
                  <p className="font-medium">{message.message}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute bottom-0 h-full w-full touch-none',
            overlay.top &&
              'before:absolute before:top-0 before:h-20 before:w-full before:bg-gradient-to-b before:from-white before:to-transparent',
            overlay.bottom &&
              'after:absolute after:bottom-0 after:h-20 after:w-full after:bg-gradient-to-t after:from-white after:to-transparent'
          )}
        ></div>
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
        <div className="relative z-10 flex items-center gap-2">
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
