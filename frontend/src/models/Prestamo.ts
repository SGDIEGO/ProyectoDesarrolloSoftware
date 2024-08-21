interface Prestamo {
  Id: number;
  // Id_libro: number;
  Id_estudiante: number;
  Id_bibliotecario: number;

  Fecha_prestamo: Date;
  Fecha_devolucion: Date;

  Estado: string;
}

interface FinPrestamoDTO {
  Id_prestamo: number;
  Id_libro: number;
  Id_estudiante: number;
}

export type { Prestamo, FinPrestamoDTO };
