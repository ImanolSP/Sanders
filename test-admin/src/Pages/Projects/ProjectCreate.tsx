// src/Pages/Projects/ProjectCreate.tsx

import React from 'react';
import {
  Create,
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

export const ProjectCreate = (props: any) => (
  <Create {...props}>
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
        defaultValue="en progreso"
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
      <NumberInput
        source="donacionesRecibidas"
        label="Donaciones Recibidas"
        defaultValue={0}
        style={{ display: 'none' }} // Esto lo oculta del formulario
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
  </Create>
);