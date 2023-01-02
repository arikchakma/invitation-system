import { Inter } from '@next/font/google';
import { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
	const { data: pendingInivatations } = useQuery(
		['pendingInvitations'],
		async () => {
			return (await fetch('/api/projects/get-user-invitations')).json();
		}
	);

	console.log(pendingInivatations);

	return (
		<main className="flex items-center justify-center px-5 h-screen">
			Hello
		</main>
	);
}
