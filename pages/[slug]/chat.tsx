import { PusherProvider, useCurrentMemberCount, useSubscribeToEvent } from '@/lib/stores/pusher-store';
import useProject from '@/utils/use-project';

function Chat() {
  const { project } = useProject();
  useSubscribeToEvent('chat-event', data => {
    console.log(data);
  });

  const active = useCurrentMemberCount()
  console.log(active)

  return (
    <main>
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
        <div>
          <input type="text" name="name" placeholder="Name" />
          <input type="text" name="message" placeholder="Message" />
        </div>
        <button type="submit">Send</button>
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
