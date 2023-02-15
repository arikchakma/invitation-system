import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Inter } from '@next/font/google';
import { signIn, useSession } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [email, setEmail] = useState('');

  return (
    <main className="flex h-screen items-center justify-center px-5">
      <form
        className="mx-auto w-[min(100vw,424px)] rounded-md bg-white p-5 shadow-2xl"
        onSubmit={async e => {
          e.preventDefault();
          await signIn('email', { email, redirect: false });
        }}
      >
        <div>
          <label htmlFor="email" className="block text-xs text-gray-600">
            EMAIL ADDRESS
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="hello@arikko.dev"
            autoComplete="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-black focus:outline-none focus:ring-black sm:text-sm"
          />
        </div>
        <button
          className={
            'mt-3 flex h-10 w-full items-center justify-center rounded-md border border-black bg-black text-sm text-white transition-all hover:bg-white hover:text-black focus:outline-none'
          }
        >
          Send magic link
        </button>
      </form>
    </main>
  );
}
