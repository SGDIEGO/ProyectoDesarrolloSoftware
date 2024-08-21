interface IComentario {
  Id: number;
  Descripcion: string;
  Fecha: Date;
  Id_estudiante: number;
  Id_valoracion: number;
}

interface IValoracion {
  Id: number;
  Calidad: number;
}

interface IEstudianteComentarioDTO {
	Descripcion   : string
	Fecha         : Date
	Id_estudiante : number
	Id_valoracion : number
}

export type { IComentario, IValoracion, IEstudianteComentarioDTO};
