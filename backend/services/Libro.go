package services

import (
	"BibliotecaUlt/backend/dto"
	"BibliotecaUlt/backend/models"
	"BibliotecaUlt/backend/utils"
	"database/sql"
	"fmt"
)

type LService struct {
	db    *sql.DB
	cache *utils.Cache
}

func NewLService(db *sql.DB, cache *utils.Cache) *LService {
	return &LService{
		db:    db,
		cache: cache,
	}
}

// Obtener libros
func (s *LService) GetAll() *utils.ResponseStr {
	// Query para tener todos los libros de la tabla "libros"
	query := "SELECT * FROM biblioteca.libros;"

	// Ejecutar el query
	rows, err := s.db.Query(query)
	if err != nil {
		return &utils.ResponseStr{Data: nil, Err: err.Error()}
	}

	// Lista a retornar
	var list []models.Libro
	var row models.Libro

	// Recorrer rows
	for rows.Next() {
		err := rows.Scan(&row.Id, &row.Titulo, &row.Autor, &row.ISBN, &row.Descripcion, &row.Stock)
		if err != nil {
			return &utils.ResponseStr{Data: nil, Err: err.Error()}
		}

		list = append(list, row)
	}

	// Usar base de datos
	return &utils.ResponseStr{Data: &list, Err: ""}
}

// Eliminar libro
func (s *LService) DelById(id int) *utils.ResponseStr {
	// Query para eliminar libro por id de la tabla "libro"
	query := "DELETE FROM `biblioteca`.`libros` WHERE (`id` = ?);"

	// Ejecutar el query
	res, err := s.db.Exec(query, id)
	if err != nil {
		return &utils.ResponseStr{Data: nil, Err: err.Error()}
	}

	_, err = res.RowsAffected()
	if err != nil {
		return &utils.ResponseStr{Data: nil, Err: err.Error()}
	}

	return &utils.ResponseStr{Data: fmt.Sprint("Libro con id ", id, " fue eliminado!"), Err: ""}
}

// Crear libro
func (s *LService) Create(data *dto.LibroDTO) *utils.ResponseStr {
	// Query para insertar libro de la tabla "libro"
	query := "INSERT INTO `biblioteca`.`libros` (`titulo`, `autor`, `ISBN`, `descripcion`, `stock`) VALUES (?, ?, ?, ?, ?);"

	// Ejecutar el query
	res, err := s.db.Exec(query, data.Titulo, data.Autor, data.ISBN, data.Descripcion, data.Stock)
	if err != nil {
		return &utils.ResponseStr{Data: nil, Err: err.Error()}
	}

	_, err = res.RowsAffected()
	if err != nil {
		return &utils.ResponseStr{Data: nil, Err: err.Error()}
	}

	return &utils.ResponseStr{Data: "Libro registrado!", Err: ""}
}
