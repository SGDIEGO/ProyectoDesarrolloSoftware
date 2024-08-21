package models

type Bibliotecario struct {
	Usuario
	Contraseña string
	Turno      int
}
