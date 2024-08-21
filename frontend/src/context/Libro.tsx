import { createContext, useState } from "react";
import { Libro } from "../models/Libro";

interface LibroContextValues {
  list: Libro[];
  uploadList: React.Dispatch<React.SetStateAction<Libro[]>>;
  mssge: string;
  updateMssge: React.Dispatch<React.SetStateAction<string>>;
}

const LibroContext = createContext<LibroContextValues | null>(null);

function LibroCtxProvider({ children }: React.PropsWithChildren<{}>) {
  let [list, uploadList] = useState([] as Libro[]);
  let [mssge, updateMssge] = useState("");
  const values: LibroContextValues = {
    list: list,
    uploadList: uploadList,
    mssge: mssge,
    updateMssge: updateMssge
  };

  return (
    <LibroContext.Provider value={values}>{children}</LibroContext.Provider>
  );
}

export { LibroCtxProvider, LibroContext };
export type { LibroContextValues };
