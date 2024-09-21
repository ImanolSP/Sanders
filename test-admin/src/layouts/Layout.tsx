// Layout.tsx
import React from "react";
import { Button, ButtonProps } from "@mui/material";
import { Layout as RALayout, LayoutProps } from "react-admin";
import { styled } from "@mui/material/styles";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

const CustomizedLayout = styled(RALayout)(({ theme }) => ({
  "& .RaLayout-contentWithSidebar": {
    display: "flex",
    height: "100vh", // Asegura que el contenido con el Sidebar ocupe toda la altura de la ventana
    marginTop: "64px",
    [theme.breakpoints.up("sm")]: {
      marginTop: "1px",
    },
  },
  "& .RaLayout-content": {
    flexGrow: 1,
    height: "100vh", // Asegura que el contenido principal ocupe toda la altura disponible
    overflow: "auto",
  },
  "& .RaLayout-appFrame": {
    marginTop: 0,
  },
}));

// Layout Button Component
export const LayoutButton = (props: ButtonProps) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Button
      {...props}
      variant="contained"
      sx={{
        color: colors.greenAccent[900],
        backgroundColor: colors.blueAccent[100],
        "&:hover": {
          backgroundColor: colors.redAccent[400],
        },
        padding: "10px 20px",
        borderRadius: "8px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      {props.children}
    </Button>
  );
};

const Layout = (props: LayoutProps) => (
  <CustomizedLayout {...props} appBar={Topbar} sidebar={Sidebar} />
);

export default Layout;
