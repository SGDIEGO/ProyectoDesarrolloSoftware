package services

import (
	"BibliotecaUlt/backend/dto"
	"BibliotecaUlt/backend/models"
	"BibliotecaUlt/backend/utils"
	"database/sql"
	"fmt"
	"time"
)

type PService struct {
	db    *sql.DB
	cache *utils.Cache
}

func NewPService(db *sql.DB, cache *utils.Cache) *PService {
	return &PService{
		db:    db,
		cache: cache,
	}
}

func (s *PService) GetAll() *utils.ResponseStr {
	// Query para tener todos los prestamos de la tabla "prestamos"
	query := "SELECT * FROM biblioteca.prestamos;"

	// Ejecutar el query
	rows, err := s.db.Query(query)
	if err != nil {
		return &utils.ResponseStr{Data: nil, Err: err.Error()}
	}

	// Lista a retornar
	var list []models.Prestamos
	var row models.Prestamos
	// Recorrer rows
	for rows.Next() {
		err := rows.Scan(&row.Id, &row.Id_estudiante, &row.Id_bibliotecario, &row.Fecha_prestamo, &row.Fecha_devolucion, &row.Estado)
		if err != nil {
			return &utils.ResponseStr{Data: nil, Err: err.Error()}
		}

		list = append(list, row)
	}

	// Usar base de datos
	return &utils.ResponseStr{Data: &list, Err: ""}
}

// Eliminar prestamo
func (s *PService) DelById(id int) *utils.ResponseStr {
	// Query para tener todos los estudiantes de la tabla "estudiantes"
	query := "DELETE FROM biblioteca.prestamos WHERE (id = ?);"

	// Ejecutar el query
	res, err := s.db.Exec(query, id)
	if err != nil {
		return &utils.ResponseStr{Data: nil, Err: err.Error()}
	}

	_, err = res.RowsAffected()
	if err != nil {
		return &utils.ResponseStr{Data: nil, Err: err.Error()}
	}

	return &utils.ResponseStr{Data: fmt.Sprint("Prestamo con id ", id, " fue eliminado!"), Err: ""}
}

// Crear prestamos
func (s *PService) Create(data *dto.PrestamoDTO) *utils.ResponseStr {
	// Verificar si existe estudiante
	var id_estudiante int
	query := "SELECT id FROM biblioteca.estudiantes WHERE (nro_matricula = ?);"

	row := s.db.QueryRow(query, data.Nro_matricula_estudiante)
	if row.Scan(&id_estudiante) != nil {
		return &utils.ResponseStr{Data: nil, Err: "Estudiante no fue encontrado en base de datos!."}
	}

	// Verificar si estudiante tiene multa
	query = "SELECT count(*) FROM biblioteca.multa_estudiante WHERE id_estudiante=? AND estado=?;"
	row = s.db.QueryRow(query, id_estudiante, "No pagado")

	// Si hay error
	if row.Err() != nil {
		return &utils.ResponseStr{Data: nil, Err: row.Err().Error()}
	}

	// Numero
	var numero int
	if err := row.Scan(&numero); err != nil {
		return &utils.ResponseStr{Data: nil, Err: err.Error()}
	}

	// Verificar si existen registros
	if numero != 0 {
		return &utils.ResponseStr{Data: nil, Err: "Usuario tiene registros pendientes de pago"}
	}

	// Verificar si existe libro
	query = "SELECT id_prestamo FROM biblioteca.libros WHERE (id = ?);"
	row = s.db.QueryRow(query, data.Id_libro)
	if row.Err() == sql.ErrNoRows {
		return &utils.ResponseStr{Data: nil, Err: row.Err().Error()}
	}

	// Verificar si libro ya tiene asignado prestamo
	var pres any
	if err := row.Scan(&pres); err != nil {
		return &utils.ResponseStr{Data: nil, Err: err.Error()}
	}

	// Tiene asignado un valor
	if pres != nil {
		return &utils.ResponseStr{Data: nil, Err: "Libro ya tiene prestamo asignado"}
	}

	// Informacion de bibliotecario de memoria cache
	var value, _ = s.cache.Get("session")
	var body = value.(*models.Bibliotecario)

	// Query para insertar nuevo prestamo
	query = "INSERT INTO `biblioteca`.`prestamos` (`id_estudiante`, `id_bibliotecario`, `fecha_prestamo`, `fecha_devolucion`, `estado`) VALUES (?, ?, ?, ?, ?);"
	// Ejecutar el query
	res, err := s.db.Exec(query, id_estudiante, body.Id, data.Fecha_prestamo, data.Fecha_devolucion, data.Estado)
	if err != nil {
		return &utils.ResponseStr{Data: nil, Err: err.Error()}
	}

	lastId, err := res.LastInsertId()
	if err != nil {
		return &utils.ResponseStr{Data: nil, Err: err.Error()}
	}

	_, err = res.RowsAffected()
	if err != nil {
		return &utils.ResponseStr{Data: nil, Err: err.Error()}
	}

	query = "UPDATE `biblioteca`.`libros` SET `id_prestamo` = ? WHERE (`id` = ?);"
	// Ejecutar el query
	_, err = s.db.Exec(query, int(lastId), data.Id_libro)
	if err != nil {
		return &utils.ResponseStr{Data: nil, Err: "Update: " + err.Error()}
	}

	return &utils.ResponseStr{Data: "Prestamo registrado", Err: ""}
}

// Terminar prestamo
func (s *PService) Terminar(id int) *utils.ResponseStr {
	// Prepara query
	query := "UPDATE `biblioteca`.`libros` SET `id_prestamo` = NULL WHERE (`id_prestamo` = ?);"

	// Ejecutar query
	res, err := s.db.Exec(query, id)

	// Verificar errores
	if res == nil || err != nil {
		return &utils.ResponseStr{
			Data: nil,
			Err:  err.Error(),
		}
	}

	// Actualizar estado de prestado a entregado
	estado := utils.Entregado

	// Prepara query
	query = "UPDATE `biblioteca`.`prestamos` SET `estado` = ? WHERE (`id` = ?);"

	// Ejecutar query
	res, err = s.db.Exec(query, estado, id)

	// Verificar errores
	if res == nil || err != nil {
		return &utils.ResponseStr{
			Data: nil,
			Err:  err.Error(),
		}
	}

	// Actualizacion exitosa
	return &utils.ResponseStr{
		Data: nil,
		Err:  "",
	}
}

// Funcion para actualizar los estados de las multas con respecto a las fecha del prestamo
func (s *PService) Verificar() *utils.ResponseStr {
	// Preparar query
	query := "SELECT * FROM biblioteca.prestamos;"

	// Ejecutar query
	rows, err := s.db.Query(query)

	// Errores
	if err != nil {
		return &utils.ResponseStr{
			Data: nil,
			Err:  err.Error(),
		}
	}

	if rows.Err() != nil {
		return &utils.ResponseStr{
			Data: nil,
			Err:  rows.Err().Error(),
		}
	}

	// Variable para almacenar los datos
	var row models.Prestamos
	var list []int

	// Recorrer cada registro
	for rows.Next() {
		if err := rows.Scan(&row.Id, &row.Id_estudiante, &row.Id_bibliotecario, &row.Fecha_prestamo, &row.Fecha_devolucion, &row.Estado); err != nil {
			return &utils.ResponseStr{
				Err: err.Error(),
			}
		}

		// Verificar si el prestamo ha sido entregado o no
		if row.Estado == string(utils.Entregado) {
			continue
		}

		// Verificar si la fecha de devolucion se paso
		if time.Now().After(row.Fecha_devolucion) {
			// // Preparar query
			// query = "UPDATE `biblioteca`.`prestamos` SET `estado` = ? WHERE (`id` = ?);"

			// // Ejecutar query
			// res, err := s.db.Exec(query, utils.Prestado, row.Id)

			// Validar errores
			// if err != nil {
			// 	return &utils.ResponseStr{
			// 		Err: err.Error(),
			// 	}
			// }

			// if res == nil {
			// 	return &utils.ResponseStr{
			// 		Err: "error de ejecucion en base de datos",
			// 	}
			// }

			// Preparar query
			query = "SELECT * FROM biblioteca.multa_estudiante where id_estudiante = ? AND estado = ?;"

			// Ejecutar query
			row_2 := s.db.QueryRow(query, row.Id_estudiante, utils.No_pagado)

			if row_2.Err() != nil {
				continue
			}

			// Verificar estado
			if err := row_2.Scan(); err != sql.ErrNoRows {
				continue
			}

			// Ejecutar query
			list = append(list, row.Id)
		}
	}

	// Retornar lista de prestamos actualizados
	return &utils.ResponseStr{
		Data: list,
		Err:  "",
	}
}

// Funcion para asignar multa a estudiante por prestamo vencido
func (s *PService) AsignarMulta(id_estudiante int, id_multa int) *utils.ResponseStr {
	// Preparar query
	query := "INSERT INTO `biblioteca`.`multa_estudiante` (`estado`, `id_multa`, `id_estudiante`) VALUES (?, ?, ?);"

	// Ejecutar query
	res, err := s.db.Exec(query, utils.No_pagado, id_multa, id_estudiante)

	// Verificar errores
	if err != nil {
		return &utils.ResponseStr{
			Err: err.Error(),
		}
	}

	if res == nil {
		return &utils.ResponseStr{
			Err: "error de ejecucion en base de datos",
		}
	}

	// No errores
	return &utils.ResponseStr{
		Err: "",
	}
}
