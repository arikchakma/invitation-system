import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Pusher from 'pusher-js';
import { PrivatePusherProvider, usePrivateSubscribeToEvent } from '@/lib/stores/private-pusher-store';


export default function Notification() {
  const { data } = useSession();

  if (!data) {
    return (
      <main>
        <h1>Not signed in</h1>
      </main>
    );
  }
  return (
    <PrivatePusherProvider slug={`user-${data?.user?.id}`}>
      <NotificationBox />
    </PrivatePusherProvider>
  );
}

function NotificationBox() {
  const { data } = useSession();
  const [invites, setInvites] = useState<any[]>([]);
  
  Pusher.logToConsole = true
  usePrivateSubscribeToEvent('new-invite', (data:any) => {
    setInvites(prev=> [...prev, data])
  })

  console.log(invites);

  return <>Hello</>;
}
