import { ReactNode, useState, MouseEvent } from "react";
import { AppBar, Box, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import RefreshIcon from "@mui/icons-material/Refresh";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRefresh, useLogout, Layout as RALayout } from "react-admin";
import { InclusionMenu } from "./InclusionMenu"; // Ajusta la ruta según la ubicación del archivo

export const CustomAppBar = (props: any) => {
  const refresh = useRefresh();
  const logout = useLogout();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleLogout = () => {
    // Mostrar un cuadro de confirmación
    const confirmLogout = window.confirm("¿Estás seguro de que deseas cerrar sesión?");
    
    // Si el usuario confirma, ejecutar el logout
    if (confirmLogout) {
      logout();
    }
  };

  return (
    <AppBar {...props}>
      <Box display="flex" justifyContent="space-between" alignItems="center" flex="1">
        <Typography variant="h6" color="inherit">CRM</Typography>

        <Box display="flex" alignItems="center">
          <IconButton color="inherit" onClick={handleRefresh}>
            <RefreshIcon />
          </IconButton>

          <IconButton color="inherit" onClick={handleMenuClick}>
            <SettingsIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            keepMounted
          >
            <MenuItem onClick={handleMenuClose}>Configuraciones</MenuItem>
            <InclusionMenu />
          </Menu>

          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Box>
      </Box>
    </AppBar>
  );
};

export const Layout = ({ children }: { children: ReactNode }) => (
  <RALayout appBar={CustomAppBar}>
    {children}
  </RALayout>
);
