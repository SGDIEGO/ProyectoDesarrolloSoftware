package models

import "time"

type Prestamos struct {
	Id               int
	Id_estudiante    int
	Id_bibliotecario int

	Fecha_prestamo   time.Time
	Fecha_devolucion time.Time

	Estado string
}
