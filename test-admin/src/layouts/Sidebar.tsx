// src/layouts/Sidebar.tsx

import React from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import { Sidebar, Menu, MenuItem, useProSidebar } from "react-pro-sidebar";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { tokens } from "../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import sandersLogo from "../image/sanders.png";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"; // Import the calendar icon

const SidebarComponent: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { collapseSidebar, collapsed } = useProSidebar();
  const location = useLocation();

  const menuItemStyles = {
    button: ({ active }: { active: boolean }) => ({
      color: active ? colors.greenAccent[500] : colors.grey[100],
      backgroundColor: "transparent !important",
      "&:hover": {
        color: colors.redAccent[500],
        backgroundColor: "transparent !important",
        textDecoration: "none !important",
        transform: "scale(1.05)",
        transition: "transform 0.2s",
      },
      fontWeight: active ? "bold" : "normal",
    }),
    icon: ({ active }: { active: boolean }) => ({
      color: active ? colors.greenAccent[500] : colors.grey[100],
      "&:hover": {
        color: colors.redAccent[500],
        transform: "scale(1.2)",
        transition: "transform 0.2s",
      },
    }),
    label: ({ active }: { active: boolean }) => ({
      color: active ? colors.greenAccent[500] : colors.grey[100],
      "&:hover": {
        color: colors.redAccent[500],
        transform: "scale(1.1)",
        transition: "transform 0.2s",
        textDecoration: "none !important",
      },
    }),
  };

  return (
    <Box
      sx={{
        height: "100vh",
        "& .ps-sidebar-container": {
          backgroundColor: `${colors.primary[400]} !important`,
        },
        "& .ps-menuitem-root": {
          padding: collapsed
            ? "10px 0 !important"
            : "5px 35px 5px 20px !important",
          justifyContent: collapsed ? "center" : "flex-start",
        },
      }}
    >
      <Sidebar>
        <Menu menuItemStyles={menuItemStyles}>
          {/* Collapse Button */}
          <MenuItem
            onClick={() => collapseSidebar()}
            icon={<MenuOutlinedIcon />}
            style={{ margin: "10px 0 20px 0", color: colors.grey[100] }}
          >
            {!collapsed && (
              <Typography
                variant="h3"
                color={colors.grey[100]}
                ml="15px"
                sx={{ userSelect: "none" }}
              >
                ADMIN
              </Typography>
            )}
          </MenuItem>

          {/* User Information */}
          {!collapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  src={sandersLogo}
                  alt="Logo de la Fundación Sanders"
                  width="100px"
                  height="100px"
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ mt: 2 }}
                >
                  Fundación Sanders
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  Water to where it is needed
                </Typography>
              </Box>
            </Box>
          )}

          {/* Menu */}
          <Box paddingLeft={collapsed ? undefined : "10%"}>
            <MenuItem
              component={<RouterLink to="/" />}
              icon={<HomeOutlinedIcon />}
              active={location.pathname === "/"}
            >
              Dashboard
            </MenuItem>

            {/* Management Section */}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Management
            </Typography>

            <MenuItem
              component={<RouterLink to="/usuarios" />}
              icon={<PeopleOutlinedIcon />}
              active={location.pathname === "/usuarios"}
            >
              Usuarios
            </MenuItem>

            <MenuItem
              component={<RouterLink to="/donaciones" />}
              icon={<MonetizationOnOutlinedIcon />}
              active={location.pathname === "/donaciones"}
            >
              Donaciones
            </MenuItem>

            <MenuItem
              component={<RouterLink to="/projects" />}
              icon={<WorkOutlineIcon />}
              active={location.pathname === "/projects"}
            >
              Proyectos
            </MenuItem>

            {/* Add the Calendar Menu Item */}
            <MenuItem
              component={<RouterLink to="/calendar" />}
              icon={<CalendarTodayIcon />}
              active={location.pathname === "/calendar"}
            >
              Calendario
            </MenuItem>
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  );
};

export default SidebarComponent;
