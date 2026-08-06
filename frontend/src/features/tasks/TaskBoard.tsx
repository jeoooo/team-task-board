import { useEffect, useState } from 'react';
import {
  AppBar,
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  Stack,
  Toolbar,
  Typography,
  type SelectChangeEvent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchUsers } from '../users/usersSlice';
import { fetchTasks, setAssigneeFilter } from './tasksSlice';
import { STATUS_COLUMNS } from './statusMeta';
import { TaskColumn } from './TaskColumn';
import { CreateTaskDialog } from './CreateTaskDialog';

export function TaskBoard() {
  const dispatch = useAppDispatch();
  const { items: tasks, status, error, filters } = useAppSelector((state) => state.tasks);
  const users = useAppSelector((state) => state.users.items);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchTasks());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, filters.assigneeId, filters.status]);

  const handleAssigneeFilterChange = (event: SelectChangeEvent) => {
    dispatch(setAssigneeFilter(event.target.value));
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Team Task Board
          </Typography>
          <Button
            color="inherit"
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
          >
            New Task
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Filter by assignee:
          </Typography>
          <Select
            size="small"
            value={filters.assigneeId ?? 'all'}
            onChange={handleAssigneeFilterChange}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="all">All assignees</MenuItem>
            <MenuItem value="unassigned">Unassigned</MenuItem>
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </Select>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {status === 'loading' && tasks.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="flex-start">
            {STATUS_COLUMNS.map((col) => (
              <TaskColumn
                key={col.status}
                label={col.label}
                status={col.status}
                tasks={tasks.filter((t) => t.status === col.status)}
              />
            ))}
          </Stack>
        )}
      </Box>

      <CreateTaskDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </Box>
  );
}
