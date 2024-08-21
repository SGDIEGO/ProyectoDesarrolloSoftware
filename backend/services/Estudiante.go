package services

import (
	"BibliotecaUlt/backend/dto"
	"BibliotecaUlt/backend/models"
	"BibliotecaUlt/backend/utils"
	"database/sql"
	"fmt"
)

type EService struct {
	db    *sql.DB
	cache *utils.Cache
}

// Creacion de servicio de estudiante
func NewEService(db *sql.DB, cache *utils.Cache) *EService {
	return &EService{
		db:    db,
		cache: cache,
	}
}

// Obtener usuarios
func (s *EService) GetAll() *utils.ResponseStr {
	// Query para tener todos los estudiantes de la tabla "estudiantes"
	query := "SELECT * FROM biblioteca.estudiantes;"

	// Ejecutar el query
	rows, err := s.db.Query(query)
	if err != nil {
		return &utils.ResponseStr{Data: nil, Err: err.Error()}
	}

	// Lista a retornar
	var list []models.Estudiante
	var row models.Estudiante
	// Recorrer rows
	for rows.Next() {
		err := rows.Scan(&row.Id, &row.Nombre, &row.Apellido, &row.Direccion, &row.Correo, &row.Dni, &row.Telefono, &row.Nro_Matricula)
		if err != nil {
			return &utils.ResponseStr{Data: nil, Err: err.Error()}
		}

		list = append(list, row)
	}
	// Usar base de datos
	return &utils.ResponseStr{Data: list, Err: ""}
}

// Eliminar estudiante
func (s *EService) DelById(id int) *utils.ResponseStr {
	// Query para eliminar estudiante de la tabla "estudiantes"
	query := "DELETE FROM `biblioteca`.`estudiantes` WHERE (id = ?)"

	// Ejecutar el query
	res, err := s.db.Exec(query, id)
	if err != nil {
		return &utils.ResponseStr{Data: nil, Err: err.Error()}
	}

	_, err = res.RowsAffected()
	if err != nil {
		return &utils.ResponseStr{Data: nil, Err: err.Error()}
	}

	return &utils.ResponseStr{Data: fmt.Sprint("Estudiante con id ", id, " fue eliminado"), Err: ""}
}

// Crear estudiante
func (s *EService) Create(data *dto.EstudianteDTO) *utils.ResponseStr {
	// Query para registrar nuevo estudiante de la tabla "estudiantes"
	query := "INSERT INTO `biblioteca`.`estudiantes` (`nombres`, `apellidos`, `direccion`, `correo`, `dni`, `telefono`, `nro_matricula`) VALUES ( ?, ?, ?, ?, ?, ?, ?);"

	// Ejecutar el query
	res, err := s.db.Exec(query, data.Nombre, data.Apellido, data.Direccion, data.Correo, data.Dni, data.Telefono, data.Matricula)
	if err != nil {
		return &utils.ResponseStr{Data: nil, Err: err.Error()}
	}

	_, err = res.RowsAffected()
	if err != nil {
		return &utils.ResponseStr{Data: nil, Err: err.Error()}
	}

	return &utils.ResponseStr{Data: "Estudiante registrado", Err: ""}
}

// Asignar multa a estudiante
func (s *EService) AsignarMulta(id_estudiante int, id_multa int) *utils.ResponseStr {
	// Preparar query
	query := "INSERT INTO `biblioteca`.`multa_estudiante` (`estado`, `id_multa`, `id_estudiante`) VALUES (?, ?, ?);"

	// Ejecutar query
	res, err := s.db.Exec(query, "No pagado", id_multa, id_estudiante)

	// Verificar errores
	if err != nil {
		return &utils.ResponseStr{
			Err: err.Error(),
		}
	}

	_, err = res.RowsAffected()
	if err != nil {
		return &utils.ResponseStr{Data: nil, Err: err.Error()}
	}

	// Query ejecutado con exito
	return &utils.ResponseStr{
		Err: "",
	}
}

func (s *EService) RealizarComentario(data *dto.EstudianteComentarioDTO) *utils.ResponseStr {
	// Preparar query
	query := "INSERT INTO `biblioteca`.`comentario` (`descripcion`, `fecha`, `id_estudiante`, `id_valoracion`) VALUES (?, ?, ?, ?);"

	// Ejecutar query
	res, err := s.db.Exec(query, data.Descripcion, data.Fecha, data.Id_estudiante, data.Id_valoracion)

	// Verificar errores
	if err != nil {
		return &utils.ResponseStr{
			Err: err.Error(),
		}
	}

	_, err = res.RowsAffected()
	if err != nil {
		return &utils.ResponseStr{Data: nil, Err: err.Error()}
	}

	// Query ejecutado con exito
	return &utils.ResponseStr{
		Err: "",
	}
}
