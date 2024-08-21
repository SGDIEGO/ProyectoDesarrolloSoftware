package services

import (
	"BibliotecaUlt/backend/models"
	"BibliotecaUlt/backend/utils"
	"database/sql"
)

type CService struct {
	db    *sql.DB
	cache *utils.Cache
}

func NewCService(db *sql.DB, cache *utils.Cache) *CService {
	return &CService{
		db:    db,
		cache: cache,
	}
}

func (s *CService) GetAll() *utils.ResponseStr {
	// Query para tener todos las multas de la tabla "multas"
	query := "SELECT * FROM biblioteca.comentario;"

	// Ejecutar el query
	rows, err := s.db.Query(query)
	if err != nil {
		return &utils.ResponseStr{Data: nil, Err: err.Error()}
	}

	// Lista a retornar
	var list []models.Comentario
	var row models.Comentario
	// Recorrer rows
	for rows.Next() {
		err := rows.Scan(&row.Id, &row.Descripcion, &row.Fecha, &row.Id_estudiante, &row.Id_valoracion)
		if err != nil {
			return &utils.ResponseStr{Data: nil, Err: err.Error()}
		}

		list = append(list, row)
	}

	// Usar base de datos
	return &utils.ResponseStr{Data: &list, Err: ""}
}
