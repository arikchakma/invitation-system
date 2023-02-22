/**
 * Pusher Context
 *
 * This context is used to provide the pusher store to all components
 */

/**
 * Provider for Pusher Context
 */ import React, { createContext, useEffect, useState } from 'react';
import Pusher, { PresenceChannel } from 'pusher-js';
import { useStore } from 'zustand';
import { StoreApi, createStore } from 'zustand/vanilla';
import { getRandomId } from '@/utils/get-random-id';

interface PusherWrapperZustandStore {
  pusherClient: Pusher;
}

const pusher_key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY!;
const pusher_server_host = process.env.NEXT_PUBLIC_PUSHER_SERVER_HOST!;
const pusher_server_port = parseInt(
  process.env.NEXT_PUBLIC_PUSHER_SERVER_PORT!,
  10
);
const pusher_server_tls = process.env.NEXT_PUBLIC_PUSHER_SERVER_TLS === 'true';
const pusher_server_cluster = 'us2';

const createPusherStore = () => {
  Pusher.logToConsole = process.env.NODE_ENV === 'development';
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

  const store = createStore<PusherWrapperZustandStore>(set => ({
    pusherClient,
  }));

  return store;
};

export const PusherWrapperContext = createContext<
  StoreApi<PusherWrapperZustandStore>
>(null!);

export const PusherWrapper: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [store, updateStore] = useState<ReturnType<typeof createPusherStore>>();

  useEffect(() => {
    const newStore = createPusherStore();
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
      pusher.disconnect();
      unsubscribe();
    };
  }, []);

  if (!store) return null;

  return (
    <PusherWrapperContext.Provider value={store}>
      {children}
    </PusherWrapperContext.Provider>
  );
};

// This is a custom hook that will allow us to use the pusher store
export function usePusherClient() {
  const store = React.useContext(PusherWrapperContext);
  return useStore(store, s => s.pusherClient);
}
