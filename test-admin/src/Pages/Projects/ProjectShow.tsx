// src/Pages/Projects/ProjectShow.tsx

import React, { useState } from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  DateField,
  useRecordContext,
  useNotify,
  useRefresh,
  useRedirect,
  useDataProvider,
  EditButton,
  DeleteButton,
} from "react-admin";
import { Typography, useTheme, Button, CardActions } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Project } from "../../interfaces/Project";
import { tokens } from "../../theme";

export const ProjectShow = (props: any) => (
  <Show {...props} actions={false}>
    <ProjectShowContent />
  </Show>
);

const ProjectShowContent = () => {
  const record = useRecordContext<Project>();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const notify = useNotify();
  const refresh = useRefresh();
  const redirect = useRedirect();
  const dataProvider = useDataProvider();
  const [displayMode, setDisplayMode] = useState<"value" | "percentage">(
    "value"
  );

  if (!record) return <div>Cargando...</div>;

  const handleChangeEstado = async () => {
    const newEstado =
      record.estado === "en progreso" ? "finalizado" : "en progreso";
    try {
      await dataProvider.update("projects", {
        id: record.id,
        data: { ...record, estado: newEstado },
        previousData: record,
      });
      notify("Estado actualizado correctamente", { type: "success" });
      refresh();
      redirect("/projects");
    } catch (error) {
      notify("Error al actualizar el estado", { type: "error" });
    }
  };

  // Determine if the project has reached full funding
  const isFullyFunded = record.donacionesRecibidas >= record.costoTotal;

  // Prepare data for the chart
  const data = [
    { name: "Cubierto", value: record.donacionesRecibidas },
    {
      name: "Faltante",
      value: Math.max(record.costoTotal - record.donacionesRecibidas, 0),
    },
  ];

  const totalValue = data.reduce((sum, entry) => sum + entry.value, 0);

  const colorsToUse = isFullyFunded
    ? // ? [colors.redAccent[500], colors.blueAccent[500]]
      [colors.blueAccent[500], colors.redAccent[500]]
    : // : [colors.greenAccent[500], colors.blueAccent[500]];
      [colors.greenAccent[500], colors.redAccent[500]];

  return (
    <SimpleShowLayout>
      <Typography
        variant="h1"
        sx={{ color: colors.grey[100], marginBottom: 2 }}
      >
        {record.nombre}
      </Typography>

      <TextField source="descripcion" label="Descripción" variant="h5" />
      <TextField source="estado" label="Estado" variant="h5" />
      <NumberField
        source="nivelUrgencia"
        label="Nivel de Urgencia"
        variant="h5"
      />
      <DateField source="fechaInicio" label="Fecha de Inicio" variant="h5" />
      <DateField
        source="fechaFinEstimada"
        label="Fecha de Fin Estimada"
        variant="h5"
      />
      <NumberField source="costoTotal" label="Costo Total" variant="h5" />
      <NumberField
        source="donacionesRecibidas"
        label="Donaciones Recibidas"
        variant="h5"
      />
      <NumberField
        source="porcentajeAsignado"
        label="Porcentaje Asignado de Donaciones"
        variant="h5"
      />
      <TextField source="ubicacion" label="Ubicación" variant="h5" />

      {/* Financing Distribution Chart */}
      <Typography variant="h3" sx={{ color: colors.grey[100], marginTop: 4 }}>
        Distribución de Financiamiento
      </Typography>

      <PieChart width={400} height={400}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={30}
          outerRadius={130}
          label={({ index, x, y, value }) => {
            const displayValue =
              displayMode === "value"
                ? Math.round(value)
                : `${((value / totalValue) * 100).toFixed(2)}%`;

            return (
              <text
                x={x}
                y={y}
                fill={colors.grey[100]}
                textAnchor="middle"
                dominantBaseline="central"
                style={{ fontSize: "14px" }}
              >
                {data[index].name}: {displayValue}
              </text>
            );
          }}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colorsToUse[index % colorsToUse.length]}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) =>
            displayMode === "value"
              ? Math.round(value)
              : `${((value / totalValue) * 100).toFixed(2)}%`
          }
          contentStyle={{
            backgroundColor: colors.primary[400],
            color: colors.grey[100],
            border: `2px solid ${colors.grey[100]}`,
          }}
        />
        <Legend
          formatter={(value) => (
            <span style={{ color: colors.grey[100] }}>{value}</span>
          )}
        />
      </PieChart>

      {/* Toggle Button for Value/Percentage */}
      <Button
        variant="contained"
        onClick={() =>
          setDisplayMode(displayMode === "value" ? "percentage" : "value")
        }
        sx={{
          marginTop: 2,
          backgroundColor: colors.primary[400],
          color: colors.grey[100],
          "&:hover": {
            backgroundColor: colors.redAccent[500],
          },
        }}
      >
        {`Mostrar en ${displayMode === "value" ? "Porcentajes" : "Valores"}`}
      </Button>

      {/* Button to change project status */}
      <Button
        variant="contained"
        onClick={handleChangeEstado}
        sx={{
          marginTop: 2,
          backgroundColor: colors.primary[400],
          color: colors.grey[100],
          "&:hover": {
            backgroundColor: colors.redAccent[500],
          },
        }}
      >
        {`Marcar como ${
          record.estado === "en progreso" ? "Finalizado" : "En Progreso"
        }`}
      </Button>

      {/* Edit and Delete buttons */}
      <CardActions>
        <EditButton
          sx={{
            color: colors.greenAccent[500],
            "&:hover": {
              color: colors.redAccent[500],
            },
          }}
        />
        <DeleteButton />
      </CardActions>
    </SimpleShowLayout>
  );
};
