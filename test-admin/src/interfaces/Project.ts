// src/interfaces/Project.ts

export interface Project {
    id: string;
    nombre: string;
    descripcion: string;
    estado: 'en progreso' | 'finalizado';
    nivelUrgencia: 1 | 2 | 3;
    fechaInicio: string;
    fechaFinEstimada: string;
    costoTotal: number;
    porcentajeAsignado: number; // Porcentaje de donaciones asignado
    usuariosAsignados: string[]; // IDs de usuarios asignados
    proveedores: string[]; // Lista de proveedores
    ubicacion: string;
    donacionesRecibidas: number; // Monto acumulado de donaciones
  }