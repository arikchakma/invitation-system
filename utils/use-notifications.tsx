import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usePrivateSubscribeToEvent } from '@/lib/stores/private-pusher-store';
import { fetcher } from './fetcher';

export function useNotifications() {
  const [notifications, setNotifications] = useState<any[]>(
    []
  );
  const [count, setCount] = useState(0);

  const { refetch } = useQuery<any[]>(
    ['notifications'],
    async () => {
      return await fetcher('/api/notifications');
    },
    {
      onSuccess: data => {
        setNotifications(data);
        setCount(data.filter(n => !n.seen).length)
      },
    }
  );

  usePrivateSubscribeToEvent<any>(
    'new-project-invitations',
    invitation => {
      refetch();
    }
  );

  return { notifications, count };
}
