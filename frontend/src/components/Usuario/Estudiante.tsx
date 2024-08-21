import { useContext, useEffect, useState } from "react";

import "./Usuario.css";

import {
  EstudianteContext,
  EstudianteContextValues,
} from "../../context/Estudiante";

// Import bindinds functions
import {
  EstGetAll,
  EstDelById,
  EstCreate,
  MulGetAll,
  MulGetAllMultas,
  EstAsignarMulta,
} from "../../../wailsjs/go/main/App";
import { utils } from "../../../wailsjs/go/models";
import { ResBody } from "../../utils/response";
import { Multa } from "../../models/Multa";

interface RegisterUserForm {
  nombres: string;
  apellidos: string;
  direccion: string;
  correo: string;
  dni: string;
  matricula: string;
  telefono: string;
}

// Renderizar menu de creacion de usuario
function CrearEstudiante(
  show: boolean,
  update: React.Dispatch<React.SetStateAction<boolean>>,
  data: RegisterUserForm,
  setData: React.Dispatch<React.SetStateAction<RegisterUserForm>>,
  ctx: EstudianteContextValues
) {
  if (!show) {
    return null;
  }

  function SubmitData(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();

    // Validaciones
    let errores = "";

    if (data.nombres == "") {
      errores += "Nombres necesarios \n";
    }

    if (data.apellidos == "") {
      errores += "Apellidos necesarios \n";
    }

    if (data.correo == "") {
      errores += "Correo necesario \n";
    }

    if (
      data.dni == "" ||
      data.dni.length != 8 ||
      data.dni.split("").every((c) => c >= "0" && c <= "9")
    ) {
      errores += "Dni invalido \n";
    }

    if (data.telefono == "" || data.telefono.length != 9) {
      errores += "Telefono invalido \n";
    }

    if (errores != "") {
      ctx.updateMssge(errores);
      return;
    }

    EstCreate({
      Nombre: data.nombres,
      Apellido: data.apellidos,
      Direccion: data.direccion,
      Correo: data.correo,
      Dni: data.dni,
      Matricula: data.matricula,
      Telefono: data.telefono,
    })
      .then((v) => {})
      .catch((e) => {
        ctx.updateMssge(e.message);
      });

    EstGetAll().then((v) => {
      const body = v as ResBody;

      ctx.uploadList(body.Data);
    });
  }

  function DataFormChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setData((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="form-submit">
      <form className="box" onSubmit={SubmitData}>
        <div>
          <label htmlFor="nombres">Nombres: </label>
          <input type="text" name="nombres" onChange={DataFormChange} />
        </div>

        <div>
          <label htmlFor="apellidos">Apellidos: </label>
          <input type="text" name="apellidos" onChange={DataFormChange} />
        </div>

        <div>
          <label htmlFor="direccion">Direccion: </label>
          <input type="text" name="direccion" onChange={DataFormChange} />
        </div>

        <div>
          <label htmlFor="correo">Correo: </label>
          <input type="email" name="correo" onChange={DataFormChange} />
        </div>

        <div>
          <label htmlFor="dni">Dni: </label>
          <input type="text" name="dni" onChange={DataFormChange} />
        </div>
        <div>
          <label htmlFor="matricula">Nro. matricula: </label>
          <input type="text" name="matricula" onChange={DataFormChange} />
        </div>
        <div>
          <label htmlFor="telefono">Nro. telefono: </label>
          <input type="text" name="telefono" onChange={DataFormChange} />
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

// Funcion para eliminar estudiante por id
function EliminarEstudiante(id: number, ctx: EstudianteContextValues) {
  EstDelById(id)
    .then((v) => {
      const body = v as ResBody;
      if (body.Err != "") {
        ctx.updateMssge("Error: " + body.Err);
      } else {
        ctx.updateMssge("Eliminando estudiante");
      }
    })
    .catch((err) => {
      ctx.updateMssge("Error: " + err);
    });

  // Update
  EstGetAll().then((v) => {
    const body = v as ResBody;

    ctx.uploadList(body.Data);
  });
}

// Componente
function EstudianteComponent() {
  // Context
  let ctx = useContext(EstudianteContext) as EstudianteContextValues;
  // Mostrar menu de multas
  const [menu_multa, mostrar_menu_multa] = useState(false);
  const [multas_tipos, actualizar_multas_tipos] = useState([] as Multa[]);
  const [multa_id, actualizar_multa_id] = useState(-1);
  const [estudiante_id, actualizar_estudiante_id] = useState(-1);

  // Cuando se renderiza el componente
  useEffect(() => {
    // Actualizar lista
    EstGetAll().then((v) => {
      const body = v as ResBody;

      ctx.uploadList(body.Data);
    });
  }, []);

  // Variable para abrir ventana para crear usuario
  let [menu_user, update_menu_user] = useState(false);
  let [formData, setFormData] = useState<RegisterUserForm>({
    nombres: "",
    apellidos: "",
    direccion: "",
    correo: "",
    dni: "",
    telefono: "",
    matricula: "",
  });

  // Renderizar estudiantes
  function RenderEstudiantes(ctx: EstudianteContextValues) {
    if (ctx.list == null || ctx.list.length === 0) {
      return null;
    }

    // Funcion para asignar multa a estudiante al realizar click
    function AsignarMultaEstudianteClick(id_estudiante: number) {
      if (menu_multa) {
        mostrar_menu_multa(false);
      } else {
        mostrar_menu_multa(true);
      }

      actualizar_estudiante_id(id_estudiante);
    }

    // Funcion para submit data de asignacion de multa
    function SubmitMultaEstudiante() {
      EstAsignarMulta(estudiante_id, multa_id)
        .then((res) => {
          const body = res as ResBody;
          if (body.Err != "") {
            throw new Error(body.Err);
          }

          ctx.updateMssge("Asignacion de multa correcta");
        })
        .catch((e) => {
          ctx.updateMssge(e.message);
        });
    }

    // Funcion que contiene la lista de multas
    function RenderizarMultas() {
      return (
        <>
          <div
            className="position-absolute top-50 start-50 translate-middle w-25 h-25 alert alert-warning alert-dismissible fade show"
            role="alert"
          >
            <strong>Asignacion multa</strong>
            <select
              name="multa_id"
              id=""
              onChange={(e) => actualizar_multa_id(Number(e.target.value))}
            >
              <option defaultValue={""}>Choose...</option>
              <option value={1}>Devolucion</option>
              <option value={2}>Daño</option>
              <option value={3}>Perdida</option>
            </select>
            <button
              type="button"
              className="btn btn-close"
              data-dismiss="alert"
              aria-label="Close"
              onClick={() => mostrar_menu_multa(false)}
            ></button>
            <button
              type="button"
              className="btn btn-success"
              onClick={SubmitMultaEstudiante}
            >
              Asignar
            </button>
          </div>
        </>
      );
    }

    return (
      <>
        <table className="table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Correo</th>
              <th>Direccion</th>
              <th>Dni</th>
              <th>Nro_Matricula</th>
              <th>Telefono</th>
            </tr>
          </thead>
          <tbody className="user estudiante">
            {ctx.list.map((v) => (
              <tr key={v.Id}>
                <td>{v.Id}</td>
                <td>{v.Nombre}</td>
                <td>{v.Apellido}</td>
                <td>{v.Correo}</td>
                <td>{v.Direccion}</td>
                <td>{v.Dni}</td>
                <td>{v.Nro_Matricula}</td>
                <td>{v.Telefono}</td>
                <td className="table_opts">
                  <button
                    className="btn btn-danger"
                    onClick={() => EliminarEstudiante(v.Id, ctx)}
                  >
                    Eliminar
                  </button>

                  <button
                    className="btn btn-warning"
                    onClick={() => AsignarMultaEstudianteClick(v.Id)}
                  >
                    Asignar multa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          {menu_multa ? <RenderizarMultas /> : null}
        </table>
      </>
    );
  }
  return (
    <>
      <div id="estudiante_main" className="position-relative">
        <div>
          <h1>ESTUDIANTES</h1>
          {RenderEstudiantes(ctx)}
          <button
            className="btn btn-secondary"
            onClick={() => {
              if (menu_user) update_menu_user(false);
              else update_menu_user(true);
            }}
          >
            Registrar estudiante
          </button>
        </div>

        {CrearEstudiante(
          menu_user,
          update_menu_user,
          formData,
          setFormData,
          ctx
        )}

        <div>
          <h3>{ctx.mssge}</h3>
        </div>
      </div>
    </>
  );
}

export { EstudianteComponent };
