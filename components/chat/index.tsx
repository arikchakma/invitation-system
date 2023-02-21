import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import cn from 'clsx';
import { useSession } from 'next-auth/react';
// import { flushSync } from 'react-dom';
import {
  PusherProvider,
  useCurrentMemberCount,
  useIsSubscribed,
  useMembers,
  useSubscribeToEvent,
} from '@/lib/stores/pusher-store';
import { QueryError, fetcher } from '@/utils/fetcher';
import useProject from '@/utils/use-project';
import Messages from './messages';
import SendMessage from './send-message';

function Chat() {
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
      <Messages />
      <SendMessage />
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
