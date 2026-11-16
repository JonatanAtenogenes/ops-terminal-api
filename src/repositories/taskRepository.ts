import type { SupabaseClient } from '@supabase/supabase-js';
import type { NewTask, Task } from '../types/task';

export interface TaskRepository {
  listByProject(projectId: string): Promise<Task[]>;
  listByProjects(projectIds: string[]): Promise<Task[]>;
  findById(id: string): Promise<Task | null>;
  create(task: NewTask): Promise<Task>;
  complete(id: string): Promise<Task | null>;
  softDelete(id: string): Promise<boolean>;
}

export function createTaskRepository(db: SupabaseClient): TaskRepository {
  return {
    async listByProject(projectId) {
      const { data, error } = await db
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .is('deleted_at', null)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },

    // One query for many projects, used by the situation report to avoid N+1
    async listByProjects(projectIds) {
      if (projectIds.length === 0) return [];

      const { data, error } = await db
        .from('tasks')
        .select('*')
        .in('project_id', projectIds)
        .is('deleted_at', null)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },

    async findById(id) {
      const { data, error } = await db
        .from('tasks')
        .select('*')
        .eq('id', id)
        .is('deleted_at', null)
        .maybeSingle();

      if (error) throw error;
      return data;
    },

    async create(task) {
      const { data, error } = await db
        .from('tasks')
        .insert(task)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    // Returns null when the task does not exist, was deleted or is already done
    async complete(id) {
      const { data, error } = await db
        .from('tasks')
        .update({ status: 'done', completed_at: new Date().toISOString() })
        .eq('id', id)
        .is('deleted_at', null)
        .neq('status', 'done')
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },

    async softDelete(id) {
      const { data, error } = await db
        .from('tasks')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .is('deleted_at', null)
        .select('id');

      if (error) throw error;
      return data.length > 0;
    },
  };
}
