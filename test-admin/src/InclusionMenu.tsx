import React, { useState, useEffect, useCallback } from "react";
import { Box, Slider, Typography, Switch, FormControlLabel } from "@mui/material";
import { useStore } from "react-admin";

export const InclusionMenu = () => {
  const [fontSize, setFontSize] = useState<number>(14);
  const [theme, setTheme] = useStore('theme', 'light');

  const isDarkMode = theme === 'dark';

  useEffect(() => {
    const savedFontSize = localStorage.getItem('fontSize');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedFontSize) {
      setFontSize(Number(savedFontSize));
      document.documentElement.style.fontSize = `${Number(savedFontSize)}px`;
    }
    
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, [setTheme]);

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
    </Box>
  );
};