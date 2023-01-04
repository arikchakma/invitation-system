export interface ProjectUserProps {
	id: string;
	email: string;
	name: string;
	joinedAt: Date;
}

export interface ProjectProps {
	id: string;
	name: string;
	slug: string;
	users?: {
		role: string;
	}[];
}

export interface InvitationsProps {
	email: string;
	createdAt: Date;
	project: {
		name: string;
		slug: string;
	};
}

