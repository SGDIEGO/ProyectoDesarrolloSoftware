import { createContext, useState } from "react";
import { Libro } from "../models/Libro";
import { Bibliotecario } from "../models/Usuarios";

interface AppContextValues {
  session: Bibliotecario;
  updateSession: React.Dispatch<React.SetStateAction<Bibliotecario>>;
}

const AppContext = createContext<AppContextValues | null>(null);

function AppCtxProvider({ children }: React.PropsWithChildren<{}>) {
  let [session, updateSession] = useState({} as Bibliotecario);
  
  const values: AppContextValues = {
    session: session,
    updateSession: updateSession,
  };

  return (
    <AppContext.Provider value={values}>{children}</AppContext.Provider>
  );
}

export { AppCtxProvider, AppContext };
export type { AppContextValues };
