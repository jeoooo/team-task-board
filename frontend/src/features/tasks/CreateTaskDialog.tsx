import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { createTask } from './tasksSlice';

export function CreateTaskDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users.items);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setTitle('');
    setDescription('');
    setAssigneeId('');
    setError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setSubmitting(true);
    setError(null);
    const result = await dispatch(
      createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        assigneeId: assigneeId || undefined,
      }),
    );
    setSubmitting(false);
    if (createTask.fulfilled.match(result)) {
      handleClose();
    } else {
      setError('Failed to create task');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>New Task</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={!!error}
            helperText={error}
            autoFocus
            fullWidth
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            minRows={2}
            fullWidth
          />
          <Select
            displayEmpty
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            fullWidth
          >
            <MenuItem value="">Unassigned</MenuItem>
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
