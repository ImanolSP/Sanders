// App.tsx
import React from 'react';
import { Admin, Resource } from 'react-admin';
import { useMode, ColorModeContext } from './theme';
import Layout from './layouts/Layout';
import { UserCreate, UserEdit, UserList } from './Pages/Users/Users';
import { DonadoresList, DonadoresCreate, DonadoresEdit } from './Pages/Donaciones/Donaciones';
import { authProvider } from './providers/authProvider';
import { Dashboard } from './Pages/Dashboard/Dashboard';
import PostIcon from "@mui/icons-material/MonetizationOnOutlined";
import UserIcon from "@mui/icons-material/PeopleOutlined";
import { MyLoginPage } from "./LogIn";
import { basedatos } from "./providers/dataprovider";
import { i18nProvider } from "./providers/i18nProvider";
import { ProSidebarProvider } from 'react-pro-sidebar';

export const App = () => {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ProSidebarProvider>
      <Admin
        loginPage={MyLoginPage}
        authProvider={authProvider}
        i18nProvider={i18nProvider}
        layout={Layout}
        dashboard={Dashboard}
        dataProvider={basedatos}
        theme={theme}
      >
        <Resource
          name="usuarios"
          list={UserList}
          edit={UserEdit}
          create={UserCreate}
          icon={UserIcon}
        />
        <Resource
          name="donaciones"
          list={DonadoresList}
          edit={DonadoresEdit}
          create={DonadoresCreate}
          icon={PostIcon}
        />
        {/* Otros recursos si los hay */}
      </Admin>
      </ProSidebarProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
