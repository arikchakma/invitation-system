import { useCallback, useEffect, useMemo } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Project } from '@prisma/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import CreateProject from '@/components/projects/create-project';
import KBD from '@/components/shared/kbd';
import Container from '@/layouts/container';
import MaxWidthWrapper from '@/layouts/max-width-wrapper';
import { QueryError, fetcher } from '@/utils/fetcher';

export default function Projects() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: projects, isSuccess } = useQuery<Project[], QueryError>(
    ['projects'],
    async () => fetcher('/api/projects')
  );

  const cache = useMemo(() => new Map<string, boolean>(), []);

  const prefetchProjectData = useCallback(
    (slug: string) => {
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
      queryClient.prefetchQuery(['messages', slug], async () => {
        return fetcher(`/api/projects/${slug}/message`);
      });
      cache.set(slug, true);
    },
    [cache, queryClient]
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.repeat
      ) {
        return;
      }

      projects?.forEach((project, index) => {
        if (e.key === `${index + 1}`) {
          router.push(`/${project.slug}`);
        }
      });
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [projects, router]);

  return (
    <Container>
      <MaxWidthWrapper className="pb-10">
        <CreateProject />

        <div className="mt-10">
          <h2 className="text-2xl font-bold">Projects</h2>
          <div className="mt-5 grid grid-cols-4 gap-5 -lg:grid-cols-3 -md:grid-cols-2 -sm:grid-cols-1">
            {isSuccess &&
              projects?.map((project, index) => (
                <NextLink
                  href={`/${project.slug}`}
                  key={project.id}
                  onMouseEnter={() => prefetchProjectData(project.slug)}
                  onFocus={() => prefetchProjectData(project.slug)}
                  className="relative"
                >
                  <div className="rounded-md border border-gray-100/40 bg-white p-5 shadow transition hover:shadow-md">
                    <p>{project.name}</p>
                  </div>
                  <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 ring-2 ring-white">
                    <KBD>{index + 1}</KBD>
                  </div>
                </NextLink>
              ))}
          </div>
        </div>
      </MaxWidthWrapper>
    </Container>
  );
}
