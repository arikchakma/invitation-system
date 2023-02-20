import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import cn from 'clsx';
import { useSession } from 'next-auth/react';
import { flushSync } from 'react-dom';
import {
  PusherProvider,
  useCurrentMemberCount,
  useIsSubscribed,
  useMembers,
  useSubscribeToEvent,
} from '@/lib/stores/pusher-store';
import { QueryError, fetcher } from '@/utils/fetcher';
import useProject from '@/utils/use-project';

function Chat() {
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [message, setMessage] = useState('');
  const [shouldScroll, setShouldScroll] = useState(true);
  const { data } = useSession();
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

  const fetchedMessages = useQuery<any, QueryError>(
    ['messages', project?.id],
    () => fetcher(`/api/projects/${project?.slug}/message`),
    {
      enabled: !!project,
      onSuccess: data => {
        setMessages((data as any).messages);
        if (messages.length === (data as any).messages.length) {
          setShouldScroll(false);
        } else {
          setShouldScroll(true);
        }
      },
    }
  );

  function scrollToLastChild() {
    let lastChild = listRef.current?.lastElementChild;
    lastChild?.scrollIntoView({
      block: 'end',
      inline: 'nearest',
      behavior: 'smooth',
    });
  }

  useSubscribeToEvent('new-message', data => {
    // Updates the dom synchronously
    // flushSync(() => {
    setMessages(messages => [...messages, data as any]);
    setShouldScroll(true);
    // });
    // scrollToLastChild();
  });
  // useSubscribeToEvent('new-message', () => fetchedMessages.refetch());

  // Might use later
  useEffect(() => {
    // let lastChild = listRef.current?.lastElementChild;
    // lastChild?.scrollIntoView({
    //   block: 'end',
    //   inline: 'nearest',
    //   behavior: 'smooth',
    // });
    const target = ref.current;
    if (target && shouldScroll) {
      target.scrollTo({
        top: target.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [shouldScroll]);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;

    if (target.scrollHeight > target.clientHeight)
      setOverlay(prev => ({ ...prev, top: true }));

    const scroll = (e: Event) => {
      if (target.scrollTop === 0) {
        // console.log('Scrolled to top');
        setOverlay(prev => ({ top: false, bottom: true }));
      } else if (
        Math.round(target.scrollTop + target.clientHeight) ===
        target.scrollHeight
      ) {
        // console.log('Scrolled to bottom');
        setOverlay(prev => ({ top: true, bottom: false }));
      } else if (target.scrollTop + target.clientHeight < target.scrollHeight) {
        // console.log('Scrolled to middle');
        setOverlay(prev => ({ top: true, bottom: true }));
      } else {
        // console.log('Scrolled to unknown');
        setOverlay(prev => ({ top: false, bottom: false }));
      }
    };

    target.addEventListener('scroll', scroll);
    return () => target.removeEventListener('scroll', scroll);
  }, []);

  const active = useCurrentMemberCount();
  const isSubscribed = useIsSubscribed();
  const members = useMembers();

  return (
    <main className="flex max-h-[356px] min-h-full flex-col">
      <div className="w-full rounded bg-gray-100 p-2 font-semibold text-gray-800">
        {active} active users.
        <div className="flex w-full gap-2 overflow-x-auto scrollbar-hide">
          {isSubscribed && (
            <>
              {members.map(m => (
                <span key={m.id} className="text-sm font-medium">
                  {m.email}
                </span>
              ))}
            </>
          )}
        </div>
      </div>
      <div className="relative h-[calc(100%-77px)] min-h-[280px] overflow-hidden">
        <div className="h-full min-h-[280px] overflow-y-auto scrollbar-hide" ref={ref}>
          <ul
            className="flex flex-col justify-end divide-y divide-gray-200"
            ref={listRef}
          >
            {messages.map((message, index) => (
              <li key={index}>
                <div
                  className={cn(
                    'flex flex-col p-2',
                    data?.user?.email === message.sender && 'items-end'
                  )}
                >
                  <p className="text-xs font-medium text-gray-600">
                    {data?.user?.email === message.sender
                      ? 'me'
                      : message.sender}
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
          fetch(`/api/projects/${project?.slug}/message`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
          }).then(() => setMessage(''));
        }}
      >
        <div className="relative z-10 flex items-center gap-2">
          <input
            type="text"
            name="message"
            placeholder="Message"
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="block w-full grow appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-black focus:outline-none focus:ring-black sm:text-sm"
          />
          <button
            type="submit"
            disabled={!isSubscribed}
            className="inline-flex h-full items-center justify-center rounded-md border border-transparent bg-black px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-60"
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
