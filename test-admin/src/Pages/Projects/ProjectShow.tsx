// src/Pages/Projects/ProjectShow.tsx

import React from 'react';
import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  DateField,
  ReferenceArrayField,
  SingleFieldList,
  ChipField,
  useRecordContext,
  useNotify,
  useRefresh,
  useRedirect,
  useDataProvider,
  EditButton,
  DeleteButton,
} from 'react-admin';
import { Typography, useTheme, Button, CardActions } from '@mui/material';
import DonutChart from 'react-donut-chart';
import { Project } from '../../interfaces/Project';
import { tokens } from '../../theme';

export const ProjectShow = (props: any) => (
  <Show {...props}>
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

  if (!record) return <div>Cargando...</div>;

  const handleChangeEstado = async () => {
    const newEstado = record.estado === 'en progreso' ? 'finalizado' : 'en progreso';
    try {
      await dataProvider.update('projects', {
        id: record.id,
        data: { ...record, estado: newEstado },
        previousData: record,
      });
      notify('Estado actualizado correctamente', { type: 'success' });
      refresh();
      redirect('/projects');
    } catch (error) {
      notify('Error al actualizar el estado', { type: 'error' });
    }
  };

  // Determinar si el proyecto ha alcanzado los fondos completos
  const isFullyFunded = record.donacionesRecibidas >= record.costoTotal;

  return (
    <SimpleShowLayout>
      <Typography variant="h4" sx={{ color: colors.grey[100] }}>
        {record.nombre}
      </Typography>
      <TextField source="descripcion" label="Descripción" />
      <TextField source="estado" label="Estado" />
      <NumberField source="nivelUrgencia" label="Nivel de Urgencia" />
      <DateField source="fechaInicio" label="Fecha de Inicio" />
      <DateField source="fechaFinEstimada" label="Fecha de Fin Estimada" />
      <NumberField source="costoTotal" label="Costo Total" />
      <NumberField source="donacionesRecibidas" label="Donaciones Recibidas" />
      <NumberField
        source="porcentajeAsignado"
        label="Porcentaje Asignado de Donaciones"
      />
      <TextField source="ubicacion" label="Ubicación" />
      <ReferenceArrayField
        label="Usuarios Asignados"
        reference="usuarios"
        source="usuariosAsignados"
      >
        <SingleFieldList>
          <ChipField source="usuario" />
        </SingleFieldList>
      </ReferenceArrayField>
      {/* Gráfico de distribución de financiamiento */}
      <Typography variant="h6" sx={{ color: colors.grey[100] }}>
        Distribución de Financiamiento
      </Typography>
      <DonutChart
        data={[
          {
            label: 'Cubierto',
            value: record.donacionesRecibidas,
          },
          {
            label: 'Faltante',
            value: Math.max(record.costoTotal - record.donacionesRecibidas, 0),
          },
        ]}
        colors={isFullyFunded ? ['#ff0000', '#d0ed57'] : ['#82ca9d', '#d0ed57']}
      />
      {/* Botón para cambiar estado */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleChangeEstado}
        sx={{ marginTop: 2 }}
      >
        {`Marcar como ${record.estado === 'en progreso' ? 'Finalizado' : 'En Progreso'}`}
      </Button>
      {/* Botones de edición y eliminación */}
      <CardActions>
        <EditButton />
        <DeleteButton />
      </CardActions>
    </SimpleShowLayout>
  );
};