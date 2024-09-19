// src/Pages/Donaciones/Donaciones.tsx

import React from "react";
import {
  List,
  Datagrid,
  DateInput,
  TextField,
  TextInput,
  EditButton,
  Edit,
  Create,
  SimpleForm,
  NumberInput,
  DeleteButton,
  ExportButton,
  TopToolbar,
  useListContext,
  ListProps,
  Identifier,
  useDataProvider,
  DataProvider,
} from "react-admin";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import { Button } from "@mui/material";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import 'jspdf-autotable';

interface Donador {
  nombre?: string;
  apellido?: string;
  email?: string;
}

interface DonacionRecord {
  id: Identifier;
  monto: number;
  fecha: string;
  donador?: Donador;
}

interface jsPDFWithPlugin extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

export const DonadoresList = (props: ListProps) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dataProvider = useDataProvider();

  // Funciones de exportación
  const exporter = async (records: DonacionRecord[]) => {
    // Exportar a Excel
    const data = records.map((record) => ({
      Monto: record.monto,
      Fecha: record.fecha,
      "Nombre del Donador": record.donador?.nombre || "",
      "Apellido del Donador": record.donador?.apellido || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = { Sheets: { Donaciones: worksheet }, SheetNames: ["Donaciones"] };
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, "donaciones.xlsx");
  };

  // Función para exportar a PDF
  const exporterPDF = (records: DonacionRecord[]) => {
    const doc = new jsPDF() as jsPDFWithPlugin;

    const tableColumn = ["Monto", "Fecha", "Nombre del Donador", "Apellido del Donador"];
    const tableRows: (string | number)[][] = [];

    records.forEach((record: DonacionRecord) => {
      const rowData = [
        record.monto,
        record.fecha,
        record.donador?.nombre || "",
        record.donador?.apellido || "",
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("donaciones.pdf");
  };

  // Componente de acciones personalizado
  const ListActions = () => {
    const { filterValues, resource } = useListContext<DonacionRecord>();

    const handleExportExcel = () => {
      dataProvider
        .getList<DonacionRecord>(resource, {
          pagination: { page: 1, perPage: 1000 },
          sort: { field: "id", order: "ASC" },
          filter: filterValues,
        })
        .then(({ data }) => {
          exporter(data);
        });
    };

    const handleExportPDF = () => {
      dataProvider
        .getList<DonacionRecord>(resource, {
          pagination: { page: 1, perPage: 1000 },
          sort: { field: "id", order: "ASC" },
          filter: filterValues,
        })
        .then(({ data }) => {
          exporterPDF(data);
        });
    };

    return (
      <TopToolbar>
        <ExportButton />
        <Button onClick={handleExportExcel} color="primary" sx={{ marginLeft: 2 }}>
          Exportar a Excel
        </Button>
        <Button onClick={handleExportPDF} color="primary" sx={{ marginLeft: 2 }}>
          Exportar a PDF
        </Button>
      </TopToolbar>
    );
  };

  return (
    <List
      {...props}
      exporter={false}
      actions={<ListActions />}
      sx={{
        "& .MuiTypography-root": {
          fontSize: "16px",
        },
      }}
    >
      <Datagrid
        rowClick="edit"
        sx={{
          "& .RaDatagrid-row": {
            fontSize: "16px",
            height: "60px",
          },
          "& .MuiTableCell-root": {
            fontSize: "16px",
          },
          "& .MuiSvgIcon-root": {
            fontSize: "1.5rem",
          },
        }}
      >
        <TextField source="monto" />
        <TextField source="fecha" />
        <TextField source="donador.nombre" label="Nombre del Donador" />
        <TextField source="donador.apellido" label="Apellido del Donador" />
        <EditButton
          sx={{
            color: colors.greenAccent[500],
            "&:hover": {
              color: colors.greenAccent[300],
            },
          }}
        />
        <DeleteButton />
      </Datagrid>
    </List>
  );
};

export const DonadoresEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="donador.nombre" label="Nombre del Donador" />
      <TextInput source="monto" />
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
      <TextInput source="donador.email" label="Email del Donador" />
    </SimpleForm>
  </Create>
);