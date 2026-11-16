import type { SupabaseClient } from '@supabase/supabase-js';
import type { CheckIn, NewCheckIn } from '../types/checkIn';

export interface CheckInRepository {
  listByProject(projectId: string): Promise<CheckIn[]>;
  listByProjects(projectIds: string[]): Promise<CheckIn[]>;
  upsert(checkIn: NewCheckIn): Promise<CheckIn>;
}

export function createCheckInRepository(db: SupabaseClient): CheckInRepository {
  return {
    async listByProject(projectId) {
      const { data, error } = await db
        .from('check_ins')
        .select('*')
        .eq('project_id', projectId)
        .order('date', { ascending: true });

      if (error) throw error;
      return data;
    },

    async listByProjects(projectIds) {
      if (projectIds.length === 0) return [];

      const { data, error } = await db
        .from('check_ins')
        .select('*')
        .in('project_id', projectIds)
        .order('date', { ascending: true });

      if (error) throw error;
      return data;
    },

    // One check-in per project per day: a second log on the same date updates it
    async upsert(checkIn) {
      const { data, error } = await db
        .from('check_ins')
        .upsert(checkIn, { onConflict: 'project_id,date' })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  };
}
