import { useEffect, useRef } from 'react';
import Pusher from 'pusher-js';

const pusher_server_host = process.env.NEXT_PUBLIC_PUSHER_SERVER_HOST!;
const pusher_server_port = parseInt(
  process.env.NEXT_PUBLIC_PUSHER_SERVER_PORT!,
  10
);
const pusher_server_tls = process.env.NEXT_PUBLIC_PUSHER_SERVER_TLS === 'true';

export function usePrivateSubscribeEvent<MessageType>(
  slug: string,
  event: string,
  callback: (data: MessageType) => void
) {
  const stableCallback = useRef(callback);

  // Keep callback sync'd
  useEffect(() => {
    stableCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    Pusher.logToConsole = true;
    let pusherClient: Pusher;
    if (Pusher.instances.length) {
      pusherClient = Pusher.instances[0];
      pusherClient.connect();
    } else {
      pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
        cluster: 'us2',
        wsHost: pusher_server_host,
        wsPort: pusher_server_port,
        enabledTransports: pusher_server_tls ? ['ws', 'wss'] : ['ws'],
        forceTLS: pusher_server_tls,
        disableStats: true,
        authEndpoint: '/api/pusher/auth-channel',
        userAuthentication: {
          endpoint: '/api/pusher/auth-user',
          transport: 'jsonp',
        },
      });
    }
    // pusher.signin()
    const channel = pusherClient.subscribe(`private-${slug}`);

    const reference = (data: MessageType) => {
      stableCallback.current(data);
    };

    pusherClient.bind(event, reference);

    return () => {
      channel.unbind(event, reference);
      pusherClient.disconnect();
    };
  }, [slug, event]);
}
