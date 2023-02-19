import { useState } from 'react';
import { PendingInvitationsProps } from '@/types/project';
import { useQuery } from '@tanstack/react-query';
import { usePrivateSubscribeToEvent } from '@/lib/stores/private-pusher-store';
import { fetcher } from './fetcher';

export function useNotifications() {
  const [notifications, setNotifications] = useState<PendingInvitationsProps[]>(
    []
  );
  const [notificationsCount, setNotificationsCount] = useState(0);

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
      setNotificationsCount(c => c + 1);
    }
  );

  const resetCount = () => {
    setNotificationsCount(0);
  };

  return { notifications, count: notificationsCount, reset: resetCount };
}
