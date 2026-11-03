import { useEffect, useState } from "react";
import App from "./App";
import Login from "./paginas/Login";
import {
  consultarSesion,
  salir,
  type Usuario,
} from "./servicios/autenticacion";

export default function AccesoApp() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [verificando, setVerificando] = useState(true);
  const [errorConexion, setErrorConexion] = useState("");

  useEffect(() => {
    consultarSesion()
      .then(setUsuario)
      .catch(() =>
        setErrorConexion(
          "No se pudo verificar la sesión. Comprueba que el backend esté iniciado.",
        ),
      )
      .finally(() => setVerificando(false));
  }, []);

  async function cerrarSesion() {
    await salir();
    setUsuario(null);
  }

  if (verificando)
    return <div className="pantalla-carga">Comprobando sesión...</div>;
  if (!usuario)
    return (
      <>
        <Login alIngresar={setUsuario} />
        {errorConexion && <div className="aviso-conexion">{errorConexion}</div>}
      </>
    );
  return <App key={usuario.id} usuario={usuario} cerrarSesion={cerrarSesion} />;
}
