import { ReactNode, useState, MouseEvent } from "react";
import { AppBar, Box, Typography, IconButton, Menu, MenuItem, styled } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import RefreshIcon from "@mui/icons-material/Refresh";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRefresh, useLogout, Layout as RALayout, LayoutProps } from "react-admin";
import { InclusionMenu } from "./InclusionMenu";

const CustomizedAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'rgba(24,36,89,255)',
  height: '60px',
  [theme.breakpoints.up('sm')]: {
    height: '63px',
  },
}));

const CustomizedLayout = styled(RALayout)(({ theme }) => ({
  '& .RaLayout-appFrame': {
    marginTop: 0,
  },
  '& .RaLayout-contentWithSidebar': {
    marginTop: '64px',
    [theme.breakpoints.up('sm')]: {
      marginTop: '72px',
    },
  },
}));

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
    const confirmLogout = window.confirm("¿Estás seguro de que deseas cerrar sesión?");
    if (confirmLogout) {
      logout();
    }
  };

  return (
    <CustomizedAppBar position="fixed" {...props}>
      <Box display="flex" justifyContent="space-between" alignItems="center" height="100%" px={2}>
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
    </CustomizedAppBar>
  );
};

export const Layout = ({ children, ...props }: LayoutProps) => (
  <CustomizedLayout {...props} appBar={CustomAppBar}>
    {children}
  </CustomizedLayout>
);