package main

import (
	"BibliotecaUlt/backend/db"
	"BibliotecaUlt/backend/dto"
	"BibliotecaUlt/backend/services"
	"BibliotecaUlt/backend/utils"
	"context"
	"fmt"
	"os/exec"
	"runtime"
)

// App struct
type App struct {
	ctx      context.Context
	cache    *utils.Cache
	bService *services.BService
	eService *services.EService
	lService *services.LService
	pService *services.PService
	mService *services.MService
	cService *services.CService
}

// NewApp creates a new App application struct
func NewApp() *App {
	db_, _ := db.LoadDb()
	cache := utils.NewCache()

	return &App{
		cache:    cache,
		bService: services.NewBService(db_, cache),
		eService: services.NewEService(db_, cache),
		lService: services.NewLService(db_, cache),
		pService: services.NewPService(db_, cache),
		mService: services.NewMService(db_, cache),
		cService: services.NewCService(db_, cache),
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// BIBLIOTECARIOS FUNC
func (a *App) BibGetAll() *utils.ResponseStr {
	return a.bService.GetAll()
}
func (a *App) BibGetById(data *dto.Bibliotecario) *utils.ResponseStr {
	return a.bService.GetById(data)
}

// ESTUDIANTES FUNC
func (a *App) EstGetAll() *utils.ResponseStr {
	return a.eService.GetAll()
}
func (a *App) EstDelById(id int) *utils.ResponseStr {
	return a.eService.DelById(id)
}
func (a *App) EstCreate(data *dto.EstudianteDTO) *utils.ResponseStr {
	return a.eService.Create(data)
}
func (a *App) EstAsignarMulta(id_estudiante int, id_multa int) *utils.ResponseStr {
	return a.eService.AsignarMulta(id_estudiante, id_multa)
}
func (a *App) EstRealizarComentario(data *dto.EstudianteComentarioDTO) *utils.ResponseStr {
	return a.eService.RealizarComentario(data)
}

// LIBROS FUNC
func (a *App) LibGetAll() *utils.ResponseStr {
	return a.lService.GetAll()
}
func (a *App) LibDelById(id int) *utils.ResponseStr {
	return a.lService.DelById(id)
}
func (a *App) LibCreate(data *dto.LibroDTO) *utils.ResponseStr {
	return a.lService.Create(data)
}

// PRESTAMOS FUNC
func (a *App) PresGetAll() *utils.ResponseStr {
	return a.pService.GetAll()
}
func (a *App) PresDelById(id int) *utils.ResponseStr {
	return a.pService.DelById(id)
}
func (a *App) PresCreate(data *dto.PrestamoDTO) *utils.ResponseStr {
	return a.pService.Create(data)
}
func (a *App) PresTerminar(data int) *utils.ResponseStr {
	return a.pService.Terminar(data)
}
func (a *App) PresVerificar() *utils.ResponseStr {
	return a.pService.Verificar()
}
func (a *App) PresAsignarMulta(id_estudiante int, id_multa int) *utils.ResponseStr {
	return a.pService.AsignarMulta(id_estudiante, id_multa)
}

// MULTAS FUNC
func (a *App) MulGetAll() *utils.ResponseStr {
	return a.mService.GetAll()
}
func (a *App) MulPagarById(id int) *utils.ResponseStr {
	return a.mService.PagarById(id)
}
func (a *App) MulGetAllMultas() *utils.ResponseStr {
	return a.mService.GetAllMultas()
}

// COMENTARIO
func (a *App) ComGetAll() *utils.ResponseStr {
	return a.cService.GetAll()
}

// APP FUNC

// Funcion para eliminar la clave session de memoria cache
func (a *App) CloseSession() {
	a.cache.Delete("session")
}

// Funcion para obtener los datos de la cache
func (a *App) GetDataSession() *utils.ResponseStr {
	data, exists := a.cache.Get("session")
	if !exists {
		return &utils.ResponseStr{
			Data: nil,
			Err:  "No inicio session correctamente",
		}
	}

	return &utils.ResponseStr{
		Data: data,
		Err:  "",
	}
}

// Funcion para abrir un navegador pasando la url
func (a *App) OpenBrowser(url string) {
	var cmd string
	var args []string

	switch runtime.GOOS {
	case "windows":
		cmd = "rundll32"
		args = []string{"url.dll,FileProtocolHandler", url}
	case "darwin":
		cmd = "open"
		args = []string{url}
	case "linux":
		cmd = "xdg-open"
		args = []string{url}
	default:
		fmt.Println("unsupported platform")
	}

	exec.Command(cmd, args...).Start()

}
