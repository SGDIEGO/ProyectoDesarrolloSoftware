import { useEffect, useState } from "react";
import { Multa_Estudiante, Multa_EstudianteDTO } from "../../models/Multa";
import { MulGetAll, MulPagarById } from "../../../wailsjs/go/main/App";
import { ResBody } from "../../utils/response";
import { MultaIds } from "../../utils/data";

export default function MultaComponent() {
  // Lista de multas por estudiante
  const [multas_estudiantes, actualizar_multas_estudiantes] = useState<
    Multa_EstudianteDTO[]
  >([]);
  const [error, actualizar_error] = useState("");

  // Funcion para obtener todas las multas
  function MultasGenerales() {
    MulGetAll()
      .then((res) => {
        const body = res as ResBody;
        if (body.Err != "") throw Error(body.Err);

        return body.Data;
      })
      .then((data: Multa_EstudianteDTO[]) => {
        // Actualizar data
        actualizar_multas_estudiantes(data);
      })
      .catch((e) => actualizar_error(e.message));
  }

  // Funcion para pagar multa
  function PagarMultaFunc(id: number) {
    MulPagarById(id)
      .then((res) => {
        const body = res as ResBody;
        if (body.Err != "") {
          throw new Error(body.Err);
        }

        MultasGenerales();
      })
      .catch((e) => {
        actualizar_error(e.message);
      });
  }

  // Al cargar el componente
  useEffect(() => {
    MultasGenerales();
  }, []);

  // Componente
  return (
    <>
      <h1>MULTAS</h1>

      <table className="table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Estado</th>
            <th>Estudiante</th>
            <th>Multa</th>
          </tr>
        </thead>
        <tbody>
          {multas_estudiantes.map((m) => (
            <tr>
              <td>{m.Id}</td>
              <td>{m.Estado}</td>
              <td>{m.Estudiante}</td>
              <td>{m.Multa}</td>
              {m.Estado == "No pagado" ? (
                <td>
                  <button
                    className="btn btn-success"
                    onClick={() => PagarMultaFunc(m.Id)}
                  >
                    Pagar
                  </button>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
      {error != "" ? <p>{error}</p> : null}
    </>
  );
}
