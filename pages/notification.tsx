import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Pusher from 'pusher-js';
import { PusherProvider, useSubscribeToEvent } from '@/lib/stores/pusher-store';

const pusher_server_host = process.env.NEXT_PUBLIC_PUSHER_SERVER_HOST!;
const pusher_server_port = parseInt(
  process.env.NEXT_PUBLIC_PUSHER_SERVER_PORT!,
  10
);
const pusher_server_tls = process.env.NEXT_PUBLIC_PUSHER_SERVER_TLS === 'true';

export default function Notification() {
  const { data } = useSession();

  // return (
  //   <PusherProvider slug={`private-user-${data.user?.id}`}>
  //     <NotificationBox />
  //   </PusherProvider>
  // );

  if (!data) {
    return (
      <main>
        <h1>Not signed in</h1>
      </main>
    );
  }
  return (
    <div>
      <NotificationBox />
    </div>
  );
}

function NotificationBox() {
  const { data } = useSession();

  // useSubscribeToEvent('new-invite', () => {
  //   console.log('New Invitation')
  // })
  useEffect(() => {
    Pusher.logToConsole = true;
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
      cluster: 'us2',
      wsHost: pusher_server_host,
      wsPort: pusher_server_port,
      enabledTransports: pusher_server_tls ? ['ws', 'wss'] : ['ws'],
      forceTLS: pusher_server_tls,
      // disableStats: true,
      authEndpoint: '/api/pusher/auth-channel',
      userAuthentication: {
        endpoint: '/api/pusher/auth-user',
        transport: 'ajax',
      },
    });
    // pusher.signin()
    const channel = pusher.subscribe(`private-user-${data?.user?.id}`);
    pusher.user.bind('new-invite', (data: any) => {
      console.log(data);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [data?.user?.id]);

  return <>Hello</>;
}
