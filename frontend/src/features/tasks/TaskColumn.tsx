import { Box, Paper, Stack, Typography } from '@mui/material';
import type { Task, TaskStatus } from '../../api/types';
import { TaskCard } from './TaskCard';

export function TaskColumn({
  label,
  status,
  tasks,
}: {
  label: string;
  status: TaskStatus;
  tasks: Task[];
}) {
  return (
    <Paper
      variant="outlined"
      sx={{ p: 2, flex: 1, minWidth: 280, bgcolor: 'grey.50', display: 'flex', flexDirection: 'column' }}
      data-status={status}
    >
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
        {label} ({tasks.length})
      </Typography>
      <Stack spacing={1.5}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <Box sx={{ py: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.disabled">
              No tasks
            </Typography>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}
