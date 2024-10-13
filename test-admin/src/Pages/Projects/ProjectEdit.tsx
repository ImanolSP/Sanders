// src/Pages/Projects/ProjectEdit.tsx

import React, { useEffect, useState } from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  DateInput,
  useRedirect,
  useDataProvider,
  Toolbar,
  SaveButton,
  useRecordContext,
  FormDataConsumer,
  SelectInput,
} from 'react-admin';
import { Typography } from '@mui/material';
import { Project } from '../../interfaces/Project';
import { DataProvider } from 'react-admin';
import { useTheme } from '@mui/material/styles';

export const ProjectEdit = (props: any) => {
  const redirect = useRedirect();
  const dataProvider: DataProvider = useDataProvider();

  // Custom Toolbar
  const MyToolbar = (props: any) => (
    <Toolbar {...props}>
      <SaveButton
        mutationOptions={{
          onSuccess: () => {
            redirect('/projects');
          },
        }}
      />
    </Toolbar>
  );

  return (
    <Edit {...props}>
      <SimpleForm toolbar={<MyToolbar />}>
        <ProjectFormFields dataProvider={dataProvider} />
      </SimpleForm>
    </Edit>
  );
};

const ProjectFormFields = ({ dataProvider }: { dataProvider: DataProvider }) => {
  const [maxAssignable, setMaxAssignable] = useState<number>(100);
  const record = useRecordContext<Project>();
  const theme = useTheme();

  // Styles for input labels in dark mode
  const inputLabelStyles = {
    '& .MuiFormLabel-root': {
      color: theme.palette.mode === 'dark' ? theme.palette.text.primary : undefined,
    },
    '& .MuiFormLabel-root.Mui-focused': {
      color: theme.palette.mode === 'dark' ? theme.palette.text.primary : undefined,
    },
  };

  // Function to get total assigned percentage
  const getTotalAssignedPercentage = async (): Promise<number> => {
    const projects = await dataProvider.getList<Project>('projects', {
      pagination: { page: 1, perPage: 1000 },
      sort: { field: 'id', order: 'ASC' },
      filter: {},
    });

    const totalAssigned = projects.data.reduce(
      (sum: number, project: Project) => sum + (project.porcentajeAsignado || 0),
      0
    );

    return totalAssigned;
  };

  // Validation of assigned percentage
  const validatePorcentaje = async (value: number) => {
    const totalAssigned = await getTotalAssignedPercentage();
    const currentProjectPercentage = record?.porcentajeAsignado || 0;
    const maxAssignablePercentage = 100 - (totalAssigned - currentProjectPercentage);

    if (value > maxAssignablePercentage) {
      return `El porcentaje máximo que puedes asignar es ${maxAssignablePercentage}%.`;
    }

    return undefined;
  };

  return (
    <>
      <TextInput
        source="nombre"
        label="Nombre"
        fullWidth
        sx={inputLabelStyles}
      />
      <TextInput
        source="descripcion"
        label="Descripción"
        multiline
        fullWidth
        sx={inputLabelStyles}
      />
      <NumberInput
        source="nivelUrgencia"
        label="Nivel de Urgencia"
        sx={inputLabelStyles}
      />
      <DateInput
        source="fechaInicio"
        label="Fecha de Inicio"
        sx={inputLabelStyles}
      />
      <DateInput
        source="fechaFinEstimada"
        label="Fecha de Fin Estimada"
        sx={inputLabelStyles}
      />
      <NumberInput
        source="costoTotal"
        label="Costo Total"
        sx={inputLabelStyles}
      />
      <FormDataConsumer>
        {({ formData, ...rest }) => {
          useEffect(() => {
            const fetchMaxAssignable = async () => {
              const totalAssigned = await getTotalAssignedPercentage();
              const currentProjectPercentage = formData.porcentajeAsignado || 0;
              const originalProjectPercentage = record?.porcentajeAsignado || 0;
              setMaxAssignable(
                100 - (totalAssigned - originalProjectPercentage + currentProjectPercentage)
              );
            };
            fetchMaxAssignable();
          }, [formData.porcentajeAsignado]);

          return (
            <>
              <NumberInput
                source="porcentajeAsignado"
                label="Porcentaje Asignado"
                validate={validatePorcentaje}
                sx={inputLabelStyles}
              />
              <Typography variant="body2">
                Porcentaje restante disponible: {maxAssignable}%
              </Typography>
            </>
          );
        }}
      </FormDataConsumer>
      <TextInput
        source="ubicacion"
        label="Ubicación"
        fullWidth
        sx={inputLabelStyles}
      />

      <SelectInput
        source="estado"
        label="Estado"
        choices={[
          { id: 'en progreso', name: 'En Progreso' },
          { id: 'finalizado', name: 'Finalizado' },
          { id: 'fondos suficientes', name: 'Fondos Suficientes' },
        ]}
        sx={inputLabelStyles}
      />
    </>
  );
};