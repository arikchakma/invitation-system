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
							<div className="h-9 bg-slate-300 rounded w-56" />
							<div className="h-6 bg-slate-200 mt-1 w-36 rounded" />
						</>
					) : (
						<>
							<h1 className="font-bold text-3xl">{project?.name}</h1>
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
					<div className="text-red-500 font-semibold">
						<p>{error?.message}</p>
					</div>
				)}
			</MaxWidthWrapper>
		</Container>
	);
}
