// src/interfaces/Project.ts

export interface Project {
  id: string;
  nombre: string;
  descripcion: string;
  estado: 'en progreso' | 'finalizado' | 'fondos suficientes';
  nivelUrgencia: number;
  fechaInicio: string;
  fechaFinEstimada: string;
  costoTotal: number;
  porcentajeAsignado: number;
  usuariosAsignados: string[];
  proveedores?: string[];
  ubicacion: string;
  donacionesRecibidas: number;
  fondosCompletos?: boolean; // Nuevo campo
}