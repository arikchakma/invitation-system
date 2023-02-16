import { useEffect, useState } from 'react';
import { Inter } from '@next/font/google';
import { signIn } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] });
let i =0
export default function Home() {
  const [email, setEmail] = useState('');
  const [status = 'idle', setStatus] = useState<
    'idle' | 'loading' | 'error' | 'success'
  >();
  i++;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (status === 'success') {
        setStatus('idle');
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [status]);

  return (
    <main className="flex h-screen items-center justify-center px-5">
      <form
        className="mx-auto w-[min(100vw,424px)] rounded-md bg-white p-5 shadow-2xl"
        onSubmit={async e => {
          e.preventDefault();
          setStatus('loading');
          signIn('email', { email, redirect: false })
            .then(res => {
              if (res?.ok && !res?.error) {
                setStatus('success');
                setEmail('');
              } else {
                setStatus('error');
              }
            })
            .catch(() => {
              setStatus('error');
            });
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
          {status === 'loading' && 'Loading...'}
          {status === 'error' && 'Error sending email - try again?'}
          {status === 'success' && 'Email sent - check your inbox!'}
          {status === 'idle' && 'Send magic link'}
        </button>
      </form>
    </main>
  );
}
