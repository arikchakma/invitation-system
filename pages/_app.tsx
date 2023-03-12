import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css';
import { Analytics } from '@vercel/analytics/react';
import { PusherWrapper } from '@/lib/stores/pusher-wrapper-store';

const queryClient = new QueryClient();

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={session}>
          <PusherWrapper>
            <Component {...pageProps} />
          </PusherWrapper>
        </SessionProvider>
      </QueryClientProvider>
      <Analytics />
    </>
  );
}
