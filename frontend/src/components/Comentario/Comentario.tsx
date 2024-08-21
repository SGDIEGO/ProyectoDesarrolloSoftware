import { useEffect, useState } from "react";
import { Multa_Estudiante, Multa_EstudianteDTO } from "../../models/Multa";
import { ComGetAll, MulGetAll, MulPagarById } from "../../../wailsjs/go/main/App";
import { ResBody } from "../../utils/response";
import { MultaIds } from "../../utils/data";
import { IComentario } from "../../models/Comentario";

export default function Comentario() {
  // Lista de multas por estudiante
  const [multas_estudiantes, actualizar_multas_estudiantes] = useState<
    IComentario[]
  >([]);
  const [error, actualizar_error] = useState("");

  // Funcion para obtener todas las multas
  function ComentariosGenerales() {
    ComGetAll()
      .then((res) => {
        const body = res as ResBody;
        if (body.Err != "") throw Error(body.Err);

        return body.Data;
      })
      .then((data: IComentario[]) => {
        // Actualizar data
        actualizar_multas_estudiantes(data);
      })
      .catch((e) => actualizar_error(e.message));
  }

  // Al cargar el componente
  useEffect(() => {
    ComentariosGenerales()
  }, []);

  // Componente
  return (
    <>
      <h1>COMENTARIOS</h1>

      <table className="table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Descripcion</th>
            <th>Fecha</th>
            <th>Id estudiante</th>
            <th>Valoracion</th>
          </tr>
        </thead>
        <tbody>
          {multas_estudiantes.map((m) => (
            <tr>
              <td>{m.Id}</td>
              <td>{m.Descripcion}</td>
              <td>{JSON.stringify(m.Fecha)}</td>
              <td>{m.Id_estudiante}</td>
              <td>{m.Id_valoracion}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {error != "" ? <p>{error}</p> : null}
    </>
  );
}
