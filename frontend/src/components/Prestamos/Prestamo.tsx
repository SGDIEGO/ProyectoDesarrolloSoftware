import { useContext, useEffect, useState } from "react";

import {
  EstRealizarComentario,
  LibGetAll,
  PresAsignarMulta,
  PresCreate,
  PresDelById,
  PresGetAll,
  PresTerminar,
  PresVerificar,
} from "../../../wailsjs/go/main/App";

import { PrestamoContext, PrestamoContextValues } from "../../context/Prestamo";
import { ResBody } from "../../utils/response";
import { FinPrestamoDTO, Prestamo } from "../../models/Prestamo";
import { MultaIds } from "../../utils/data";
import { Libro } from "../../models/Libro";
import { IEstudianteComentarioDTO } from "../../models/Comentario";

interface RegisterPrestamoForm {
  Id_bibliotecaria: number;
  Id_libro: number;
  Nro_matricula_estudiante: string;

  Fecha_prestamo: Date;
  Fecha_devolucion: Date;

  Estado: string;
}

// Funcion para eliminar estudiante por id
function EliminarPrestamo(id: number, ctx: PrestamoContextValues) {
  PresDelById(id)
    .then((res) => {
      let body = res as ResBody;
      if (body.Err != "") {
        ctx.uploadMssge("Error: " + body.Err);
      } else {
        ctx.uploadMssge("Eliminando prestamo");
      }
    })
    .catch((err) => {
      ctx.uploadMssge("Error: " + err);
    });

  // Update
  PresGetAll().then((v) => {
    const body = v as ResBody;
    if (body.Err != "") {
      ctx.uploadMssge(body.Err);
      return;
    }

    ctx.uploadList(body.Data);
  });
}

// Funcion para terminar prestamo
function TerminarPrestamo(id_prestamo: number, ctx: PrestamoContextValues) {
  PresTerminar(id_prestamo)
    .then((res) => {
      const body = res as ResBody;
      if (body.Err != "") {
        throw new Error(body.Err);
      }

      PrestamosGeneral(ctx);
    })
    .catch((e) => {
      ctx.uploadMssge(e.message);
    });
}

// Funcion para obtener lista de prestamos
function PrestamosGeneral(ctx: PrestamoContextValues) {
  // Actualizar lista
  PresGetAll().then((v) => {
    const body = v as ResBody;
    if (body.Err != "") {
      ctx.uploadMssge(body.Err);
      return;
    }

    ctx.uploadList(body.Data);
  });
}

function PrestamoComponent() {
  // Context
  let ctx = useContext(PrestamoContext) as PrestamoContextValues;
  let [listPrestamosM, actualizar_listPrestamosM] = useState<number[]>([]);
  // Libros disponibles
  const [librosDisponibles, actualizar_librosDisponibles] = useState(
    [] as number[]
  );

  // Cuando se renderiza el componente
  useEffect(() => {
    // Actualizar lista
    PresGetAll().then((v) => {
      const body = v as ResBody;
      if (body.Err != "") {
        ctx.uploadMssge(body.Err);
        return;
      }

      ctx.uploadList(body.Data);
    });
  }, []);

  // Variable para abrir ventana para crear usuario
  let [menu_user, update_menu_user] = useState(false);
  let [formData, setFormData] = useState<RegisterPrestamoForm>({
    Nro_matricula_estudiante: "",
    Id_bibliotecaria: -1,
    Id_libro: -1,
    Fecha_prestamo: new Date(),
    Fecha_devolucion: new Date(),
    Estado: "",
  });
  const [menu_comentario, mostrar_menu_comentario] = useState(false);
  const [estudiante_id, actualizar_estudiante_id] = useState(-1);
  const [valoracion, actualizar_valoracion] = useState(0);
  const [comentario, actualizar_comentario] = useState("");

  // Renderizar los prestamos
  function RenderPrestamos(ctx: PrestamoContextValues) {
    // Funcion para asignar multa a prestamo
    function AsignarMultaPrestamo(id_estudiante: number, id_multa: number) {
      PresAsignarMulta(id_estudiante, id_multa)
        .then((res) => {
          const body = res as ResBody;
          if (body.Err != "") {
            throw new Error(body.Err);
          }

          VerificarEstadoPrestamos();
        })
        .catch((e) => {
          ctx.uploadMssge(e.message);
        });
    }

    if (ctx.list == null || ctx.list.length === 0) {
      return null;
    }

    // Comentario
    function SubmitComentario() {
      const data: IEstudianteComentarioDTO = {
        Descripcion: comentario,
        Fecha: new Date(),
        Id_estudiante: estudiante_id,
        Id_valoracion: valoracion,
      };

      console.log(data);

      EstRealizarComentario(data)
        .then((res) => {
          const body = res as ResBody;
          if (body.Err != "") {
            throw new Error(body.Err);
          }

          ctx.uploadMssge("Comentario creado");
        })
        .catch((e) => ctx.uploadMssge(e.message));
    }

    // Renderizar comentario
    function RenderizarComentario() {
      return (
        <>
          <div
            className="position-absolute top-50 start-50 translate-middle w-25 h-25 alert alert-warning alert-dismissible fade show"
            role="alert"
          >
            <strong>Comentario</strong>
            <textarea
              rows={4}
              cols={30}
              onBlur={(e) => {
                console.log(e.target.value);
                actualizar_comentario(e.target.value);
                e.target.defaultValue = e.target.value;
              }}
              style={{ resize: "none" }}
            />
            <select
              name="multa_id"
              id=""
              onChange={(e) => actualizar_valoracion(Number(e.target.value))}
            >
              <option defaultValue={-1}>Choose...</option>
              <option value={1}>Pesima</option>
              <option value={2}>Mala</option>
              <option value={3}>Moderada</option>
              <option value={4}>Buena</option>
              <option value={5}>Excelente</option>
            </select>
            <button
              type="button"
              className="btn btn-close"
              data-dismiss="alert"
              aria-label="Close"
              onClick={() => mostrar_menu_comentario(false)}
            ></button>
            <button
              type="button"
              className="btn btn-success"
              onClick={SubmitComentario}
            >
              Asignar
            </button>
          </div>
        </>
      );
    }

    // Funcion para asignar comentario
    function AsignarEstudiante(id: number) {
      actualizar_estudiante_id(id);
      if (menu_comentario) {
        mostrar_menu_comentario(false);
      } else {
        mostrar_menu_comentario(true);
      }
    }

    return (
      <>
        <table className="table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Id_estudiante</th>
              <th>Id_bibliotecario</th>
              <th>Fecha prestamo</th>
              <th>Fecha devolucion</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {ctx.list.map((v) => (
              <tr className="libro">
                <td>{v.Id}</td>
                <td>{v.Id_estudiante}</td>
                <td>{v.Id_bibliotecario}</td>
                <td>{v.Fecha_prestamo.toString().substring(0, 10)}</td>
                <td>{v.Fecha_devolucion.toString().substring(0, 10)}</td>
                <td>{v.Estado}</td>
                <td className="table_opts">
                  {v.Estado == "Prestado" ? (
                    <button
                      className="btn btn-success"
                      onClick={() => TerminarPrestamo(v.Id, ctx)}
                    >
                      Terminado
                    </button>
                  ) : null}
                  {v.Estado == "Prestado" ? (
                    <button
                      className="btn btn-warning"
                      onClick={() => AsignarEstudiante(v.Id_estudiante)}
                    >
                      Comentario
                    </button>
                  ) : null}
                  {listPrestamosM.find((pres) => pres == v.Id) != undefined ? (
                    <button
                      className="btn btn-info"
                      onClick={() =>
                        AsignarMultaPrestamo(
                          v.Id_estudiante,
                          MultaIds.Devolucion
                        )
                      }
                    >
                      Actualizar
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
          {menu_comentario ? <RenderizarComentario /> : null}
        </table>
      </>
    );
  }

  // Funcion para verificar y actualizar los estados de prestamos
  function VerificarEstadoPrestamos() {
    PresVerificar()
      .then((res) => {
        const body = res as ResBody;
        if (body.Err != "") {
          throw new Error(body.Err);
        }

        // Extraer la lista de prestamos que cuentan con multa
        const listPrestamosMulta = body.Data as number[];
        if (listPrestamosMulta != null) {
          actualizar_listPrestamosM(listPrestamosMulta);
        }

        // Actualizar lista para el renderizado
        ctx.uploadList(ctx.list);
      })
      .catch((e) => {
        ctx.uploadMssge(e.message);
      });
  }

  // Renderizar menu de creacion de usuario
  function CrearPrestamo(
    show: boolean,
    update: React.Dispatch<React.SetStateAction<boolean>>,
    data: RegisterPrestamoForm,
    setData: React.Dispatch<React.SetStateAction<RegisterPrestamoForm>>,
    ctx: PrestamoContextValues
  ) {
    if (!show) {
      return null;
    }

    // Cargar datos
    LibGetAll()
      .then((res) => {
        const body = res as ResBody;
        if (body.Err != "") {
          throw new Error(body.Err);
        }

        const libros = body.Data as Libro[];
        const librosDisponibles = libros
          .filter((libro) => libro.Id_prestamo == -1)
          .map((libro) => libro.Id);

        // Lista de libros disponibles
        actualizar_librosDisponibles(librosDisponibles);
      })
      .catch((e) => ctx.uploadMssge(e.message));

    // Al subtmit datos
    function SubmitData(e: React.ChangeEvent<HTMLFormElement>) {
      e.preventDefault();

      // Validacion
      let errores = "";

      if (data.Fecha_devolucion < data.Fecha_prestamo) {
        errores += "Introduzca fechas correctas";
      }

      if (errores != "") {
        ctx.uploadMssge(errores);
        return;
      }

      PresCreate({
        Id_bibliotecaria: Number(data.Id_bibliotecaria),
        Id_libro: Number(data.Id_libro),
        Nro_matricula_estudiante: data.Nro_matricula_estudiante,

        Fecha_prestamo: new Date(data.Fecha_prestamo).toISOString(),
        Fecha_devolucion: new Date(data.Fecha_devolucion).toISOString(),

        Estado: "Prestado",
      })
        .then((v) => {
          const body = v as ResBody;

          // Si hay error
          if (body.Err != "") {
            ctx.uploadMssge("Error: " + body.Err);
          } else {
            ctx.uploadMssge("Prestamo registrado!");
          }
        })
        .catch((err) => {
          ctx.uploadMssge("Error: " + err);
        });

      PresGetAll().then((v) => {
        const body = v as ResBody;
        ctx.uploadList(body.Data);
      });
    }

    // Al cambiar el texto en los inputs
    function DataFormChange(e: React.ChangeEvent<HTMLInputElement>) {
      const { name, value } = e.target;

      setData((prev) => ({ ...prev, [name]: value }));
    }

    return (
      <div className="form-submit">
        <form className="box" onSubmit={SubmitData}>
          <div>
            <label htmlFor="Id_libro">Id_libro: </label>
            <select
              className="custom-select my-1 mr-sm-2"
              id="inlineFormCustomSelectPref"
              name="Id_libro"
              onChange={(e: any) => {
                data.Id_libro = e.target.value;
                setData(data);
              }}
            >
              <option selected>Choose...</option>
              {librosDisponibles.map((libro) => (
                <option value={libro}>{libro}</option>
              ))}
              {/* <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option> */}
            </select>
            {/* <input type="text" name="Id_libro" onChange={DataFormChange} /> */}
          </div>

          <div>
            <label htmlFor="Nro_matricula_estudiante">
              Nro_matricula_estudiante:{" "}
            </label>
            <input
              type="text"
              name="Nro_matricula_estudiante"
              onChange={DataFormChange}
            />
          </div>

          <div>
            <label htmlFor="Fecha_prestamo">Fecha_prestamo: </label>
            <input
              type="datetime-local"
              name="Fecha_prestamo"
              onChange={DataFormChange}
            />
          </div>

          <div>
            <label htmlFor="Fecha_devolucion">Fecha_devolucion: </label>
            <input
              type="datetime-local"
              name="Fecha_devolucion"
              onChange={DataFormChange}
            />
          </div>

          <input type="submit" value="Submit" />
        </form>

        <div className="form-submit__exit">
          <button
            onClick={() => {
              update(false);
            }}
          >
            X
          </button>
        </div>
      </div>
    );
  }

  // Componente
  return (
    <>
      <div>
        <div>
          <h1>PRESTAMOS</h1>
          {RenderPrestamos(ctx)}

          <div className="d-flex gap-3 ">
            <button
              className="btn btn-secondary"
              onClick={() => {
                if (menu_user) update_menu_user(false);
                else update_menu_user(true);
              }}
            >
              Registrar prestamo
            </button>

            <button
              className="btn btn-secondary"
              onClick={VerificarEstadoPrestamos}
            >
              Verificar prestamos
            </button>
          </div>
        </div>

        {CrearPrestamo(menu_user, update_menu_user, formData, setFormData, ctx)}

        <div>
          <h3 className="notif">{ctx.mssge}</h3>
        </div>
      </div>
    </>
  );
}

export { PrestamoComponent };
