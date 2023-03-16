import { GetServerSideProps } from 'next';
import { ProjectProps } from '@/types/project';
import { getServerSession } from 'next-auth';
import ChatWrapper from '@/components/chat';
import InvitationsTable from '@/components/projects/invitations-table';
import InviteUserForm from '@/components/projects/invite-user-form';
import UsersTable from '@/components/projects/users-table';
import prisma from '@/lib/prisma';
import Container from '@/layouts/container';
import MaxWidthWrapper from '@/layouts/max-width-wrapper';
import { cn } from '@/utils/cn';
import useProject from '@/utils/use-project';
import { authOptions } from '../api/auth/[...nextauth]';

export default function ProjectPage({
  project: _project,
}: {
  project: ProjectProps;
}) {
  const { project, status, error, isOwner } = useProject({
    initialData: _project,
  });

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

export const getServerSideProps: GetServerSideProps = async context => {
  const { slug } = context.query as {
    slug: string;
  };
  const session = await getServerSession(context.req, context.res, authOptions);

  const project = await prisma.project.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      users: {
        where: {
          userId: session?.user?.id,
        },
        select: {
          role: true,
        },
      },
    },
  });

  if (!project) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      project,
    },
  };
};
