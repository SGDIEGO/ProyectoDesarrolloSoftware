import { useContext, useState } from "react";
import { BibGetById } from "../../../wailsjs/go/main/App";

import "./Login.css";
import { ResBody } from "../../utils/response";
import { AppContext } from "../../context/App";

interface Session {
  Id_usuario: number;
  Nombre: string;
  Apellido: string;
  Correo: string;
  Direccion: string;
  Dni: string;
  Contraseña: string;
  Turno: number;
}

interface LoginForm {
  Correo: string;
  Contraseña: string;
}

function Login({
  loggState,
}: {
  loggState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}) {
  let [loginForm, setLoginForm] = useState<LoginForm>({
    Correo: "",
    Contraseña: "",
  });

  let Appctx = useContext(AppContext);
  let [errLogg, seterrLog] = useState("");

  function SubmitData() {
    // Validar
    let errores = "";

    if (loginForm.Correo == "" || !loginForm.Correo.includes("@")) {
      errores += "Correo invalido";
    }

    if (loginForm.Contraseña == "") {
      errores += "Contraseña invalida";
    }

    if (errores != "") {
      seterrLog(errores);
      return;
    }

    // Obtener por Id
    BibGetById(loginForm!)
      .then((data) => {
        console.log(data);

        const body = data as ResBody;
        // Data es null, no se encontro el usuario
        if (body.Data === null || body.Err != "") {
          seterrLog(
            "No existe bibliotecario con ese correo y/o contraseña\nError: " +
              body.Err
          );
          return;
        }

        // Cambiar estado a usuario loggeado
        Appctx?.updateSession(body.Data);
        loggState[1](true);
      })
      .catch((e) => {
        seterrLog(e);
      });
  }

  function DataFormChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setLoginForm((prev) => ({ ...(prev as LoginForm), [name]: value }));
  }
  return (
    <>
      <section className="vh-100 gradient-custom">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div
                className="card bg-dark text-white"
                style={{ borderRadius: "1rem" }}
              >
                <div className="card-body p-5 text-center">
                  <div className="mb-md-5 mt-md-4 pb-5">
                    <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                    <p className="text-white-50 mb-5">
                      Ingrese correo y contraseña
                    </p>

                    <div
                      data-mdb-input-init
                      className="form-outline form-white mb-4"
                    >
                      <input
                        type="email"
                        id="Correo"
                        className="form-control form-control-lg"
                        name="Correo"
                        required
                        onChange={DataFormChange}
                      />
                      <label className="form-label" htmlFor="Correo">
                        Correo
                      </label>
                    </div>

                    <div
                      data-mdb-input-init
                      className="form-outline form-white mb-4"
                    >
                      <input
                        type="password"
                        id="Contraseña"
                        className="form-control form-control-lg"
                        name="Contraseña"
                        required
                        onChange={DataFormChange}
                      />
                      <label className="form-label" htmlFor="Contraseña">
                        Contraseña
                      </label>
                    </div>

                    <button
                      data-mdb-button-init
                      data-mdb-ripple-init
                      className="btn btn-outline-light btn-lg px-5"
                      onClick={SubmitData}
                    >
                      Aceptar
                    </button>

                    <div className="d-flex justify-content-center text-center mt-4 pt-1">
                      <a href="#!" className="text-white">
                        <i className="fab fa-facebook-f fa-lg"></i>
                      </a>
                      <a href="#!" className="text-white">
                        <i className="fab fa-twitter fa-lg mx-4 px-2"></i>
                      </a>
                      <a href="#!" className="text-white">
                        <i className="fab fa-google fa-lg"></i>
                      </a>
                    </div>
                  </div>

                  {/* <div>
                    <p className="mb-0">
                      Don't have an account?{" "}
                      <a href="#!" className="text-white-50 fw-bold">
                        Sign Up
                      </a>
                    </p>
                  </div> */}
                </div>
              </div>
              {errLogg != "" ? (
                <div
                  className="alert alert-warning alert-dismissible fade show"
                  role="alert"
                >
                  <strong>{errLogg}</strong>
                  <button
                    type="button"
                    className="btn btn-close"
                    data-dismiss="alert"
                    aria-label="Close"
                    onClick={() => seterrLog("")}
                  ></button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export { Login };
