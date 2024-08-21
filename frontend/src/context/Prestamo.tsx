import React, { createContext, useState } from "react";
import { Prestamo } from "../models/Prestamo";

interface PrestamoContextValues {
  list: Prestamo[];
  uploadList: React.Dispatch<React.SetStateAction<Prestamo[]>>;
  mssge: string;
  uploadMssge: React.Dispatch<React.SetStateAction<string>>;
}

const PrestamoContext = createContext<PrestamoContextValues | null>(null);

function PrestamoCtxProvider({ children }: React.PropsWithChildren<{}>) {
  const [list, uploadList] = useState<Prestamo[]>([]);
  const [mssge, uploadMssge] = useState<string>("");

  const values: PrestamoContextValues = {
    list: list,
    uploadList: uploadList,
    mssge: mssge,
    uploadMssge: uploadMssge,
  };

  return (
    <PrestamoContext.Provider value={values}>
      {children}
    </PrestamoContext.Provider>
  );
}

export { PrestamoCtxProvider, PrestamoContext };
export type { PrestamoContextValues };
