// src/Pages/Projects/ProjectList.tsx

import React from "react";
import {
  useListController,
  ListContextProvider,
  ListProps,
  ListToolbar,
  useListContext,
  TopToolbar,
  TextInput,
  SelectInput,
  useRedirect,
  useNotify,
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
import DescriptionIcon from "@mui/icons-material/Description"; // For Excel
import GridOnIcon from "@mui/icons-material/GridOn"; // For CSV
import AddIcon from "@mui/icons-material/Add"; // For Create
import { LayoutButton } from "../../layouts/Layout";
import { exportData } from "../../componentes/Export"; // Import your export function

// Definir tus filtros
export const ProjectFilter = [
  <SelectInput
    label="Estado"
    source="estado"
    choices={[
      { id: "", name: "Todos" },
      { id: "en progreso", name: "En Progreso" },
      { id: "finalizado", name: "Finalizado y Fondos suficientes" },
      //{ id: "fondos suficientes", name: "Fondos Suficientes" },
    ]}
    alwaysOn
  />,
  <TextInput label="Buscar por Nombre" source="nombre" alwaysOn />,
];

// Acciones personalizadas
const ListActions = () => {
  const { data } = useListContext<Project>();
  const redirect = useRedirect();
  const notify = useNotify();

  const handleExport = (format: "xlsx" | "pdf" | "csv") => {
    if (data && data.length > 0) {
      exportData(data, format);
      notify(`Exportando datos a formato ${format.toUpperCase()}`, {
        type: "info",
      });
    } else {
      console.error("No hay datos para exportar.");
      notify("No hay datos para exportar.", { type: "warning" });
    }
  };

  return (
    <TopToolbar>
      <LayoutButton
        onClick={() => redirect("/projects/create")}
        startIcon={<AddIcon />}
        sx={{ margin: "5px" }}
      >
        Crear
      </LayoutButton>
      <LayoutButton
        onClick={() => handleExport("xlsx")}
        startIcon={<DescriptionIcon />}
        sx={{ margin: "5px" }}
      >
        Excel
      </LayoutButton>

      <LayoutButton
        onClick={() => handleExport("csv")}
        startIcon={<GridOnIcon />}
        sx={{ margin: "5px" }}
      >
        CSV
      </LayoutButton>
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
                <Typography variant="h4" component="div">
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
                    {/* <Cell fill={isFullyFunded ? "#ff0000" : "#82ca9d"} /> */}
                    <Cell fill={isFullyFunded ? "#6870fa" : "#82ca9d"} />
                    <Cell fill="#db4f4a" />
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
