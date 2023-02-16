import NextLink from 'next/link';
import { useEffect, useRef } from 'react';
import { signOut, useSession } from 'next-auth/react';
import KBD from '@/components/shared/kbd';

export default function Header() {
  const session = useSession();
  const projectRef = useRef<HTMLAnchorElement>(null);
  const homeRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const goTo = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.key === 'p') {
        projectRef.current?.click();
      }
      if (e.key === 'h') {
        homeRef.current?.click();
      }
    };

    document.addEventListener('keydown', goTo);
    return () => {
      document.removeEventListener('keydown', goTo);
    };
  }, []);

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
          ref={homeRef}
          href="/"
          className="inline-block rounded bg-black px-4 py-1 text-white"
        >
          Home
        </NextLink>
        <NextLink
          ref={projectRef}
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
        <KBD>h</KBD>
        <KBD>p</KBD>
      </div>
    </header>
  );
}
