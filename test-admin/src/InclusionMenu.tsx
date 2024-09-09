import { useState, useEffect } from "react";
import { Box, Slider, Typography } from "@mui/material";

export const InclusionMenu = () => {
  const [fontSize, setFontSize] = useState<number>(14);

  // Leer configuraciones desde localStorage al montar el componente
  useEffect(() => {
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
      setFontSize(Number(savedFontSize));
      document.documentElement.style.fontSize = `${Number(savedFontSize)}px`;
    }
  }, []);

  // Aplicar configuraciones al cambiar
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
    localStorage.setItem('fontSize', fontSize.toString());
  }, [fontSize]);

  const handleFontSizeChange = (event: any, newValue: number | number[]) => {
    setFontSize(newValue as number);
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
    </Box>
  );
};
