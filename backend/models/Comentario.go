package models

import "time"

type Comentario struct {
	Id            int
	Descripcion   string
	Fecha         time.Time
	Id_estudiante int
	Id_valoracion int
}
