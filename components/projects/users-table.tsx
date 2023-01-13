import { useRouter } from 'next/router';
import { cloneElement } from 'react';
import { ProjectUserProps } from '@/types/project';
import { useQuery } from '@tanstack/react-query';
import { timeAgo } from '@/lib/utils';
import { QueryError, fetcher } from '@/utils/fetcher';

export default function UsersTable() {
  const router = useRouter();
  const { slug } = router.query as {
    slug: string;
  };
  const {
    data: users,
    status,
    error,
  } = useQuery<ProjectUserProps[], QueryError>(
    ['users', slug],
    async () => fetcher(`/api/projects/${slug}/users`),
    {
      enabled: !!slug,
    }
  );
  return (
    <div>
      <h2 className="text-2xl font-bold">Users</h2>
      <ul className="mt-2 flex flex-col gap-2">
        {status === 'success' && (
          <>
            {users?.map(user => (
              <li key={user.id}>
                <div className="flex items-center justify-between gap-5 rounded-sm bg-slate-200 px-2 py-1">
                  <h4 className="text-sm font-medium">{user?.email}</h4>
                  <span className="text-xs text-gray-600">
                    Joined {timeAgo(user?.joinedAt)}
                  </span>
                </div>
              </li>
            ))}
          </>
        )}

        {status === 'success' && (
          <>
            {users.length === 0 && (
              <li>
                <div className="rounded-sm bg-slate-200 px-2 font-semibold">
                  No Users found
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
