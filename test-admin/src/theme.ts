import { createContext, useState, useMemo } from "react";
import { createTheme, Theme, PaletteMode } from "@mui/material";
import { ThemeOptions } from "@mui/material/styles";

// Definimos una interfaz para los tokens de color
interface ColorTokens {
  grey: Record<number, string>;
  primary: Record<number, string>;
  greenAccent: Record<number, string>;
  redAccent: Record<number, string>;
  blueAccent: Record<number, string>;
}

// Función para obtener los tokens de color según el modo
export const tokens = (mode: PaletteMode): ColorTokens => ({
  ...(mode === "dark"
    ? {
        // Paleta de colores para el modo oscuro
        grey: {
          100: "#e0e0e0", // Ciertas palabras del menu 
          200: "#c2c2c2",
          300: "#888888", // Palabra Management 
          400: "#858585",
          500: "#666666",
          600: "#525252",
          700: "#3d3d3d",
          800: "#292929",
          900: "#141414",
        },
        primary: {
          100: "#d0d1d5",
          200: "#a1a4ab",
          300: "#727681",
          400: "#1D1E33", // Barra lateral y superior del menu y fondos de usuarios y donaciones 
          500: "#20214F", // Fondo detras y botones de las graficas 
          600: "#101624",
          700: "#0c101b",
          800: "#080b12",
          900: "#040509",
        },
        greenAccent: {
          100: "#FFFFFF", // Colores boton edit si pasa por encima 
          200: "#b7ebde",
          300: "#94e2cd",
          400: "#70d8bd",
          500: "#84C3BE", // Texto "Water..." y texto "Dashboard"  y texto "Edit"
          600: "#3da58a",
          700: "#2e7c67",
          800: "#1e5245",
          900: "#0f2922", // Color texto botones excel, csv, pdf 
        },
        redAccent: {
          100: "#f8dcdb",
          200: "#f1b9b7",
          300: "#e99592",
          400: "#e2726e", // Colores botones excel, csv, pdf cuando pasas por encima 
          500: "#db4f4a", // Colores botones menus cuando pasas por encima 
          600: "#af3f3b",
          700: "#832f2c",
          800: "#58201e",
          900: "#2c100f",
        },
        blueAccent: {
          100: "#FFFFFF", // Botones Excel, CSV, PDF 
          200: "#c3c6fd",
          300: "#a4a9fc",
          400: "#868dfb",
          500: "#6870fa",
          600: "#535ac8",
          700: "#3e4396",
          800: "#2a2d64",
          900: "#151632",
        },
      }
    : {
        grey: {
          100: "#102C54", // Texto menu 
          200: "#292929",
          300: "#1E1E1E", // Texto Management Menu 
          400: "#525252",
          500: "#666666",
          600: "#858585",
          700: "#a3a3a3",
          800: "#c2c2c2",
          900: "#e0e0e0",
        },

        // Paleta de colores para el modo claro
        primary: {
          100: "#102C54", // Botones de VIEW
          200: "#080b12",
          300: "#0c101b",
          400: "#f2f0f0", // Fondos menus laterales y superiores
          500: "#141b2d",
          600: "#1F2A40",
          700: "#727681",
          800: "#a1a4ab",
          900: "#d0d1d5",
        },
        greenAccent: {
          100: "#4cceac", // Colores boton edit si pasa por encima
          200: "#1e5245",
          300: "#2e7c67",
          400: "#3da58a",
          500: "#4cceac", // Texto "Water..." y texto "Dashboard"  y texto "Edit"
          600: "#70d8bd",
          700: "#94e2cd",
          800: "#b7ebde",
          900: "#dbf5ee", // Colores texto botones excel, csv, pdf
        },
        redAccent: {
          100: "#2c100f",
          200: "#58201e",
          300: "#832f2c",
          400: "#af3f3b",
          500: "#db4f4a", // Color botones menus cuando pasas por encima
          600: "#e2726e",
          700: "#e99592",
          800: "#f1b9b7",
          900: "#f8dcdb", 
        },
        blueAccent: {
          100: "#151632", // Botones Excel, CSV, PDF
          200: "#2a2d64",
          300: "#3e4396",
          400: "#535ac8",
          500: "#6870fa",
          600: "#868dfb",
          700: "#a4a9fc",
          800: "#c3c6fd",
          900: "#e1e2fe",
        },
      }),
});


export const ColorModeContext = createContext<{ toggleColorMode: () => void }>({
  toggleColorMode: () => {},
});

export const useMode = (): [Theme, { toggleColorMode: () => void }] => {
  const [mode, setMode] = useState<PaletteMode>("dark"); // 'dark' o 'light'

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) =>
          prevMode === "light" ? "dark" : "light"
        );
      },
    }),
    []
  );

  const theme = useMemo(() => {
    // Obtenemos los tokens de color según el modo
    const colors = tokens(mode);

    // Creamos el tema utilizando los tokens
    const themeOptions: ThemeOptions = {
      palette: {
        mode,
        ...(mode === "dark"
          ? {
              // Paleta para el modo oscuro
              primary: {
                main: colors.primary[500],
              },
              secondary: {
                main: colors.greenAccent[500],
              },
              neutral: {
                dark: colors.grey[700],
                main: colors.grey[500],
                light: colors.grey[100],
              },
              background: {
                default: colors.primary[500],
              },
            }
          : {
              // Paleta para el modo claro
              primary: {
                main: colors.primary[100],
              },
              secondary: {
                main: colors.greenAccent[500],
              },
              neutral: {
                dark: colors.grey[700],
                main: colors.grey[500],
                light: colors.grey[100],
              },
              background: {
                default: "#fcfcfc",
              },
            }),
      },
      typography: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 14,
        h1: {
          fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
          fontSize: 40,
        },
        h2: {
          fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
          fontSize: 32,
        },
        h3: {
          fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
          fontSize: 24,
        },
        h4: {
          fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
          fontSize: 20,
        },
        h5: {
          fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
          fontSize: 16,
        },
        h6: {
          fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
          fontSize: 14,
        },
      },
    };

    return createTheme(themeOptions);
  }, [mode]);

  return [theme, colorMode];
};