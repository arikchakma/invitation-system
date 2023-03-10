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
import { usePusherClient } from './pusher-wrapper-store';

interface PusherZustandStore {
  pusherClient: Pusher;
  // channel: Channel;
  presenceChannel: PresenceChannel;
  members: Map<string, any>;
  isSubscribed: boolean;
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

  const presenceChannel = pusherClient.subscribe(
    `presence-${slug}`
  ) as PresenceChannel;

  const store = createStore<PusherZustandStore>(set => ({
    pusherClient,
    // channel,
    presenceChannel,
    members: new Map(),
    isSubscribed: false,
  }));

  // Update helper that sets 'members' to contents of presence channel's current members
  const updateMembers = () => {
    store.setState({
      members: new Map(Object.entries(presenceChannel.members.members)),
    });
  };

  // Bind all "present users changed" events to trigger updateMembers
  presenceChannel.bind('pusher:subscription_succeeded', () => {
    updateMembers();
    store.setState({
      isSubscribed: true,
    });
  });
  presenceChannel.bind('pusher:member_added', updateMembers);
  presenceChannel.bind('pusher:member_removed', updateMembers);

  return store;
};

export const PusherContext = createContext<StoreApi<PusherZustandStore>>(null!);

export const PusherProvider: React.FC<
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
      pusher.unsubscribe(`presence-${slug}`);
      // pusher.disconnect();
      unsubscribe();
    };
  }, [slug]);

  if (!store) return null;

  return (
    <PusherContext.Provider value={store}>{children}</PusherContext.Provider>
  );
};

/**
 * Section 3: "The Hooks"
 *
 * The exported hooks you use to interact with this store (in this case just an event sub)
 *
 * (I really want useEvent tbh)
 */
export function useSubscribeToEvent<MessageType>(
  eventName: string,
  callback: (data: MessageType) => void
) {
  const store = React.useContext(PusherContext);
  const channel = useStore(store, s => s.presenceChannel);

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

export const useIsSubscribed = () => {
  const store = React.useContext(PusherContext);
  return useStore(store, s => s.isSubscribed);
};

export const useMembers = (): {
  members: { id: string; email: string; name: string }[];
  currentMemberCount: number;
} => {
  const store = React.useContext(PusherContext);
  const members = Array.from(
    useStore(store, s => s.members),
    ([id, member]) => ({
      id,
      email: member.email,
      name: member.name,
    })
  ).filter(
    (member, index, self) =>
      index === self.findIndex(m => m.email === member.email)
  );
  return { members, currentMemberCount: members.length };
};
