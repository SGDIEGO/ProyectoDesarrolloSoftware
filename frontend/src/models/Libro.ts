interface Libro {
  Id: number;
  Titulo: string;
  Autor: string;
  ISBN: string;
  Disponibilidad: boolean;
  Descripcion: string;

  Stock: number;
}

export type { Libro };
