// src/Pages/Projects/ProjectList.tsx

import React from "react";
import {
  useListController,
  ListContextProvider,
  ListProps,
  ListToolbar,
  useListContext,
  TopToolbar,
  ExportButton,
  CreateButton,
  TextInput,
  SelectInput,
} from "react-admin";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Button,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell } from "recharts";
import { Project } from "../../interfaces/Project";
import { tokens } from "../../theme";
import FilterListIcon from "@mui/icons-material/FilterList";
import MuiButton from "@mui/material/Button";

// Definir tus filtros
export const ProjectFilter = [
  <SelectInput
    label="Estado"
    source="estado"
    choices={[
      { id: "en progreso", name: "En Progreso" },
      { id: "finalizado", name: "Finalizado" },
      { id: "fondos suficientes", name: "Fondos Suficientes" },
    ]}
    alwaysOn
  />,
  <TextInput label="Buscar por Nombre" source="nombre" alwaysOn />,
];

// Componente personalizado para el botón de filtrar
const StyledFilterButton = (props: any) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Button
      variant="contained"
      startIcon={<FilterListIcon />}
      onClick={props.onClick}
      sx={{
        color: colors.grey[100],
        backgroundColor: colors.blueAccent[700],
        "&:hover": {
          backgroundColor: colors.blueAccent[500],
        },
        margin: "5px",
      }}
    >
      Filtrar
    </Button>
  );
};

// Acciones personalizadas
const ListActions = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const buttonStyles = {
    color: colors.grey[100],
    backgroundColor: colors.blueAccent[700],
    "&:hover": {
      backgroundColor: colors.blueAccent[500],
    },
    margin: "5px",
  };

  return (
    <TopToolbar>
      <CreateButton sx={buttonStyles} />
      <ExportButton sx={buttonStyles} />
    </TopToolbar>
  );
};

// Componente para renderizar la cuadrícula de proyectos
const ProjectGrid = () => {
  const { data, isLoading } = useListContext<Project>();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (isLoading) return <div>Cargando...</div>;

  return (
    <Grid container spacing={2} sx={{ padding: 2 }}>
      {data?.map((project) => {
        // Determinar si el proyecto ha alcanzado los fondos completos
        const isFullyFunded = project.donacionesRecibidas >= project.costoTotal;

        return (
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
                      { name: "Cubierto", value: project.donacionesRecibidas },
                      {
                        name: "Faltante",
                        value: Math.max(
                          project.costoTotal - project.donacionesRecibidas,
                          0
                        ),
                      },
                    ]}
                    dataKey="value"
                    outerRadius={40}
                  >
                    <Cell fill={isFullyFunded ? "#ff0000" : "#82ca9d"} />
                    <Cell fill="#d0ed57" />
                  </Pie>
                </PieChart>
                <Typography variant="body2" color={colors.grey[100]}>
                  Estado:{" "}
                  {isFullyFunded ? "Fondos Suficientes" : project.estado}
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
                    "&:hover": {
                      color: colors.greenAccent[100],
                    },
                  }}
                >
                  Ver Detalles
                </Button>
              </CardActions>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export const ProjectList = (props: ListProps) => {
  // Obtener el contexto de la lista
  const listContext = useListController(props);

  return (
    <ListContextProvider value={listContext}>
      <ListToolbar filters={ProjectFilter} actions={<ListActions />} />
      <ProjectGrid />
    </ListContextProvider>
  );
};
