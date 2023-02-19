import { useState } from 'react';
import { PendingInvitationsProps } from '@/types/project';
import { useQuery } from '@tanstack/react-query';
import { useNotificationsStore } from '@/lib/stores/notifications-store';
import { usePrivateSubscribeToEvent } from '@/lib/stores/private-pusher-store';
import { fetcher } from './fetcher';

export function useNotifications() {
  const [notifications, setNotifications] = useState<PendingInvitationsProps[]>(
    []
  );
  const { count, reset, increase } = useNotificationsStore();

  const { refetch } = useQuery<PendingInvitationsProps[]>(
    ['pendingInvitations'],
    async () => {
      return await fetcher('/api/projects/get-user-invitations');
    },
    {
      onSuccess: data => {
        setNotifications(data);
      },
    }
  );

  usePrivateSubscribeToEvent<PendingInvitationsProps>(
    'new-project-invitations',
    invitation => {
      refetch();
      increase();
    }
  );

  return { notifications, count, reset };
}
