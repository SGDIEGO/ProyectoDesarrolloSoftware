package dto

import "time"

type PrestamoDTO struct {
	Id_libro                 int
	Id_bibliotecaria         int
	Nro_matricula_estudiante string

	Fecha_prestamo   time.Time
	Fecha_devolucion time.Time

	Estado string
}

type FinPrestamoDTO struct {
	Id_prestamo   int
	Id_libro      int
	Id_estudiante int
}
