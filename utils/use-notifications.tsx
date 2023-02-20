import { useState } from 'react';
import { NotificationsUnseenProps } from '@/types/project';
import { useMutation, useQuery } from '@tanstack/react-query';
import { usePrivateSubscribeToEvent } from '@/lib/stores/private-pusher-store';
import { fetcher } from './fetcher';

export function useNotifications() {
  const [notifications, setNotifications] = useState<
    NotificationsUnseenProps[]
  >([]);
  const [count, setCount] = useState(0);

  const { refetch } = useQuery<NotificationsUnseenProps[]>(
    ['notifications'],
    async () => {
      return await fetcher('/api/notifications');
    },
    {
      onSuccess: data => {
        setNotifications(data);
        setCount(data.filter(n => !n.seen).length);
      },
    }
  );

  const seeNotification = useMutation({
    mutationFn: async () => {
      return (
        await fetch('/api/notifications', {
          method: 'PUT',
        })
      ).json() as Promise<{ message: string }>;
    },
    onSuccess: () => {
      refetch();
    },
  });

  usePrivateSubscribeToEvent<NotificationsUnseenProps>(
    'new-project-invitations',
    invitation => {
      refetch();
    }
  );

  return { notifications, count, seen: seeNotification.mutate };
}
