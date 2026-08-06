import { MenuItem } from '@mui/material';
import type { User } from '../../api/types';

export function AssigneeMenuItems({ users }: { users: User[] }) {
  return (
    <>
      {users.map((user) => (
        <MenuItem key={user.id} value={user.id}>
          {user.name}
        </MenuItem>
      ))}
    </>
  );
}
