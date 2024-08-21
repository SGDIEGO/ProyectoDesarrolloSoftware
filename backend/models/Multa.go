package models

type Multa struct {
	Id          int
	Monto       float64
	Descripcion string
}

type Multa_Estudiante struct {
	Id            int
	Estado        string
	Id_multa      int
	Id_estudiante int
}

type Multa_EstudianteDTO struct {
	Id         int
	Estado     string
	Estudiante string
	Multa      string
}
