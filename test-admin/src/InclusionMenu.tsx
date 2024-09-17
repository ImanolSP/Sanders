import React, { useState, useEffect, useCallback } from "react";
import { Box, Slider, Typography, Switch, FormControlLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useStore } from "react-admin";

export const InclusionMenu = () => {
  const [fontSize, setFontSize] = useState<number>(14);
  const [theme, setTheme] = useStore('theme', 'light');
  const [language, setLanguage] = useStore('locale', 'en'); // Add language state

  const isDarkMode = theme === 'dark';

  useEffect(() => {
    const savedFontSize = localStorage.getItem('fontSize');
    const savedTheme = localStorage.getItem('theme');
    const savedLanguage = localStorage.getItem('language');

    if (savedFontSize) {
      setFontSize(Number(savedFontSize));
      document.documentElement.style.fontSize = `${Number(savedFontSize)}px`;
    }

    if (savedTheme) {
      setTheme(savedTheme);
    }

    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, [setTheme, setLanguage]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
    localStorage.setItem('fontSize', fontSize.toString());
  }, [fontSize]);

  const handleFontSizeChange = (event: Event, newValue: number | number[]) => {
    setFontSize(newValue as number);
  };

  const handleThemeToggle = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newTheme = event.target.checked ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }, [setTheme]);

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    window.location.reload(); // Refresh to apply new language
  };

  return (
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
        {/* Add more languages as needed */}
      </Select>
    </Box>
  );
};
