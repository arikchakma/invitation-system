import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';

const queryClient = new QueryClient();

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}: AppProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<SessionProvider session={session}>
				<Component {...pageProps} />
			</SessionProvider>
		</QueryClientProvider>
	);
}
