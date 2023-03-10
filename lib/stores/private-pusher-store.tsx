/**
 * Pusher Context
 *
 * This context is used to provide the pusher store to all components
 */

/**
 * Provider for Pusher Context
 */ import React, { createContext, useEffect, useState } from 'react';
import Pusher, { Channel, PresenceChannel } from 'pusher-js';
import { useStore } from 'zustand';
import { StoreApi, createStore } from 'zustand/vanilla';
import { getRandomId } from '@/utils/get-random-id';

interface PusherZustandStore {
  pusherClient: Pusher;
  privateChannel: PresenceChannel;
}

const pusher_key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY!;
const pusher_server_host = process.env.NEXT_PUBLIC_PUSHER_SERVER_HOST!;
const pusher_server_port = parseInt(
  process.env.NEXT_PUBLIC_PUSHER_SERVER_PORT!,
  10
);
const pusher_server_tls = process.env.NEXT_PUBLIC_PUSHER_SERVER_TLS === 'true';
const pusher_server_cluster = 'us2';

const createPusherStore = (slug: string) => {
  let pusherClient: Pusher;
  if (Pusher.instances.length) {
    pusherClient = Pusher.instances[0];
    pusherClient.connect();
  } else {
    const user_id = `${getRandomId()}`;
    pusherClient = new Pusher(pusher_key, {
      cluster: pusher_server_cluster,
      wsHost: pusher_server_host,
      wsPort: pusher_server_port,
      enabledTransports: pusher_server_tls ? ['ws', 'wss'] : ['ws'],
      forceTLS: pusher_server_tls,
      disableStats: true,
      authEndpoint: '/api/pusher/auth-channel',
      userAuthentication: {
        endpoint: '/api/pusher/auth-user',
        transport: 'jsonp',
        headers: {
          user_id,
        },
      },
      auth: {
        headers: {
          user_id,
        },
      },
    });
  }

  const privateChannel = pusherClient.subscribe(
    `private-${slug}`
  ) as PresenceChannel;

  const store = createStore<PusherZustandStore>(set => ({
    pusherClient,
    privateChannel,
  }));

  // Bind all "present users changed" events to trigger updateMembers
  privateChannel.bind('pusher:subscription_succeeded', () => {
    store.setState({
      privateChannel,
    });
  });

  return store;
};

export const PrivatePusherContext = createContext<StoreApi<PusherZustandStore>>(
  null!
);

export const PrivatePusherProvider: React.FC<
  React.PropsWithChildren<{ slug: string }>
> = ({ children, slug }) => {
  const [store, updateStore] = useState<ReturnType<typeof createPusherStore>>();

  useEffect(() => {
    const newStore = createPusherStore(slug);
    updateStore(newStore);
    const unsubscribe = newStore.subscribe(() => {
      if (process.env.NODE_ENV === 'development')
        console.log('Pusher Store Updated', newStore.getState());
    });
    return () => {
      const pusher = newStore.getState().pusherClient;
      if (process.env.NODE_ENV === 'development')
        console.log('disconnecting pusher and destroying store', pusher);
      if (process.env.NODE_ENV === 'development')
        console.log(
          '(Expect a warning in terminal after this, React Dev Mode and all)'
        );
      pusher.unsubscribe(`private-${slug}`);
      unsubscribe();
    };
  }, [slug]);

  if (!store) return null;

  return (
    <PrivatePusherContext.Provider value={store}>
      {children}
    </PrivatePusherContext.Provider>
  );
};

/**
 * Section 3: "The Hooks"
 *
 * The exported hooks you use to interact with this store (in this case just an event sub)
 *
 * (I really want useEvent tbh)
 */
export function usePrivateSubscribeToEvent<MessageType>(
  eventName: string,
  callback: (data: MessageType) => void
) {
  const store = React.useContext(PrivatePusherContext);
  const channel = useStore(store, s => s.privateChannel);

  const stableCallback = React.useRef(callback);

  // Keep callback sync'd
  React.useEffect(() => {
    stableCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    const reference = (data: MessageType) => {
      stableCallback.current(data);
    };
    channel.bind(eventName, reference);
    return () => {
      channel.unbind(eventName, reference);
    };
  }, [channel, eventName]);
}
