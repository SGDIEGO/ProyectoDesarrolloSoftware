package db

import (
	"database/sql"

	"github.com/go-sql-driver/mysql"
)

// Carga de base de datos usando mysql
func LoadDb() (*sql.DB, error) {
	cfg := mysql.Config{
		User:      "root",
		Passwd:    "diegoasg04",
		Net:       "tcp",
		Addr:      "127.0.0.1:3306",
		DBName:    "biblioteca",
		ParseTime: true,
	}

	db, e := sql.Open("mysql", cfg.FormatDSN())
	if e != nil {
		return nil, e
	}

	e = db.Ping()
	if e != nil {
		return nil, e
	}

	return db, e
}
