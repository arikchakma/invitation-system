import UsersTable from '@/components/projects/users-table';
import InvitationsTable from '@/components/projects/invitations-table';
import MaxWidthWrapper from '@/layouts/max-width-wrapper';
import useProject from '@/utils/use-project';
import InviteUserForm from '@/components/projects/invite-user-form';
import Container from '@/layouts/container';

export default function ProjectPage() {
	const { project, status, error } = useProject();

	return (
		<Container>
			<MaxWidthWrapper>
				<div>
					{!(status === 'success') ? (
						<>
							<div className="h-9 w-56 rounded bg-slate-300" />
							<div className="mt-1 h-6 w-36 rounded bg-slate-200" />
						</>
					) : (
						<>
							<h1 className="text-3xl font-bold">{project?.name}</h1>
							<p className="mt-1">{project?.slug}</p>
						</>
					)}
				</div>
				{status === 'success' && (
					<>
						<InviteUserForm />
						<div className="mt-10">
							<UsersTable />
							<InvitationsTable />
						</div>
					</>
				)}

				{status === 'error' && (
					<div className="font-semibold text-red-500">
						<p>{error?.message}</p>
					</div>
				)}
			</MaxWidthWrapper>
		</Container>
	);
}
