import type { TaskStatus } from '../../api/types';

export const STATUS_COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: 'todo', label: 'To Do' },
  { status: 'in_progress', label: 'In Progress' },
  { status: 'done', label: 'Done' },
];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

export const STATUS_COLORS: Record<TaskStatus, 'default' | 'info' | 'success'> = {
  todo: 'default',
  in_progress: 'info',
  done: 'success',
};
