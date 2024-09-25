import React, { useContext, useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Slider,
  Box,
  Select,
  SelectChangeEvent,
  useTheme,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import RefreshIcon from "@mui/icons-material/Refresh";
import LogoutIcon from "@mui/icons-material/Logout";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useLogout, useStore } from "react-admin";
import { ColorModeContext, tokens } from "../theme";

const Topbar = () => {
  const logout = useLogout();
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const colors = tokens(theme.palette.mode);

  // Estado para abrir/cerrar el menú desplegable
  const [anchorEl, setAnchorEl] = useState(null);
  const [fontSize, setFontSize] = useState<number>(14);
  const [language, setLanguage] = useStore('locale', 'en'); // Control de idioma

  useEffect(() => {
    const savedFontSize = localStorage.getItem('fontSize');
    const savedLanguage = localStorage.getItem('language');

    if (savedFontSize) {
      setFontSize(Number(savedFontSize));
      document.documentElement.style.fontSize = `${Number(savedFontSize)}px`;
    }

    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, [setLanguage]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
    localStorage.setItem('fontSize', fontSize.toString());
  }, [fontSize]);

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

  const handleFontSizeChange = (event, newValue) => {
    setFontSize(newValue);
  };

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    window.location.reload(); // Recargar para aplicar el nuevo idioma
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

        {/* Botón de refresh */}
        <IconButton
          color="inherit"
          sx={{ color: colors.grey[100] }}
          onClick={() => window.location.reload()}
        >
          <RefreshIcon />
        </IconButton>

        {/* Botón de configuraciones */}
        <IconButton
          color="inherit"
          sx={{ color: colors.grey[100] }}
          onClick={handleSettingsClick}
        >
          <SettingsIcon />
        </IconButton>

        {/* Menú desplegable */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >

          {/* Tamaño de letra */}
          <MenuItem>
            <Box sx={{ width: 200 }}>
              <Typography gutterBottom>Tamaño de Letra</Typography>
              <Slider
                value={fontSize}
                onChange={handleFontSizeChange}
                aria-labelledby="font-size-slider"
                min={12}
                max={24}
                valueLabelDisplay="auto"
              />
            </Box>
          </MenuItem>

          {/* Cambio de tema */}
          <MenuItem onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <>
                <Brightness7Icon sx={{ marginRight: '10px' }} /> Modo Claro
              </>
            ) : (
              <>
                <Brightness4Icon sx={{ marginRight: '10px' }} /> Modo Oscuro
              </>
            )}
          </MenuItem>

          {/* Cambio de idioma */}
          <MenuItem>
            <Box>
              <Typography gutterBottom>Idioma</Typography>
              <Select
                value={language}
                onChange={handleLanguageChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Idioma' }}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Español</MenuItem>
                {/* Agrega más idiomas según sea necesario */}
              </Select>
            </Box>
          </MenuItem>
        </Menu>

        {/* Botón de logout */}
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
