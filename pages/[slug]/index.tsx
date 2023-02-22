import ChatWrapper from '@/components/chat';
import InvitationsTable from '@/components/projects/invitations-table';
import InviteUserForm from '@/components/projects/invite-user-form';
import UsersTable from '@/components/projects/users-table';
import Container from '@/layouts/container';
import MaxWidthWrapper from '@/layouts/max-width-wrapper';
import { cn } from '@/utils/cn';
import useProject from '@/utils/use-project';

export default function ProjectPage() {
  const { project, status, error, isOwner } = useProject();

  return (
    <Container>
      <MaxWidthWrapper className="pb-10">
        <div>
          {!(status === 'success') ? (
            <>
              <div className="h-9 w-56 rounded bg-slate-300" />
              <div className="mt-1 h-6 w-36 rounded bg-slate-200" />
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold">{project?.name}</h1>
              <p className="mt-1">{project?.slug}</p>
            </>
          )}
        </div>

        <div
          className={cn(
            'mt-10 grid gap-2 -sm:grid-cols-1 -sm:gap-20',
            isOwner ? 'grid-cols-2' : 'grid-cols-1'
          )}
        >
          <ChatWrapper />
          {isOwner && (
            <div>
              <InviteUserForm />
              <div className="mt-10">
                <UsersTable />
                <InvitationsTable />
              </div>
            </div>
          )}
        </div>

        {status === 'error' && (
          <div className="font-semibold text-red-500">
            <p>{error?.message}</p>
          </div>
        )}
      </MaxWidthWrapper>
    </Container>
  );
}
