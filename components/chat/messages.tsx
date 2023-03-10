import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { useSession } from 'next-auth/react';
import { useSubscribeToEvent } from '@/lib/stores/pusher-store';
import { cn } from '@/utils/cn';
import { QueryError, fetcher } from '@/utils/fetcher';
import useProject from '@/utils/use-project';

export default function Messages() {
  const { project } = useProject();
  const { data } = useSession();
  const ref = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<
    {
      sender: string;
      message: string;
      id: string;
      createdAt: Date;
    }[]
  >([]);
  const [overlay, setOverlay] = useState({
    top: false,
    bottom: false,
  });

  // Subscribe to new messages
  useSubscribeToEvent('new-message', data => {
    // Updates the dom synchronously
    // flushSync(() => {
    setMessages(messages => [...messages, data as any]);
    // });
    // scrollToLastChild();
  });

  // Scroll to bottom everytime new message comes in
  useEffect(() => {
    const target = ref.current;
    if (target) {
      target.scrollTo({
        top: target.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const fetchedMessages = useQuery<any, QueryError>(
    ['messages', project?.slug],
    () => fetcher(`/api/projects/${project?.slug}/message`),
    {
      enabled: !!project,
      onSuccess: data => {
        setMessages((data as any).messages);
      },
    }
  );

  // Scolling overlay
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

  return (
    <div className="relative h-full overflow-hidden">
      <div className="h-full overflow-y-auto scrollbar-hide" ref={ref}>
        <ul className="flex flex-col justify-end divide-y divide-gray-200">
          {messages.map((message, index) => (
            <li key={index}>
              <div
                className={cn(
                  'flex flex-col p-2',
                  data?.user?.email === message.sender && 'items-end'
                )}
              >
                <p className="text-xs font-medium text-gray-600">
                  {data?.user?.email === message.sender ? 'me' : message.sender}
                  <span aria-hidden="true" className="select-none px-1">
                    ??
                  </span>
                  {formatDistanceToNow(new Date(message.createdAt), {
                    addSuffix: true,
                    includeSeconds: true,
                  })}
                </p>
                <p className="font-medium">{message.message}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div
        aria-label="Messages overflow overlay"
        aria-hidden
        className={cn(
          'pointer-events-none absolute bottom-0 h-full w-full touch-none',
          overlay.top &&
            'before:absolute before:top-0 before:h-20 before:w-full before:bg-gradient-to-b before:from-white before:to-transparent',
          overlay.bottom &&
            'after:absolute after:bottom-0 after:h-20 after:w-full after:bg-gradient-to-t after:from-white after:to-transparent'
        )}
      />
    </div>
  );
}
