// Topbar.tsx
import React, { useState, MouseEvent, useContext } from 'react';
import { AppBar, useTheme } from '@mui/material';
import { Typography, IconButton, Box, Menu, MenuItem } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import RefreshIcon from '@mui/icons-material/Refresh';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useLogout } from 'react-admin';
import { ColorModeContext } from '../theme';

const Topbar = (props: any) => {
  const logout = useLogout();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm('¿Estás seguro de que deseas cerrar sesión?');
    if (confirmLogout) {
      logout();
    }
  };

  return (
    <AppBar {...props}>
      <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
        <Typography variant="h6" color="inherit">
          CRM
        </Typography>
        <Box display="flex" alignItems="center">
          <IconButton color="inherit" onClick={() => window.location.reload()}>
            <RefreshIcon />
          </IconButton>
          <IconButton color="inherit" onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Box>
      </Box>
    </AppBar>
  );
};

export default Topbar;