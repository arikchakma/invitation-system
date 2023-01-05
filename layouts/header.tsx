import NextLink from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export default function Header() {
	const session = useSession();

	return (
		<header className="mb-10">
			<h1 className="text-3xl font-bold bg-gradient-to-br bg-clip-text text-transparent from-slate-900 to-slate-200">
				{session?.data?.user?.email}
			</h1>
			<div className="flex gap-2">
				<NextLink
					href="/"
					className="bg-black inline-block text-white px-4 py-1 mt-2 rounded"
				>
					Home
				</NextLink>
				<NextLink
					href="/projects"
					className="bg-black inline-block text-white px-4 py-1 mt-2 rounded"
				>
					Projects
				</NextLink>
				<button
					className="bg-black text-white px-4 py-1 mt-2 rounded"
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
