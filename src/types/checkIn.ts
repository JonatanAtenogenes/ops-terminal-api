export interface CheckIn {
	id: string;
	project_id: string;
	date: string;
	note: string | null;
	created_at: string;
}

export interface NewCheckIn {
	project_id: string;
	date: string;
	note?: string;
}
