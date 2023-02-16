import NextLink from 'next/link';
import {
  InvitationsProps,
  ProjectProps,
  ProjectUserProps,
} from '@/types/project';
import { Project } from '@prisma/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import CreateProject from '@/components/projects/create-project';
import Container from '@/layouts/container';
import MaxWidthWrapper from '@/layouts/max-width-wrapper';
import { QueryError, fetcher } from '@/utils/fetcher';

export default function Projects() {
  const queryClient = useQueryClient();
  const { data: projects, isSuccess } = useQuery<Project[], QueryError>(
    ['projects'],
    async () => fetcher('/api/projects')
  );

  const cache = new Map<string, boolean>();

  const prefetchProjectData = (slug: string) => {
    if (cache.has(slug)) return;
    queryClient.prefetchQuery(['project', slug], async () => {
      return fetcher(`/api/projects/${slug}`);
    });
    queryClient.prefetchQuery(['users', slug], async () => {
      return fetcher(`/api/projects/${slug}/users`);
    });
    queryClient.prefetchQuery(['invitations', slug], async () => {
      return fetcher(`/api/projects/${slug}/invite`);
    });
    cache.set(slug, true);
  };

  return (
    <Container>
      <MaxWidthWrapper>
        <CreateProject />

        <div className="mt-10">
          <h2 className="text-2xl font-bold">Projects</h2>
          <div className="mt-5 grid grid-cols-4 gap-5">
            {isSuccess &&
              projects?.map(project => (
                <NextLink
                  href={`/${project.slug}`}
                  key={project.id}
                  onMouseEnter={async () => prefetchProjectData(project.slug)}
                  onFocus={async () => prefetchProjectData(project.slug)}
                >
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
