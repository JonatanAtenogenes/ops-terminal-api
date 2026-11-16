export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
	id: string;
	project_id: string;
	title: string;
	status: TaskStatus;
	priority: TaskPriority;
	due_date: string | null;
	completed_at: string | null;
	deleted_at: string | null;
	created_at: string;
}

export interface NewTask {
	project_id: string;
	title: string;
	priority?: TaskPriority;
	due_date?: string;
}
