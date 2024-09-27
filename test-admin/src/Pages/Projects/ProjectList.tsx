// src/Pages/Projects/ProjectList.tsx

import React from 'react';
import {
  List,
  Filter,
  SelectInput,
  TextInput,
  useListContext,
} from 'react-admin';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Button,
  useTheme,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell } from 'recharts';
import { Project } from '../../interfaces/Project';
import { tokens } from '../../theme';

export const ProjectFilter = (props: any) => (
  <Filter {...props}>
    <SelectInput
      label="Estado"
      source="estado"
      choices={[
        { id: 'en progreso', name: 'En Progreso' },
        { id: 'finalizado', name: 'Finalizado' },
      ]}
    />
    <TextInput label="Buscar por Nombre" source="nombre" alwaysOn />
  </Filter>
);

export const ProjectList = (props: any) => {
  return (
    <List {...props} filters={<ProjectFilter />} pagination={false}>
      <ProjectGrid />
    </List>
  );
};


// Nuevo componente que utiliza useListContext
const ProjectGrid = () => {
  const { data, isLoading } = useListContext<Project>();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (isLoading) return <div>Cargando...</div>;

  return (
    <Grid container spacing={2} sx={{ padding: 2 }}>
      {data?.map((project) => (
        <Grid item xs={12} sm={6} md={4} key={project.id}>
          <Card
            sx={{
              backgroundColor: colors.primary[400],
              color: colors.grey[100],
            }}
          >
            <CardContent>
              <Typography variant="h5" component="div">
                {project.nombre}
              </Typography>
              {/* Gráfico resumen */}
              <PieChart width={100} height={100}>
                <Pie
                  data={[
                    { name: 'Cubierto', value: project.donacionesRecibidas },
                    {
                      name: 'Faltante',
                      value: project.costoTotal - project.donacionesRecibidas,
                    },
                  ]}
                  dataKey="value"
                  outerRadius={40}
                >
                  <Cell fill="#82ca9d" />
                  <Cell fill="#d0ed57" />
                </Pie>
              </PieChart>
              <Typography variant="body2" color={colors.grey[100]}>
                Estado: {project.estado}
              </Typography>
              <Typography variant="body2" color={colors.grey[100]}>
                Nivel de Urgencia: {project.nivelUrgencia}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                component={Link}
                to={`/projects/${project.id}/show`}
                sx={{
                  color: colors.greenAccent[500],
                  '&:hover': {
                    color: colors.greenAccent[100],
                  },
                }}
              >
                Ver Detalles
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};