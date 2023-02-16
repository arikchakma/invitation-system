import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import KBD from '@/components/shared/kbd';
import { useDownKeysStore } from '@/lib/stores/use-down-keys-store';

export default function Header() {
  const session = useSession();
  const router = useRouter();
  const { downKeys, addKey, clearKeys } = useDownKeysStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Add the key to the downKeys map.
      addKey(e.key);

      // If the user is holding down the "p" key, go to the projects page.
      if (e.key === 'p') {
        // If the route is already "/projects", don't do anything.
        if (router.pathname !== '/projects') router.push('/projects');
      }
      // If the user is holding down the "h" key, go to the home page.
      if (e.key === 'h') {
        // If the route is already "/", don't do anything.
        if (router.pathname !== '/') router.push('/');
      }
    };

    const up = (e: KeyboardEvent) => {
      // Remove the key from the downKeys map.
      clearKeys();
    };

    document.addEventListener('keydown', down);
    document.addEventListener('keyup', up);
    return () => {
      document.removeEventListener('keydown', down);
      document.removeEventListener('keyup', up);
    };
  }, [router, addKey, clearKeys, downKeys]);

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
