import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Slider,
  Box,
  Switch,
  FormControlLabel,
  Select,
  SelectChangeEvent,
  useTheme,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import RefreshIcon from "@mui/icons-material/Refresh";
import LogoutIcon from "@mui/icons-material/Logout";
import { useLogout, useStore } from "react-admin";

const Topbar = () => {
  const logout = useLogout();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);

  // Inclusion Menu states
  const [fontSize, setFontSize] = useState<number>(14);
  const [themeMode, setThemeMode] = useStore('theme', 'light');
  const [language, setLanguage] = useStore('locale', 'en');
  
  const isDarkMode = themeMode === 'dark';

  // Funciones de inclusión
  useEffect(() => {
    const savedFontSize = localStorage.getItem('fontSize');
    const savedTheme = localStorage.getItem('theme');
    const savedLanguage = localStorage.getItem('language');

    if (savedFontSize) {
      setFontSize(Number(savedFontSize));
      document.documentElement.style.fontSize = `${Number(savedFontSize)}px`;
    }

    if (savedTheme) {
      setThemeMode(savedTheme);
    }

    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, [setThemeMode, setLanguage]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
    localStorage.setItem('fontSize', fontSize.toString());
  }, [fontSize]);

  const handleFontSizeChange = (event: Event, newValue: number | number[]) => {
    setFontSize(newValue as number);
  };

  const handleThemeToggle = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newTheme = event.target.checked ? 'dark' : 'light';
    setThemeMode(newTheme);
    localStorage.setItem('theme', newTheme);
  }, [setThemeMode]);

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    window.location.reload(); // Refresh to apply new language
  };

  // Functions for AppBar
  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "¿Estás seguro de que deseas cerrar sesión?"
    );
    if (confirmLogout) {
      logout();
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          color="inherit"
          sx={{ flexGrow: 1 }}
        >
          CRM
        </Typography>
        
        {/* Refresh button */}
        <IconButton
          color="inherit"
          onClick={() => window.location.reload()}
        >
          <RefreshIcon />
        </IconButton>

        {/* Settings button */}
        <IconButton
          color="inherit"
          onClick={handleSettingsClick}
        >
          <SettingsIcon />
        </IconButton>

        {/* Logout button */}
        <IconButton
          color="inherit"
          onClick={handleLogout}
        >
          <LogoutIcon />
        </IconButton>

        {/* Inclusion Menu in the dropdown */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <Box p={2} sx={{ width: 300 }}>
            <Typography gutterBottom>Tamaño de Letra</Typography>
            <Slider
              value={fontSize}
              onChange={handleFontSizeChange}
              aria-labelledby="font-size-slider"
              min={12}
              max={24}
              valueLabelDisplay="auto"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={isDarkMode}
                  onChange={handleThemeToggle}
                  name="themeToggle"
                />
              }
              label="Modo Oscuro"
            />

            <Typography gutterBottom>Idioma</Typography>
            <Select
              value={language}
              onChange={handleLanguageChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Idioma' }}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="es">Español</MenuItem>
            </Select>
          </Box>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
