// App.tsx

import React, { useEffect,Fragment } from "react";
import { Admin, Resource, CustomRoutes } from "react-admin";
import { Route } from "react-router-dom";
import { useMode, ColorModeContext } from "./theme";
import Layout from "./layouts/Layout";
import { UserCreate, UserEdit, UserList } from "./Pages/Users/Users";
import {
  DonadoresList,
  DonadoresCreate,
  DonadoresEdit,
} from "./Pages/Donaciones/Donaciones";
import { authProvider } from "./providers/authProvider";
import { Dashboard } from "./Pages/Dashboard/Dashboard";
import PostIcon from "@mui/icons-material/MonetizationOnOutlined";
import UserIcon from "@mui/icons-material/PeopleOutlined";
import { MyLoginPage } from "./LogIn";
import { basedatos } from "./providers/dataprovider";
import { i18nProvider } from "./providers/i18nProvider";
import { ProSidebarProvider } from "react-pro-sidebar";
import { checkTokenExpiration } from "./CheckAuth/authUtils";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline"; // Icono para proyectos
import { ProjectList } from "./Pages/Projects/ProjectList";
import { ProjectShow } from "./Pages/Projects/ProjectShow";
import { ProjectCreate } from "./Pages/Projects/ProjectCreate";
import { ProjectEdit } from "./Pages/Projects/ProjectEdit";
import { CalendarPage } from "./Pages/Calendar/CalendarPage"; // Import CalendarPage

export const App = () => {
  const [theme, colorMode] = useMode();
  const NoAccess = () => <Fragment />;
  useEffect(() => {
    // Check token expiration when the component mounts
    checkTokenExpiration();
  }, []);

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
          {(permissions) => (
            <>
              {permissions === "admin" && (
                <Resource
                  name="usuarios"
                  list={UserList}
                  edit={UserEdit}
                  create={UserCreate}
                  icon={UserIcon}
                />
              )}
              <Resource
                name="donaciones"
                list={DonadoresList}
                edit={permissions === "admin" || permissions === "executive"  ? DonadoresEdit : NoAccess}
                create={permissions === "admin"|| permissions === "executive" ? DonadoresCreate: NoAccess}
                icon={PostIcon}
              />
              <Resource
                name="projects"
                list={ProjectList}
                show={ProjectShow}
                create={ProjectCreate}
                edit={ProjectEdit}
                icon={WorkOutlineIcon}
              />
              {/* Add the custom route for CalendarPage */}
              <CustomRoutes>
                <Route path="/calendar" element={<CalendarPage />} />
              </CustomRoutes>
            </>
          )}
        </Admin>
      </ProSidebarProvider>
    </ColorModeContext.Provider>
  );
};

export default App;