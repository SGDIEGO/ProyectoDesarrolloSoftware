interface Usuario {
  Id: number;
  Nombre: string;
  Apellido: string;
  Correo: string;
  Direccion: string;
  Dni: number;
  Telefono: string;
}

interface Estudiante extends Usuario {
  Nro_Matricula: string;
}

interface Bibliotecario extends Usuario {
  Turno: number;
}

export type {
    Estudiante,
    Bibliotecario
}