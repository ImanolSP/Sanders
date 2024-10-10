// src/Pages/Projects/ProjectCreate.tsx

import React, { useEffect, useState } from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  DateInput,
  useRedirect,
  useDataProvider,
  useNotify,
  SelectInput,
} from 'react-admin';
import { Typography } from '@mui/material';
import { Project } from '../../interfaces/Project';
import { DataProvider } from 'react-admin';
import { useFormContext } from 'react-hook-form';

export const ProjectCreate = (props: any) => {
  const redirect = useRedirect();
  const notify = useNotify();
  const dataProvider: DataProvider = useDataProvider();

  return (
    <Create
      {...props}
      mutationOptions={{
        onSuccess: () => {
          notify('Proyecto creado con éxito', { type: 'info' });
          redirect('/projects');
        },
      }}
    >
      <SimpleForm>
        <ProjectFormFields dataProvider={dataProvider} />
      </SimpleForm>
    </Create>
  );
};

const ProjectFormFields = ({ dataProvider }: { dataProvider: DataProvider }) => {
  const [maxAssignable, setMaxAssignable] = useState<number>(100);
  const [totalAssigned, setTotalAssigned] = useState<number>(0);

  const { watch } = useFormContext();
  const porcentajeAsignado = watch('porcentajeAsignado') || 0;

  // Fetch total assigned percentage when the component mounts
  useEffect(() => {
    const fetchTotalAssigned = async () => {
      try {
        const projects = await dataProvider.getList<Project>('projects', {
          pagination: { page: 1, perPage: 1000 },
          sort: { field: 'id', order: 'ASC' },
          filter: {},
        });

        const total = projects.data.reduce(
          (sum: number, project: Project) => sum + (project.porcentajeAsignado || 0),
          0
        );

        setTotalAssigned(total);
        setMaxAssignable(100 - total);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchTotalAssigned();
  }, [dataProvider]);

  // Simplify or remove the validation function temporarily
  const validatePorcentaje = (value: number) => {
    const maxAssignablePercentage = 100 - totalAssigned;

    if (value > maxAssignablePercentage) {
      return `El porcentaje máximo que puedes asignar es ${maxAssignablePercentage}%.`;
    }

    return undefined;
  };

  return (
    <>
      <TextInput source="nombre" label="Nombre" fullWidth />
      <TextInput source="descripcion" label="Descripción" multiline fullWidth />
      <NumberInput source="nivelUrgencia" label="Nivel de Urgencia" />
      <DateInput source="fechaInicio" label="Fecha de Inicio" />
      <DateInput source="fechaFinEstimada" label="Fecha de Fin Estimada" />
      <NumberInput source="costoTotal" label="Costo Total" />

      <NumberInput
        source="porcentajeAsignado"
        label="Porcentaje Asignado"
        validate={validatePorcentaje}
      />
      <Typography variant="body2">
        Porcentaje restante disponible: {maxAssignable - porcentajeAsignado}%
      </Typography>

      <TextInput source="ubicacion" label="Ubicación" fullWidth />

      <SelectInput
        source="estado"
        label="Estado"
        choices={[
          { id: 'en progreso', name: 'En Progreso' },
          { id: 'finalizado', name: 'Finalizado' },
          { id: 'fondos suficientes', name: 'Fondos Suficientes' },
        ]}
        defaultValue="en progreso" // Set default value here
      />
    </>
  );
};