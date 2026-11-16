import type { SupabaseClient } from '@supabase/supabase-js';
import {
  createCheckInRepository,
  type CheckInRepository,
} from './checkInRepository';
import {
  createProjectRepository,
  type ProjectRepository,
} from './projectRepository';
import { createTaskRepository, type TaskRepository } from './taskRepository';

export interface Repositories {
  projects: ProjectRepository;
  tasks: TaskRepository;
  checkIns: CheckInRepository;
}

export function createRepositories(db: SupabaseClient): Repositories {
  return {
    projects: createProjectRepository(db),
    tasks: createTaskRepository(db),
    checkIns: createCheckInRepository(db),
  };
}
