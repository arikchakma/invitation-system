import NextLink from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export default function Header() {
	const session = useSession();

	return (
		<header>
			<h1 className="text-3xl font-bold">{session?.data?.user?.email}</h1>
			<div className="flex gap-2">
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
