import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { ProjectProps } from '@/types/project';
import { useQuery } from '@tanstack/react-query';
import { QueryError, fetcher } from './fetcher';

export default function useProject() {
  const router = useRouter();
  const { slug } = router.query as {
    slug: string;
  };
  const {
    data: project,
    error,
    status,
  } = useQuery<ProjectProps, QueryError>(
    ['project', slug],
    async () => {
      return fetcher(`/api/projects/${slug}`);
    },
    {
      enabled: !!slug,
    }
  );

  const isOwner = useMemo(() => {
    if (project && Array.isArray(project.users)) {
      return project.users[0].role === 'owner';
    }
  }, [project]);

  return {
    project,
    error,
    isOwner,
    status,
  };
}
