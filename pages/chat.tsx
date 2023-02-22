import { useEffect } from 'react';
import Pusher from 'pusher-js';
import { cn } from '@/utils/cn';

export default function Chat() {
  useEffect(() => {
    Pusher.logToConsole = true;
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
      cluster: 'us2',
      // userAuthentication: {
      //   endpoint: '/api/pusher/auth-user',
      //   transport: 'jsonp',
      // }
    });
    const channel = pusher.subscribe('chat');
    pusher.user.bind('chat-event', (data: any) => {
      console.log(data);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  console.log(new Array(20).fill(0));

  return (
    <>
      <main className="p-10">
        <form
          onSubmit={e => {
            e.preventDefault();
            const name = (e.currentTarget.name as any).value;
            const message = e.currentTarget.message.value;
            console.log(name, message);
            fetch('/api/pusher', {
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

        <div className="grid grid-rows-[1fr_280px_1fr]">
          <div className="w-full animate-pulse rounded bg-gray-100 p-2 font-semibold text-gray-800">
            <div className="h-9 w-1/2 rounded bg-gray-300" />
            <div className="mt-0.5 h-5 rounded bg-gray-300/80" />
          </div>
          <div className="relative h-full overflow-hidden">
            <ul className="flex h-full flex-col justify-end divide-y divide-gray-200">
              {new Array(6).fill(0).map((_, index) => (
                <li
                  key={index}
                  className="animate-pulse"
                  style={{
                    animationDelay: `0.${index}s`,
                  }}
                >
                  <div
                    className={cn(
                      'flex flex-col p-2',
                      index % 2 === 0 ? 'items-end' : 'items-start'
                    )}
                  >
                    <p
                      className={cn(
                        'h-4 rounded bg-gray-300',
                        index % 2 === 0 ? 'w-[180px]' : 'w-[120px]'
                      )}
                    />
                    <p
                      className="mt-0.5 h-6 rounded bg-gray-400"
                      style={{
                        width: `${Math.floor(Math.random() * 100) + 10}%`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <div
              aria-label="Messages overflow overlay"
              aria-hidden
              className={cn(
                'pointer-events-none absolute bottom-0 h-full w-full touch-none',
                'before:absolute before:top-0 before:h-20 before:w-full before:bg-gradient-to-b before:from-white before:to-transparent'
              )}
            />
          </div>
          <div className="flex animate-pulse gap-2">
            <div className="h-10 grow rounded bg-gray-200" />
            <div className="h-10 w-20 rounded bg-gray-600" />
          </div>
        </div>
      </main>
    </>
  );
}
