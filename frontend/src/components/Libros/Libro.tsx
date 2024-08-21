import { useContext, useEffect, useState } from "react";
import { Libro } from "../../models/Libro";

import { LibroContext } from "../../context/Libro";
import { LibroContextValues } from "../../context/Libro";

import { LibCreate, LibDelById, LibGetAll } from "../../../wailsjs/go/main/App";
import { ResBody } from "../../utils/response";

interface RegisterLibroForm {
  Titulo: string;
  Autor: string;
  ISBN: string;
  Disponibilidad: boolean;
  Descripcion: string;
  Stock: number;
}

// Funcion para crear estudiante del menu
function CrearLibro(
  show: boolean,
  update: React.Dispatch<React.SetStateAction<boolean>>,
  data: RegisterLibroForm,
  setData: React.Dispatch<React.SetStateAction<RegisterLibroForm>>,
  ctx: LibroContextValues
) {
  if (!show) {
    return null;
  }

  function SubmitData(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();

    LibCreate({
      Titulo: data.Titulo,
      Autor: data.Autor,
      ISBN: data.ISBN,
      Descripcion: data.Descripcion,
      Stock: data.Stock,
    })
      .then((v) => {
        let body = v as ResBody;
        if (body.Err != "") {
          ctx.updateMssge("Error: " + body.Err);
        } else {
          ctx.updateMssge("Libro registrado");
        }
      })
      .catch((e) => {
        ctx.updateMssge("Error: " + e);
      });

    LibGetAll().then((v) => {
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
          <label htmlFor="Titulo">Titulo: </label>
          <input type="text" name="Titulo" onChange={DataFormChange} />
        </div>

        <div>
          <label htmlFor="Autor">Autor: </label>
          <input type="text" name="Autor" onChange={DataFormChange} />
        </div>

        <div>
          <label htmlFor="ISBN">ISBN: </label>
          <input type="text" name="ISBN" onChange={DataFormChange} />
        </div>

        <div>
          <label htmlFor="Descripcion">Descripcion: </label>
          <input type="text" name="Descripcion" onChange={DataFormChange} />
        </div>

        <div>
          <label htmlFor="Stock">Stock: </label>
          <input type="text" name="Stock" onChange={DataFormChange} />
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
function EliminarLibros(id: number, ctx: LibroContextValues) {
  LibDelById(id)
    .then((v) => {
      let body = v as ResBody;
      if (body.Err != "") {
        ctx.updateMssge("Error: " + body.Err);
      } else {
        ctx.updateMssge("Libro registrado");
      }
    })
    .catch((err) => {
      ctx.updateMssge("Error: " + err);
    });

  // Update
  LibGetAll().then((v) => {
    const body = v as ResBody;

    ctx.uploadList(body.Data);
  });
}

function RenderLibros(ctx: LibroContextValues, disponible: boolean) {
  if (ctx.list == null || ctx.list.length === 0) {
    return null;
  }
  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Titulo</th>
            <th>Autor</th>
            <th>Descripcion</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {ctx.list.map((v) =>
            disponible == (v.Stock != 0) ? (
              <tr className="libro">
                <td>{v.Id}</td>
                <td>{v.Titulo}</td>
                <td>{v.Autor}</td>
                <td>{v.Descripcion}</td>
                <td>{v.Stock}</td>
                <td className="table_opts">
                  <button
                    className="btn btn-danger"
                    onClick={() => EliminarLibros(v.Id, ctx)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ) : null
          )}
        </tbody>
      </table>
    </>
  );
}

function LibroComponent() {
  const ctx = useContext(LibroContext) as LibroContextValues;
  // Cuando se renderiza el componente
  useEffect(() => {
    // Actualizar lista
    LibGetAll().then((v) => {
      const body = v as ResBody;
      if (body.Err != "") {
        console.error(body.Err);
        return;
      }

      ctx.uploadList(body.Data);
    });
  }, []);

  // Variable para abrir ventana para crear usuario
  let [menu_user, update_menu_user] = useState(false);
  let [formData, setFormData] = useState<RegisterLibroForm>({
    Titulo: "",
    Autor: "",
    ISBN: "",
    Disponibilidad: true,
    Descripcion: "",
    Stock: 0,
  });

  return (
    <>
      <div id="estudiante_main">
        <div>
          <h1>LIBROS</h1>

          <h3>DISPONIBLES</h3>
          {RenderLibros(ctx, true)}

          <h3>OCUPADOS</h3>
          {RenderLibros(ctx, false)}

          <button
            className="btn btn-secondary"
            onClick={() => {
              if (menu_user) update_menu_user(false);
              else update_menu_user(true);
            }}
          >
            Registrar libro
          </button>
        </div>

        {CrearLibro(menu_user, update_menu_user, formData, setFormData, ctx)}

        <div>
          <h3 className="notif">{ctx.mssge}</h3>
        </div>
      </div>
    </>
  );
}

export { LibroComponent };
