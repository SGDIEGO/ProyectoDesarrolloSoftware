package services

import (
	"BibliotecaUlt/backend/models"
	"BibliotecaUlt/backend/utils"
	"database/sql"
)

type MService struct {
	db    *sql.DB
	cache *utils.Cache
}

func NewMService(db *sql.DB, cache *utils.Cache) *MService {
	return &MService{
		db:    db,
		cache: cache,
	}
}

func (s *MService) GetAll() *utils.ResponseStr {
	// Query para tener todos las multas de la tabla "multas"
	query := "SELECT me.id AS id, me.estado AS Estado, e.nro_matricula AS Estudiante, m.descripcion AS Multa FROM multa_estudiante me JOIN estudiantes e ON me.id_estudiante = e.id JOIN multa m ON me.id_multa = m.id;"

	// Ejecutar el query
	rows, err := s.db.Query(query)
	if err != nil {
		return &utils.ResponseStr{Data: nil, Err: err.Error()}
	}

	// Lista a retornar
	var list []models.Multa_EstudianteDTO
	var row models.Multa_EstudianteDTO
	// Recorrer rows
	for rows.Next() {
		err := rows.Scan(&row.Id, &row.Estado, &row.Estudiante, &row.Multa)
		if err != nil {
			return &utils.ResponseStr{Data: nil, Err: err.Error()}
		}

		list = append(list, row)
	}

	// Usar base de datos
	return &utils.ResponseStr{Data: &list, Err: ""}
}

// Pagar multa usando id
func (s *MService) PagarById(id int) *utils.ResponseStr {
	// Query para tener todos las multas de la tabla "multas"
	query := "UPDATE `biblioteca`.`multa_estudiante` SET `estado` = ? WHERE (`id` = ?);"

	// Ejecutar el query
	res, err := s.db.Exec(query, "Pagado", id)
	if err != nil {
		return &utils.ResponseStr{Data: nil, Err: err.Error()}
	}

	if res == nil {
		return &utils.ResponseStr{Data: nil, Err: "error de ejecucion en base de datos"}
	}

	// Usar base de datos
	return &utils.ResponseStr{Data: nil, Err: ""}
}

// Retorno de todas los tipos de multas
func (s *MService) GetAllMultas() *utils.ResponseStr {
	// Query
	query := "SELECT * FROM biblioteca.multa;"

	// Ejecutar query
	rows, err := s.db.Query(query)

	// Validar errores
	if err != nil {
		return &utils.ResponseStr{
			Err: err.Error(),
		}
	}

	// Registro de multas
	var multas []models.Multa
	var multa models.Multa

	for rows.Next() {
		if err := rows.Scan(&multa.Id, &multa.Monto, &multa.Descripcion); err != nil {
			return &utils.ResponseStr{
				Err: err.Error(),
			}
		}
		multas = append(multas, multa)
	}

	return &utils.ResponseStr{
		Data: multas,
		Err:  "",
	}
}
