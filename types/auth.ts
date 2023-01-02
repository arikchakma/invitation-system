import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth';
import { ProjectProps } from './project';

export interface UserProps {
	id: string;
	name: string;
	email: string;
	projects?: { projectId: string }[];
}

export interface WithProjectAuth {
	(
		req: NextApiRequest,
		res: NextApiResponse,
		project?: ProjectProps,
		session?: Session
	): Promise<void>;
}

export interface WithUserAuth {
	(
		req: NextApiRequest,
		res: NextApiResponse,
		session: Session,
		user?: UserProps
	): Promise<void>;
}
