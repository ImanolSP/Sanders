// Layout.tsx

import React from 'react';
import { Layout as RALayout, LayoutProps } from 'react-admin';
import { styled } from '@mui/material/styles';
import Topbar from './Topbar';
import Sidebar from './Sidebar';

const CustomizedLayout = styled(RALayout)(({ theme }) => ({
  '& .RaLayout-contentWithSidebar': {
    display: 'flex',
    height: '100vh', // Asegura que el contenido con el Sidebar ocupe toda la altura de la ventana
    marginTop: '64px',
    [theme.breakpoints.up('sm')]: {
      marginTop: '72px',
    },
  },
  '& .RaLayout-content': {
    flexGrow: 1,
    height: '100vh', // Asegura que el contenido principal ocupe toda la altura disponible
    overflow: 'auto',
  },
  '& .RaLayout-appFrame': {
    marginTop: 0,
  },
}));

const Layout = (props: LayoutProps) => (
  <CustomizedLayout
    {...props}
    appBar={Topbar}
    sidebar={Sidebar}
  />
);

export default Layout;