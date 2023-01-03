import UsersTable from '@/components/projects/users-table';
import InvitationsTable from '@/components/projects/invitations-table';
import MaxWidthWrapper from '@/layouts/max-width-wrapper';
import { useRouter } from 'next/router';
import useProject from '@/utils/use-project';
import InviteUserForm from '@/components/projects/invite-user-form';

export default function ProjectPage() {
	const router = useRouter();
	const { slug } = router.query as {
		slug: string;
	};
	const { project } = useProject();

	return (
		<main className="mt-20">
			<MaxWidthWrapper>
				<div>
					<h1 className="font-bold text-3xl">{project?.name}</h1>
					<p>{project?.slug}</p>
				</div>
				<InviteUserForm />
				<div className="mt-10">
					<UsersTable />
					<InvitationsTable />
				</div>
			</MaxWidthWrapper>
		</main>
	);
}
