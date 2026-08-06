import { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Stack,
  type SelectChangeEvent,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useAppDispatch } from '../../app/hooks';
import type { Task, TaskStatus } from '../../api/types';
import { deleteTask, updateTaskStatus } from './tasksSlice';
import { STATUS_COLUMNS } from './statusMeta';

export function TaskCard({ task }: { task: Task }) {
  const dispatch = useAppDispatch();
  const [deleting, setDeleting] = useState(false);

  const handleStatusChange = (event: SelectChangeEvent) => {
    dispatch(updateTaskStatus({ id: task.id, status: event.target.value as TaskStatus }));
  };

  const handleDelete = async () => {
    setDeleting(true);
    await dispatch(deleteTask(task.id));
    setDeleting(false);
  };

  return (
    <Card variant="outlined" sx={{ opacity: deleting ? 0.5 : 1 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          {task.title}
        </Typography>
        {task.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {task.description}
          </Typography>
        )}
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            size="small"
            label={task.assignee ? task.assignee.name : 'Unassigned'}
            variant="outlined"
          />
        </Stack>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Select
          size="small"
          value={task.status}
          onChange={handleStatusChange}
          aria-label={`Status for ${task.title}`}
        >
          {STATUS_COLUMNS.map((col) => (
            <MenuItem key={col.status} value={col.status}>
              {col.label}
            </MenuItem>
          ))}
        </Select>
        <IconButton
          aria-label={`Delete ${task.title}`}
          size="small"
          onClick={handleDelete}
          disabled={deleting}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </CardActions>
    </Card>
  );
}
