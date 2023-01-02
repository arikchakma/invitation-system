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