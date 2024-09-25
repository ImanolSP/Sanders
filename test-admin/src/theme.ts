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
          100: "#e0e0e0", //Ciertas palabras del menu 
          200: "#F80000",
          300: "#888888", // Palabra Management 
          400: "#F80000",
          500: "#F80000",
          600: "#F80000",
          700: "#F80000",
          800: "#F80000",
          900: "#F80000",
        },
        primary: {
          100: "#F80000",
          200: "#F80000",
          300: "#F80000",
          400: "#1D1E33", // Barra lateral y superior del menu y fondos de usuarios y donaciones 
          500: "#20214F", // Fondo detras y botones de las graficas 
          600: "#F80000",
          700: "#F80000",
          800: "#F80000",
          900: "#F80000",
        },
        greenAccent: {
          100: "#FFFFFF", // Colores boton edit si pasa por encima 
          200: "#F80000",
          300: "#F80000",
          400: "#F80000",
          500: "#84C3BE", // Texto "Water..." y texto "Dashboard"  y texto "Edit" 4cceac
          600: "#F80000",
          700: "#F80000",
          800: "#F80000",
          900: "#0f2922", // Color texto botones excel, csv, pdf 
        },
        redAccent: {
          100: "#F80000",
          200: "#F80000",
          300: "#F80000",
          400: "#e2726e", // Colores botones excel, csv, pdf cuando pasas por encima 
          500: "#db4f4a", // Colores botones menus cuando pasas por encima 
          600: "#F80000",
          700: "#F80000",
          800: "#F80000",
          900: "#F80000",
        },
        blueAccent: {
          100: "#FFFFFF", //Botones Excel, CSV, PDF 
          200: "#F80000",
          300: "#F80000",
          400: "#F80000",
          500: "#F80000",
          600: "#F80000",
          700: "#F80000",
          800: "#F80000",
          900: "#F80000",
        },
      }
    : {
        grey: {
          100: "#102C54", // Texto menu 
          200: "#F80000",
          300: "#1E1E1E", // Texto Management Menu 
          400: "#F80000",
          500: "#F80000",
          600: "#F80000",
          700: "#F80000",
          800: "#F80000",
          900: "#F80000",
        },

        // Paleta de colores para el modo claro
        primary: {
          100: "#102C54", //Botones de VIEW
          200: "#F80000",
          300: "#F80000",
          400: "#f2f0f0", // Fondos menus laterales y superiores
          500: "#F80000",
          600: "#F80000",
          700: "#F80000",
          800: "#F80000",
          900: "#F80000",
        },
        greenAccent: {
          100: "#4cceac", // Colores boton edit si pasa por encima
          200: "#F80000",
          300: "#F80000",
          400: "#F80000",
          500: "#4cceac", // Texto "Water..." y texto "Dashboard"  y texto "Edit"
          600: "#F80000",
          700: "#F80000",
          800: "#F80000",
          900: "#dbf5ee", // Colores texto botones excel, csv, pdf
        },
        redAccent: {
          100: "#F80000",
          200: "#F80000",
          300: "#F80000",
          400: "#F80000",
          500: "#db4f4a", // Color botones menus cuando pasas por encima
          600: "#F80000",
          700: "#F80000",
          800: "#F80000",
          900: "#F80000", 
        },
        blueAccent: {
          100: "#151632", //Botones Excel, CSV, PDF
          200: "#F80000",
          300: "#F80000",
          400: "#F80000",
          500: "#F80000",
          600: "#F80000",
          700: "#F80000",
          800: "#F80000",
          900: "#F80000",
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