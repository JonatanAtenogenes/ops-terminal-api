export type ProjectStatus = 'active' | 'paused' | 'archived';

export interface Project {
	id: string;
	name: string;
	description: string | null;
	status: ProjectStatus;
	start_date: string;
	due_date: string | null;
	deleted_at: string | null;
	created_at: string;
}

export interface NewProject {
	name: string;
	description?: string;
	due_date?: string;
}
