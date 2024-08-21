import { useEffect, useState } from "react";
import { Bibliotecario } from "../../models/Usuarios";

import { BibGetAll } from "../../../wailsjs/go/main/App";

function RenderBibliotecas(list: Bibliotecario[]) {
  if (list == null || list.length === 0) {
    return null;
  }
  return (
    <>
      {list.map((v) => (
        <div className="user bibliotecario">
          <p>{v.Nombre}</p>
          <p>{v.Apellido}</p>
          <p>{v.Correo}</p>
        </div>
      ))}
    </>
  );
}

function BibliotecarioComponent() {
  // Lista de estudiantes
  let [list, uploadList] = useState([] as Bibliotecario[]);

  // Cuando se renderiza el componente
  useEffect(() => {
    // Actualizar lista
    // BibGetAll().then((v) => uploadList(v));
  }, []);

  return (
    <>
      <h1>BIBLIOTECARIOS</h1>
      {RenderBibliotecas(list)}
    </>
  );
}

export { BibliotecarioComponent };
