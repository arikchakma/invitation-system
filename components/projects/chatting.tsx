import {
  PusherProvider,
  useCurrentMemberCount,
  useSubscribeToEvent,
} from '@/lib/stores/pusher-store';
import useProject from '@/utils/use-project';

function Chat() {
  const { project } = useProject();
  useSubscribeToEvent('chat-event', data => {
    console.log(data);
  });

  const active = useCurrentMemberCount();
  console.log(active);

  return (
    <main className="flex h-full flex-col">
      <div className="grow"></div>
      <form
        onSubmit={e => {
          e.preventDefault();
          const name = (e.currentTarget.name as any).value;
          const message = e.currentTarget.message.value;
          console.log(name, message);
          fetch(`/api/projects/${project?.slug}/message`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sender: name, message }),
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

  if (!project) {
    return null;
  }

  console.log(project.id);

  return (
    <PusherProvider slug={`project-${project?.id}`}>
      <Chat />
    </PusherProvider>
  );
}
