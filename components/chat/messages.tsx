import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import throttle from 'lodash.throttle';
import { useSession } from 'next-auth/react';
import { useSubscribeToEvent } from '@/lib/stores/pusher-store';
import { cn } from '@/utils/cn';
import { QueryError, fetcher } from '@/utils/fetcher';
import useProject from '@/utils/use-project';

export default function Messages() {
  const { project } = useProject({});
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

    const handleScroll = throttle((e: Event) => {
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
    }, 500);
    target.addEventListener('scroll', handleScroll);
    return () => target.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative h-full w-full">
      <div className="flex h-full flex-col items-stretch justify-end self-auto overflow-y-hidden scrollbar-hide">
        <div className="flex-initial overflow-y-auto scrollbar-hide" ref={ref}>
          <div className="divide-y divide-gray-200">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={cn(
                  'flex flex-col p-2',
                  data?.user?.email === message.sender && 'items-end'
                )}
              >
                <p className="text-xs font-medium text-gray-600">
                  {data?.user?.email === message.sender ? 'me' : message.sender}
                  <span aria-hidden="true" className="select-none px-1">
                    ·
                  </span>
                  {formatDistanceToNow(new Date(message.createdAt), {
                    addSuffix: true,
                    includeSeconds: true,
                  })}
                </p>
                <p className="font-medium">{message.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        aria-label="Messages overflow overlay"
        aria-hidden
        className={cn(
          'pointer-events-none absolute bottom-0 h-full w-full touch-none',
          'before:absolute before:top-0 before:h-20 before:w-full before:origin-top before:bg-gradient-to-b before:from-white before:to-transparent before:transition-all before:duration-500 before:ease-in-out',
          'after:absolute after:bottom-0 after:left-0 after:h-20 after:w-full after:origin-bottom after:bg-gradient-to-t after:from-white after:to-transparent after:transition-all after:duration-500 after:ease-in-out',
          overlay.top ? 'before:scale-y-100' : 'before:scale-y-0',
          overlay.bottom ? 'after:scale-y-100' : 'after:scale-y-0'
        )}
      />
    </div>
  );
}
