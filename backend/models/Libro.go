package models

type Libro struct {
	Id          int
	Titulo      string
	Autor       string
	ISBN        string
	Descripcion string
	Stock       int
}

type Libro_Ejemplar struct {
	Id          int
	Id_libro    int
	Id_prestamo int
}
