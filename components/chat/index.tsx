// import { flushSync } from 'react-dom';
import {
  PusherProvider,
  useIsSubscribed,
  useMembers,
} from '@/lib/stores/pusher-store';
import useProject from '@/utils/use-project';
import Messages from './messages';
import SendMessage from './send-message';
import ChatSkeleton from './skeleton';

function Chat() {
  const isSubscribed = useIsSubscribed();
  const { members, currentMemberCount: active } = useMembers();

  return (
    <main className="grid max-h-[356px] min-h-full grid-rows-[1fr_min(280px,100%)_1fr]">
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
  const { project, status } = useProject({});

  return (
    <>
      {status !== 'success' ? (
        <ChatSkeleton />
      ) : (
        <PusherProvider slug={`project-${project?.id}`}>
          <Chat />
        </PusherProvider>
      )}
    </>
  );
}
