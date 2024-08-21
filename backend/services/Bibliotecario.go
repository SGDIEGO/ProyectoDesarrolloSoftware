package services

import (
	"BibliotecaUlt/backend/dto"
	"BibliotecaUlt/backend/models"
	"BibliotecaUlt/backend/utils"
	"database/sql"
)

type BService struct {
	db    *sql.DB
	cache *utils.Cache
}

// Creacion de servicio de bibliotecario
func NewBService(db *sql.DB, cache *utils.Cache) *BService {
	return &BService{
		db:    db,
		cache: cache,
	}
}

// Obtener usuarios
func (s *BService) GetAll() *utils.ResponseStr {
	// Query para tener todos los estudiantes de la tabla "estudiantes"
	query := "SELECT * FROM biblioteca.bibliotecario;"

	// Ejecutar el query
	rows, err := s.db.Query(query)
	if err != nil {
		return &utils.ResponseStr{Data: nil, Err: err.Error()}
	}

	// Lista a retornar
	var list []models.Bibliotecario
	var row models.Bibliotecario
	// Recorrer rows
	for rows.Next() {
		err = rows.Scan(&row.Id, &row.Nombre, &row.Apellido, &row.Direccion, &row.Correo, &row.Contraseña, &row.Dni, &row.Telefono, &row.Turno)
		if err != nil {
			return &utils.ResponseStr{Data: nil, Err: err.Error()}
		}
		list = append(list, row)
	}

	// Usar base de datos
	return &utils.ResponseStr{Data: &list, Err: ""}
}

func (s *BService) GetById(data *dto.Bibliotecario) *utils.ResponseStr {
	// Query para tener todos los bibliotecarios de la tabla "bibliotecario"
	query := "SELECT * FROM biblioteca.bibliotecario WHERE correo=? AND contraseña=?;"

	// Ejecutar el query
	row := s.db.QueryRow(query, data.Correo, data.Contraseña)
	if row.Err() == sql.ErrNoRows {
		return &utils.ResponseStr{Data: nil, Err: sql.ErrNoRows.Error()}
	}

	bibliotecario := new(models.Bibliotecario)
	if err := row.Scan(&bibliotecario.Id, &bibliotecario.Nombre, &bibliotecario.Apellido, &bibliotecario.Direccion, &bibliotecario.Correo, &bibliotecario.Contraseña, &bibliotecario.Dni, &bibliotecario.Telefono, &bibliotecario.Turno); err != nil {
		return &utils.ResponseStr{Data: nil, Err: err.Error()}
	}

	// Guardar informacion de bibliotecario
	s.cache.Set("session", bibliotecario)
	return &utils.ResponseStr{Data: &bibliotecario, Err: ""}
}
