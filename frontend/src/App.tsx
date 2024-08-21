import { useContext, useEffect, useState } from "react";
import "./App.css";
import menuSVG from "./menu.svg";
import untLogo from "./unt.png";

// Componentes
import { EstudianteComponent } from "./components/Usuario/Estudiante";
import { LibroComponent } from "./components/Libros/Libro";
import { PrestamoComponent } from "./components/Prestamos/Prestamo";

// Contexts
import { EstudianteCtxProvider } from "./context/Estudiante";
import { LibroCtxProvider } from "./context/Libro";
import { PrestamoCtxProvider } from "./context/Prestamo";
import { Login } from "./components/Login/Login";
import { CloseSession, OpenBrowser } from "../wailsjs/go/main/App";
import { Bibliotecario } from "./models/Usuarios";
import { AppContext } from "./context/App";
import MultaComponent from "./components/Multas/Multa";
import Comentario from "./components/Comentario/Comentario";

function Service(opt: string) {
  switch (opt) {
    // Usuarios Registro
    case "service1":
      return (
        <EstudianteCtxProvider>
          <EstudianteComponent />
        </EstudianteCtxProvider>
      );

    // Libros registro
    case "service2":
      return (
        <LibroCtxProvider>
          <LibroComponent />
        </LibroCtxProvider>
      );

    // Prestamos registro
    case "service3":
      return (
        <PrestamoCtxProvider>
          <PrestamoComponent />
        </PrestamoCtxProvider>
      );

    case "service4":
      return <MultaComponent />;

    case "service5":
      return <Comentario />;
    default:
      return null;
  }
}

function App() {
  // Autenticacion
  let ctx = useContext(AppContext);

  // Actualizacion de servicio
  let [currService, uploadService] = useState("");
  let [menu_visible, toggle_menu] = useState(true);
  let [logged, setLoggein] = useState(false);

  // Funcion para cambio de servicio
  const changeService = (e: any) => {
    // Id del servicio elegido
    let target = e.target.id;

    if (target !== currService) uploadService(target);
  };

  // Esconder/ Mostrar menu
  const toggleClick = () => {
    if (menu_visible) toggle_menu(false);
    else toggle_menu(true);
  };

  function ShowMenu() {
    return (
      <>
        <div className="">
          <div className="dropdown">
            <button
              className="btn btn-primary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Menu
            </button>

            <ul className="dropdown-menu">
              <li>
                <button
                  className="dropdown-item"
                  type="button"
                  id="service1"
                  onClick={changeService}
                >
                  Estudiantes
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  type="button"
                  id="service2"
                  onClick={changeService}
                >
                  Libros
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  type="button"
                  id="service3"
                  onClick={changeService}
                >
                  Prestamos
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  type="button"
                  id="service4"
                  onClick={changeService}
                >
                  Multas
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  type="button"
                  id="service5"
                  onClick={changeService}
                >
                  Comentarios
                </button>
              </li>
            </ul>
          </div>
        </div>
      </>
    );
  }

  function CerrarSesion() {
    // Eliminar item de localstorage
    CloseSession();

    // Actualizar estado de loggeo
    setLoggein(false);
  }

  function LinkPagina(event: any) {
    event.preventDefault();
    var href = event.target.href;

    // Abrir url en navegador
    OpenBrowser(href);
  }

  function Main() {
    return (
      <>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          {ShowMenu()}

          <h4 className="position-absolute end-0 m-1 navbar-brand">
            Bienvenido/a {ctx?.session.Nombre} {ctx?.session.Apellido}
            <button
              className="btn btn-close"
              onClick={() => {
                CerrarSesion();
              }}
            ></button>
          </h4>
        </nav>

        <div id="main">{Service(currService)}</div>

        <div id="footer">
          <footer>
            <img src={untLogo} alt="UNT" />
            <div id="footer_ref">
              <a
                href="https://l.facebook.com/l.php?u=http%3A%2F%2Fwww.unitru.edu.pe%2F%3Ffbclid%3DIwZXh0bgNhZW0CMTAAAR0yA88VSwEjxLJTKIoqEQujN7PJ_AYvrWi2yh5jL_R8HlkDO1Prt_DSA9c_aem_geoT6SNoLg_Gtb71Dkk2pg&h=AT3NMBSUyJ-9KI2i-iSxBWnI94rMAKO1-3zH3j99Ub1qR_mLnrhj2_WA_rLN9hwjNdkvg9MGM_uNDVQobIjNvcP5ES4FMT7ej-qfn3b4uRoPJBFrzbBZgsFeWxNdkB_Jt0kVCX0YIsieI3Q3aipi5g"
                onClick={(e) => LinkPagina(e)}
              >
                UNT - pagina
              </a>
              <a
                href="https://www.facebook.com/untlaunicaoficial/?locale=es_LA"
                onClick={(e) => LinkPagina(e)}
              >
                UNT - facebook
              </a>
              <a
                href="https://inf.unitru.edu.pe/"
                onClick={(e) => LinkPagina(e)}
              >
                INFORMATICA - UNT
              </a>
            </div>
          </footer>
        </div>
      </>
    );
  }

  return (
    <div>{logged ? Main() : <Login loggState={[logged, setLoggein]} />}</div>
  );
}

export default App;
