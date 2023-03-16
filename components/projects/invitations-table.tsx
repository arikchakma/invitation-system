import { cloneElement } from 'react';
import { useRouter } from 'next/router';
import { InvitationsProps } from '@/types/project';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { timeAgo } from '@/lib/utils';
import { QueryError, fetcher } from '@/utils/fetcher';
import useProject from '@/utils/use-project';

export default function InvitationsTable() {
  const router = useRouter();
  const { slug } = router.query as {
    slug: string;
  };
  const utils = useQueryClient();
  const { isOwner } = useProject({});
  const {
    data: invitations,
    status,
    error,
  } = useQuery<InvitationsProps[], QueryError>(
    ['invitations', slug],
    async () => {
      return fetcher(`/api/projects/${slug}/invite`);
    },
    {
      enabled: !!slug,
    }
  );

  const deleteInvitation = useMutation(async (email: string) => {
    return await fetch(`/api/projects/${slug}/invite`, {
      method: 'DELETE',
      body: JSON.stringify({ email }),
    });
  });

  const handleDeleteInvitation = (email: string) => {
    deleteInvitation.mutate(email, {
      onSuccess: () => {
        utils.invalidateQueries(['invitations', slug]);
      },
    });
  };

  return (
    <div>
      <h2 className="mt-10 text-2xl font-bold">Invitations</h2>
      <ul className="mt-2 flex flex-col gap-2">
        {status === 'success' && (
          <>
            {invitations?.map(invite => (
              <li key={invite.email}>
                <div className="flex items-center gap-5 rounded-sm bg-slate-200 px-2 py-1">
                  <h4 className="text-sm font-medium">{invite?.email}</h4>
                  <span className="text-xs text-gray-600">
                    Invited {timeAgo(invite?.invitedAt)}
                  </span>

                  {isOwner && (
                    <button
                      className="rounded bg-black px-2 py-1 text-xs text-white"
                      onClick={() => handleDeleteInvitation(invite.email)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </li>
            ))}
          </>
        )}

        {status === 'success' && (
          <>
            {invitations.length === 0 && (
              <li>
                <div className="rounded-sm bg-slate-200 px-2 font-semibold">
                  No invitations found
                </div>
              </li>
            )}
          </>
        )}

        {status === 'loading' && (
          <>
            {Array.from({ length: 2 }).map((_, i) =>
              cloneElement(
                <li>
                  <div className="h-8 rounded-sm bg-slate-200" />
                </li>,
                { key: i }
              )
            )}
          </>
        )}

        {status === 'error' && (
          <>
            <li>
              <div className="rounded-sm bg-slate-200 px-2 font-semibold">
                {error?.message}
              </div>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
