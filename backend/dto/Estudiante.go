package dto

import "time"

type EstudianteDTO struct {
	Nombre    string
	Apellido  string
	Direccion string
	Correo    string
	Dni       string
	Matricula string
	Telefono  string
}

type EstudianteComentarioDTO struct {
	Descripcion   string
	Fecha         time.Time
	Id_estudiante int
	Id_valoracion int
}
