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
  TopToolbar,
  useListContext,
  ListProps,
} from "react-admin";
import { tokens } from "../../theme";
import { Button, useTheme, useMediaQuery, Theme } from "@mui/material";
import { exportData } from "../../componentes/Export"; // Importamos la función de exportación
import { LayoutButton } from "../../layouts/Layout"; // Importamos el LayoutButton
// Material-UI Icons
import DescriptionIcon from '@mui/icons-material/Description'; // For Excel
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'; // For PDF
import GridOnIcon from '@mui/icons-material/GridOn'; // For CSV

// Toolbar personalizada para exportar datos
const ListActions = () => {
  const { data } = useListContext(); // Utilizamos el contexto para acceder a los datos de la lista

  const handleExport = (format: "xlsx" | "pdf" | "csv") => {
    if (data && data.length > 0) {
      exportData(data, format);
    } else {
      console.error("No hay datos para exportar.");
    }
  };

  return (
    <TopToolbar>
      <LayoutButton onClick={() => handleExport('xlsx')} startIcon={<DescriptionIcon />}>
        Excel
      </LayoutButton>
      <LayoutButton onClick={() => handleExport('pdf')} startIcon={<PictureAsPdfIcon />}>
        PDF
      </LayoutButton>
      <LayoutButton onClick={() => handleExport('csv')} startIcon={<GridOnIcon />}>
        CSV
      </LayoutButton>
    </TopToolbar>
  );
};

export const UserList = (props: ListProps) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  return (
    <List {...props} actions={<ListActions />} exporter={false}>
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