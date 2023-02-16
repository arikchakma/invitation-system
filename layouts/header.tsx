import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import KBD from '@/components/shared/kbd';
import { useHotkeysHandler } from '@/utils/use-hotkeys-handler';

export default function Header() {
  const session = useSession();
  const router = useRouter();
  useHotkeysHandler(['p'], () => {
    if (router.pathname !== '/projects') router.push('/projects');
  });

  useHotkeysHandler(['h'], () => {
    if (router.pathname !== '/') router.push('/');
  });

  return (
    <header className="mb-10">
      {session.data ? (
        <h1 className="bg-gradient-to-br from-slate-900 to-slate-200 bg-clip-text text-3xl font-bold text-transparent">
          {session?.data?.user?.email}
        </h1>
      ) : (
        <div className="h-9 w-72 rounded bg-slate-200" />
      )}
      <div className="mt-2 flex gap-2">
        <NextLink
          href="/"
          className="inline-block rounded bg-black px-4 py-1 text-white"
        >
          Home
        </NextLink>
        <NextLink
          href="/projects"
          className="inline-block rounded bg-black px-4 py-1 text-white"
        >
          Projects
        </NextLink>
        <button
          className="rounded bg-black px-4 py-1 text-white"
          onClick={() => {
            signOut();
          }}
        >
          Log Out
        </button>
      </div>

      <p className="mt-5 font-semibold text-gray-800">
        Press <KBD>h</KBD> to go home and <KBD>p</KBD> to go projects.
      </p>
    </header>
  );
}
