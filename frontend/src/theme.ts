import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#3F51B5' },
    background: { default: '#F4F5F7' },
  },
  shape: { borderRadius: 8 },
});
