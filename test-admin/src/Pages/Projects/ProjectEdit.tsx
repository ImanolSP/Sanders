// src/Pages/Projects/ProjectEdit.tsx

import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  DateInput,
  SelectInput,
  ReferenceArrayInput,
  SelectArrayInput,
  required,
} from 'react-admin';
import { Project } from '../../interfaces/Project';

export const ProjectEdit = (props: any) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="nombre" label="Nombre del Proyecto" validate={required()} />
      <TextInput source="descripcion" label="Descripción" multiline />
      <SelectInput
        source="estado"
        label="Estado"
        choices={[
          { id: 'en progreso', name: 'En Progreso' },
          { id: 'finalizado', name: 'Finalizado' },
        ]}
      />
      <NumberInput
        source="nivelUrgencia"
        label="Nivel de Urgencia"
        validate={required()}
      />
      <DateInput source="fechaInicio" label="Fecha de Inicio" validate={required()} />
      <DateInput
        source="fechaFinEstimada"
        label="Fecha de Fin Estimada"
        validate={required()}
      />
      <NumberInput
        source="costoTotal"
        label="Costo Total"
        validate={required()}
      />
      <NumberInput
        source="porcentajeAsignado"
        label="Porcentaje Asignado de Donaciones"
        validate={required()}
      />
      <TextInput source="ubicacion" label="Ubicación" />
      <ReferenceArrayInput
        source="usuariosAsignados"
        reference="usuarios"
        label="Usuarios Asignados"
      >
        <SelectArrayInput optionText="usuario" />
      </ReferenceArrayInput>
    </SimpleForm>
  </Edit>
);