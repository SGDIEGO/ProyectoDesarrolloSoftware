import { createContext, useState } from "react";
import { Estudiante } from "../models/Usuarios";

interface EstudianteContextValues {
  list: Estudiante[];
  uploadList: React.Dispatch<React.SetStateAction<Estudiante[]>>;
  mssge: string;
  updateMssge: React.Dispatch<React.SetStateAction<string>>;
}

const EstudianteContext = createContext<EstudianteContextValues | null>(null);

function EstudianteCtxProvider({ children }: React.PropsWithChildren<{}>) {
  const [list, uploadList] = useState<Estudiante[]>([]);
  const [mssge, updateMssge] = useState("");
  const values: EstudianteContextValues = {
    list: list,
    uploadList: uploadList,
    mssge: mssge,
    updateMssge: updateMssge,
  };

  return (
    <EstudianteContext.Provider value={values}>
      {children}
    </EstudianteContext.Provider>
  );
}

export { EstudianteCtxProvider, EstudianteContext };
export type { EstudianteContextValues };
