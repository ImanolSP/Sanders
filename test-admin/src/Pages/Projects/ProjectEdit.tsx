// src/Pages/Projects/ProjectEdit.tsx

import React, { useEffect, useState } from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  DateInput,
  ReferenceArrayInput,
  SelectArrayInput,
  useRedirect,
  useDataProvider,
  Toolbar,
  SaveButton,
  useRecordContext,
  FormDataConsumer,
} from 'react-admin';
import { Typography } from '@mui/material';
import { Project } from '../../interfaces/Project';
import { DataProvider } from 'react-admin';

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
      <TextInput source="nombre" label="Nombre" fullWidth />
      <TextInput source="descripcion" label="Descripción" multiline fullWidth />
      <NumberInput source="nivelUrgencia" label="Nivel de Urgencia" />
      <DateInput source="fechaInicio" label="Fecha de Inicio" />
      <DateInput source="fechaFinEstimada" label="Fecha de Fin Estimada" />
      <NumberInput source="costoTotal" label="Costo Total" />
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
              />
              <Typography variant="body2">
                Porcentaje restante disponible: {maxAssignable}%
              </Typography>
            </>
          );
        }}
      </FormDataConsumer>
      <TextInput source="ubicacion" label="Ubicación" fullWidth />
      <ReferenceArrayInput
        label="Usuarios Asignados"
        source="usuariosAsignados"
        reference="usuarios"
      >
        <SelectArrayInput optionText="usuario" />
      </ReferenceArrayInput>
    </>
  );
};