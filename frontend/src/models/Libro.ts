interface Libro {
  Id: number;
  Id_prestamo: number;
  Titulo: string;
  Autor: string;
  ISBN: string;
  Disponibilidad: boolean;
  Descripcion: string;
}

export type {
    Libro
}