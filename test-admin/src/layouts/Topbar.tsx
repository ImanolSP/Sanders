import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import RefreshIcon from "@mui/icons-material/Refresh";
import LogoutIcon from "@mui/icons-material/Logout";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useLogout } from "react-admin";
import { ColorModeContext, tokens } from "../theme";

const Topbar = () => {
  const logout = useLogout();
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const colors = tokens(theme.palette.mode); // Use color tokens based on the current theme mode

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "¿Estás seguro de que deseas cerrar sesión?"
    );
    if (confirmLogout) {
      logout();
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: colors.primary[400] }}>
      <Toolbar>
        <Typography
          variant="h6"
          color="inherit"
          sx={{ flexGrow: 1, color: colors.grey[100] }}
        >
          CRM
        </Typography>
        <IconButton
          color="inherit"
          sx={{ color: colors.grey[100] }}
          onClick={() => window.location.reload()}
        >
          <RefreshIcon />
        </IconButton>
        <IconButton
          color="inherit"
          sx={{ color: colors.grey[100] }}
          onClick={colorMode.toggleColorMode}
        >
          {theme.palette.mode === "dark" ? (
            <Brightness7Icon />
          ) : (
            <Brightness4Icon />
          )}
        </IconButton>
        <IconButton
          color="inherit"
          sx={{ color: colors.grey[100] }}
          onClick={handleLogout}
        >
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
