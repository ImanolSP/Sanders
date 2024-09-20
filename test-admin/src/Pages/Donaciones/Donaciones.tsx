import React from 'react';
import {
  List,
  Datagrid,
  SimpleList,
  DateField,
  TextField,
  NumberField,
  EditButton,
  Edit,
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  DeleteButton,
  TopToolbar,
  useListContext,
  ListProps,
  DateInput
} from 'react-admin';
import { Button } from "@mui/material";
import { exportData } from "../../componentes/Export"; // Importamos la función
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import { useMediaQuery, Theme } from "@mui/material";
import { LayoutButton } from '../../layouts/Layout'; 

// Material-UI Icons
import DescriptionIcon from '@mui/icons-material/Description'; // For Excel
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'; // For PDF
import GridOnIcon from '@mui/icons-material/GridOn'; // For CSV

interface Donador {
  nombre?: string;
  apellido?: string;
  email?: string;
}

interface DonacionRecord {
  id: string;
  monto: number;
  fecha: string;
  donador?: Donador;
}

export const DonadoresList = (props: ListProps) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  // Custom Toolbar for Export functionality
  const ListActions = () => {
    const { data } = useListContext<DonacionRecord>(); // Ahora usamos useListContext dentro del contexto correcto

    const handleExport = (format: 'xlsx' | 'pdf' | 'csv') => {
      if (data && data.length > 0) {
        exportData(data, format);
      } else {
        console.error('No hay datos para exportar.');
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

  return (
    <List
      {...props}
      actions={<ListActions />}
      exporter={false} // Deshabilitamos el exportador predeterminado
    >
      {isSmall ? (
        <SimpleList
          primaryText={(record) => `Monto: $${record.monto}`}
          secondaryText={(record) => `Donador: ${record.donador?.nombre} ${record.donador?.apellido}`}
          tertiaryText={(record) => `Fecha: ${record.fecha}`}
          sx={{
            "& .RaSimpleList-primaryText": {
              fontSize: "18px", // Aumenta el tamaño de la letra
            },
            "& .RaSimpleList-secondaryText": {
              fontSize: "16px",
            },
            "& .RaSimpleList-tertiaryText": {
              fontSize: "14px",
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
          <NumberField source="monto" options={{ style: 'currency', currency: 'USD' }} />
          <DateField source="fecha" />
          <TextField source="donador.nombre" label="Nombre del Donador" emptyText="-" />
          <TextField source="donador.apellido" label="Apellido del Donador" emptyText="-" />
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

export const DonadoresEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="donador.nombre" label="Nombre del Donador" />
      <NumberInput source="monto" />
      <TextInput source="donador.apellido" label="Apellido del Donador" />
      <TextInput source="donador.email" label="Email del Donador" />
    </SimpleForm>
  </Edit>
);

export const DonadoresCreate = () => (
  <Create>
    <SimpleForm>
      <NumberInput source="monto" />
      <DateInput source="fecha" />
      <TextInput source="donador.nombre" label="Nombre del Donador" />
      <TextInput source="donador.apellido" label="Apellido del Donador" />
    </SimpleForm>
  </Create>
);