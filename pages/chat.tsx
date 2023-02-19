import Script from 'next/script';
import { useEffect } from 'react';
import Pusher from 'pusher-js';

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

  return (
    <>
      <main>
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
      </main>
      <Script src="https://js.pusher.com/beams/service-worker.js" />
    </>
  );
}
