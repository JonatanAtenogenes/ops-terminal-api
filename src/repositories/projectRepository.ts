import type { SupabaseClient } from '@supabase/supabase-js';
import type { NewProject, Project, ProjectStatus } from '../types/project';

export interface ProjectRepository {
  listActive(): Promise<Project[]>;
  findById(id: string): Promise<Project | null>;
  create(project: NewProject): Promise<Project>;
  setStatus(id: string, status: ProjectStatus): Promise<Project | null>;
  softDelete(id: string): Promise<boolean>;
}

export function createProjectRepository(db: SupabaseClient): ProjectRepository {
  return {
    async listActive() {
      const { data, error } = await db
        .from('projects')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },

    async findById(id) {
      const { data, error } = await db
        .from('projects')
        .select('*')
        .eq('id', id)
        .is('deleted_at', null)
        .maybeSingle();

      if (error) throw error;

      return data;
    },

    async create(project) {
      const { data, error } = await db
        .from('projects')
        .insert(project)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    // Returns null when the project does not exist or was deleted
    async setStatus(id, status) {
      const { data, error } = await db
        .from('projects')
        .update({ status })
        .eq('id', id)
        .is('deleted_at', null)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },

    // Returns false when there was nothing to delete
    async softDelete(id) {
      const { data, error } = await db
        .from('projects')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .is('deleted_at', null)
        .select('id');

      if (error) throw error;
      return data.length > 0;
    },
  };
}
