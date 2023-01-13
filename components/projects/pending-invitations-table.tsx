import { useRouter } from 'next/router';
import { PendingInvitationsProps } from '@/types/project';
import { useMutation, useQuery } from '@tanstack/react-query';
import Balancer from 'react-wrap-balancer';
import { timeAgo } from '@/lib/utils';

export default function PendingInvitationsTable() {
  const router = useRouter();
  const { data: pendingInivatations } = useQuery<PendingInvitationsProps[]>(
    ['pendingInvitations'],
    async () => {
      return (await fetch('/api/projects/get-user-invitations')).json();
    }
  );

  const acceptInvitation = useMutation(async (slug: string) => {
    return await fetch(`/api/projects/${slug}/invite/accept`, {
      method: 'POST',
      body: JSON.stringify({ slug }),
    });
  });

  return (
    <div>
      <ul className="mt-10 flex max-w-xl flex-col gap-5">
        {pendingInivatations?.map((invitation, index) => (
          <li key={invitation.email + index}>
            <div>
              <p>
                <Balancer>
                  <strong>{invitation.project.name}</strong> has invited you{' '}
                  <strong>{timeAgo(invitation.createdAt)}</strong> to join their
                  project. By accepting this invitation you will be able to view
                  and edit the project.
                </Balancer>
              </p>
              <button
                onClick={() => {
                  acceptInvitation.mutate(invitation.project.slug, {
                    onSuccess: () => {
                      router.push(`/${invitation.project.slug}`);
                    },
                  });
                }}
                className="mt-2 rounded bg-black px-4 py-1 text-white"
              >
                Accept
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div>
        {pendingInivatations?.length === 0 && <p>No pending invitations</p>}
      </div>
    </div>
  );
}
