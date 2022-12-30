import { Inter } from '@next/font/google';
import { useState } from 'react';
import { signIn } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
	const [email, setEmail] = useState('');

	return (
		<main>
			<form
				className="max-w-md mx-auto"
				onSubmit={async (e) => {
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
						onChange={(e) => setEmail(e.target.value)}
						className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
					/>
				</div>
				<button
					className={
						'border-black bg-black text-white hover:bg-white hover:text-black flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none mt-3'
					}
				>
					Send magic link
				</button>
			</form>
		</main>
	);
}
