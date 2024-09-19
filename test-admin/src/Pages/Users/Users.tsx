// src/Pages/Users/Users.tsx
import {
    List,
    Datagrid,
    TextField,
    TextInput,
    SimpleList,
    EditButton,
    Edit,
    Create,
    SimpleForm,
    required,
    NumberInput,
    DeleteButton,
  } from "react-admin";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import { useMediaQuery, Theme } from "@mui/material";
  
export const UserList = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
  
    return (
      <List>
        {isSmall ? (
          <SimpleList
            primaryText={(record) => record.usuario}
            secondaryText={(record) => `Nivel de Acceso: ${record.nivel_acceso}`}
            sx={{
              "& .RaSimpleList-primaryText": {
                fontSize: "18px", // Aumenta el tamaño de la letra
              },
              "& .RaSimpleList-secondaryText": {
                fontSize: "16px",
              },
            }}
          />
        ) : (
          <Datagrid
            rowClick="edit"
            sx={{
              "& .RaDatagrid-row": {
                fontSize: "30px", // Aumenta el tamaño de la letra
                height: "60px", // Aumenta la altura de las filas
              },
            }}
          >
            <TextField source="usuario" />
            <TextField source="nivel_acceso" />
            <EditButton
              sx={{
                color: colors.greenAccent[500],
                "&:hover": {
                  color: colors.greenAccent[100],
                },
              }}
            />
            <DeleteButton />
          </Datagrid>
        )}
      </List>
    );
  };
  
  export const UserEdit = () => (
    <Edit>
      <SimpleForm>
        <TextInput source="usuario" disabled />
        <TextInput source="contraseña" type="password" disabled />
        <NumberInput source="nivel_acceso" validate={required()} />
      </SimpleForm>
    </Edit>
  );
  
  export const UserCreate = () => (
    <Create>
      <SimpleForm>
        <TextInput source="usuario" />
        <TextInput source="contraseña" type="password" />
        <NumberInput source="nivel_acceso" />
      </SimpleForm>
    </Create>
  );

