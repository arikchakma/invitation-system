import { Inter } from '@next/font/google';
import { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
	return (
		<main className="flex items-center justify-center px-5 h-screen">
			Hello
		</main>
	);
}
