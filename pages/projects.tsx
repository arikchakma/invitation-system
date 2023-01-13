import NextLink from 'next/link';
import { Project } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import CreateProject from '@/components/projects/create-project';
import Container from '@/layouts/container';
import MaxWidthWrapper from '@/layouts/max-width-wrapper';
import { QueryError, fetcher } from '@/utils/fetcher';

export default function Projects() {
  const { data: session } = useSession();

  const { data: projects, isSuccess } = useQuery<Project[], QueryError>(
    ['projects'],
    async () => fetcher('/api/projects')
  );

  if (!session) {
    return <div>Not signed in</div>;
  }

  return (
    <Container>
      <MaxWidthWrapper>
        <CreateProject />

        <div className="mt-10">
          <h2 className="text-2xl font-bold">Projects</h2>
          <div className="mt-5 grid grid-cols-4 gap-5">
            {isSuccess &&
              projects?.map(project => (
                <NextLink href={`/${project.slug}`} key={project.id}>
                  <div className="rounded-md border border-gray-100/40 bg-white p-5 shadow transition hover:shadow-md">
                    <p>{project.name}</p>
                  </div>
                </NextLink>
              ))}
          </div>
        </div>
      </MaxWidthWrapper>
    </Container>
  );
}
