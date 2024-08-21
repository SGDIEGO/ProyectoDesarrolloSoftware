package utils

// MULTA
type Multa string

const (
	Devolucion Multa = "Devolucion"
	Daño       Multa = "Daño"
	Perdida    Multa = "Perdida"
)

// MULTA ESTUDIANTE

type Multa_Estado string

const (
	Pagado    Multa_Estado = "Pagado"
	No_pagado Multa_Estado = "No pagado"
)

// PRESTAMO

type Prestamo_Estado string

const (
	Prestado  Prestamo_Estado = "Prestado"
	Entregado Prestamo_Estado = "Entregado"
)
