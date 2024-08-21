interface Multa {
  Id: number;
  Monto: number;
  Descripcion: string;
}

interface Multa_Estudiante {
  Id: number;
  Estado: string;
  Id_multa: number;
  Id_estudiante: number;
}

interface Multa_EstudianteDTO {
  Id: number;
  Estado: string;
  Estudiante: string;
  Multa: string;
}

export type { Multa_Estudiante, Multa_EstudianteDTO, Multa };
