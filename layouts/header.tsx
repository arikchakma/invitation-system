import NextLink from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export default function Header() {
  const session = useSession();

  return (
    <header className="mb-10">
      {session.data ? (
        <h1 className="bg-gradient-to-br from-slate-900 to-slate-200 bg-clip-text text-3xl font-bold text-transparent">
          {session?.data?.user?.email}
        </h1>
      ) : (
        <div className="h-9 w-72 rounded bg-slate-200" />
      )}
      <div className="flex gap-2">
        <NextLink
          href="/"
          className="mt-2 inline-block rounded bg-black px-4 py-1 text-white"
        >
          Home
        </NextLink>
        <NextLink
          href="/projects"
          className="mt-2 inline-block rounded bg-black px-4 py-1 text-white"
        >
          Projects
        </NextLink>
        <button
          className="mt-2 rounded bg-black px-4 py-1 text-white"
          onClick={() => {
            signOut();
          }}
        >
          Log Out
        </button>
      </div>
    </header>
  );
}
