package models

type Libro struct {
	Id          int
	Titulo      string
	Autor       string
	ISBN        string
	Descripcion string

	Id_prestamo int
}
