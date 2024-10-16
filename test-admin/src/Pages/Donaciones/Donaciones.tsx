// src/Pages/Donaciones/Donaciones.tsx

import React from "react";
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
  useRedirect,
  useNotify,
  SelectInput,
  DateInput,
  RaRecord,
  Identifier,
} from "react-admin";
import { Button } from "@mui/material";
import { exportData } from "../../componentes/Export"; // Importamos la función
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import { useMediaQuery, Theme } from "@mui/material";
import { LayoutButton } from "../../layouts/Layout";

// Material-UI Icons
import DescriptionIcon from "@mui/icons-material/Description"; // For Excel
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"; // For PDF
import GridOnIcon from "@mui/icons-material/GridOn"; // For CSV
import AddIcon from "@mui/icons-material/Add"; // For Create

interface Donador {
  nombre?: string;
  apellido?: string;
  email?: string;
}

interface DonacionRecord extends RaRecord {
  // 'id' is inherited from RaRecord and is required
  monto: number;
  fecha: string;
  donador?: Donador;
  editado?: boolean;
  metodo?: string;
}

export const DonadoresList = (props: ListProps) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  // Custom Toolbar for Export functionality
  const ListActions = () => {
    const { data } = useListContext<DonacionRecord>();
    const redirect = useRedirect();
    const notify = useNotify();

    const handleExport = (format: "xlsx" | "pdf" | "csv") => {
      if (data && data.length > 0) {
        exportData(data, format);
        notify(`Exportando datos a formato ${format.toUpperCase()}`, { type: "info" });
      } else {
        console.error("No hay datos para exportar.");
        notify("No hay datos para exportar.", { type: "warning" });
      }
    };

    return (
      <TopToolbar>
        <LayoutButton
          onClick={() => redirect("/donaciones/create")}
          startIcon={<AddIcon />}
          sx={{ margin: "5px" }}
        >
          Crear
        </LayoutButton>
        <LayoutButton
          onClick={() => handleExport("xlsx")}
          startIcon={<DescriptionIcon />}
          sx={{ margin: "5px" }}
        >
          Excel
        </LayoutButton>
        <LayoutButton
          onClick={() => handleExport("pdf")}
          startIcon={<PictureAsPdfIcon />}
          sx={{ margin: "5px" }}
        >
          PDF
        </LayoutButton>
        <LayoutButton
          onClick={() => handleExport("csv")}
          startIcon={<GridOnIcon />}
          sx={{ margin: "5px" }}
        >
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
          secondaryText={(record) =>
            `Donador: ${record.donador?.nombre} ${record.donador?.apellido}`
          }
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
            backgroundColor: colors.primary[400],
            "& .RaDatagrid-row": {
              fontSize: "30px", // Aumenta el tamaño de la letra
              height: "60px", // Aumenta la altura de las filas
            },
          }}
        >
          <NumberField
            source="monto"
            options={{ style: "currency", currency: "MXN" }}
          />
          <DateField source="fecha" />
          <TextField
            source="donador.nombre"
            label="Nombre del Donador"
            emptyText="-"
          />
          <TextField
            source="donador.apellido"
            label="Apellido del Donador"
            emptyText="-"
          />
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

export const DonadoresCreate = () => (
  <Create
    transform={(data: Omit<DonacionRecord, 'id'>) => ({
      ...data,
      editado: false,
      metodo: "manual",
      fecha: new Date().toISOString().split("T")[0], // Format as "YYYY-MM-DD"
    })}
  >
    <SimpleForm>
      <NumberInput source="monto" label="Monto" />
      <TextInput source="donador.nombre" label="Nombre del Donador" />
      <TextInput source="donador.apellido" label="Apellido del Donador" />
      <TextInput source="donador.email" label="Email del Donador" />
    </SimpleForm>
  </Create>
);

export const DonadoresEdit = () => (
  <Edit
    transform={(data: DonacionRecord) => ({
      ...data,
      editado: true,
    })}
  >
    <SimpleForm>
      <NumberInput source="monto" label="Monto" />
      <DateInput source="fecha" label="Fecha" disabled />
      <TextInput source="donador.nombre" label="Nombre del Donador" />
      <TextInput source="donador.apellido" label="Apellido del Donador" />
      <TextInput source="donador.email" label="Email del Donador" />
      <SelectInput
        source="metodo"
        label="Método"
        choices={[
          { id: "manual", name: "Manual" },
          { id: "online", name: "Online" },
        ]}
        disabled
      />
      {/* 'editado' is set to true via transform and not displayed */}
    </SimpleForm>
  </Edit>
);