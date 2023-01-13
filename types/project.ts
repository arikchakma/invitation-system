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

export interface PendingInvitationsProps {
  email: string;
  createdAt: Date;
  project: {
    name: string;
    slug: string;
  };
}

export interface InvitationsProps {
  email: string;
  invitedAt: Date;
}
