import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '../../api/client';
import type { CreateTaskInput, Task, TaskFilters, TaskStatus } from '../../api/types';

interface TasksState {
  items: Task[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filters: TaskFilters;
}

const initialState: TasksState = {
  items: [],
  status: 'idle',
  error: null,
  filters: { status: 'all', assigneeId: 'all' },
};

function buildQuery(filters: TaskFilters): string {
  const params = new URLSearchParams();
  if (filters.status && filters.status !== 'all') params.set('status', filters.status);
  if (filters.assigneeId && filters.assigneeId !== 'all') params.set('assigneeId', filters.assigneeId);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', (_: void, { getState }) => {
  const { tasks } = getState() as { tasks: TasksState };
  return apiClient.get<Task[]>(`/tasks${buildQuery(tasks.filters)}`);
});

export const createTask = createAsyncThunk('tasks/createTask', (input: CreateTaskInput) =>
  apiClient.post<Task>('/tasks', input),
);

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateTaskStatus',
  ({ id, status }: { id: string; status: TaskStatus }) =>
    apiClient.patch<Task>(`/tasks/${id}/status`, { status }),
);

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id: string) => {
  await apiClient.delete<void>(`/tasks/${id}`);
  return id;
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setStatusFilter(state, action: PayloadAction<TaskFilters['status']>) {
      state.filters.status = action.payload;
    },
    setAssigneeFilter(state, action: PayloadAction<TaskFilters['assigneeId']>) {
      state.filters.assigneeId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load tasks';
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to create task';
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to update task';
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to delete task';
      });
  },
});

export const { setStatusFilter, setAssigneeFilter } = tasksSlice.actions;
export default tasksSlice.reducer;
