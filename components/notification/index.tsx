import { useSession } from 'next-auth/react';
import { PrivatePusherProvider } from '@/lib/stores/private-pusher-store';
import NotificationPopover from './notification-popover';

function Notification() {
  const { data } = useSession();
  if (!data) return null;
  return (
    <PrivatePusherProvider slug={`user-${data?.user?.id}`}>
      <NotificationPopover />
    </PrivatePusherProvider>
  );
}

export default Notification;
