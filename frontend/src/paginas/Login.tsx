import { useState, type FormEvent } from "react";
import { Activity, Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";
import { ingresar, registrar, type Usuario } from "../servicios/autenticacion";

export default function Login({
  alIngresar,
}: {
  alIngresar: (usuario: Usuario) => void;
}) {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [registro, setRegistro] = useState(false);
  const [mostrarClave, setMostrarClave] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setCargando(true);
    setError("");
    try {
      alIngresar(
        registro
          ? await registrar(nombreUsuario.trim(), clave)
          : await ingresar(nombreUsuario.trim(), clave),
      );
    } catch (fallo) {
      setError(
        fallo instanceof Error
          ? fallo.message
          : "No se pudo conectar al servidor.",
      );
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="pagina-login">
      <div className="decoracion-login" aria-hidden="true">
        <div className="orbita-login">
          <Activity size={64} />
        </div>
      </div>
      <section className="tarjeta-login" aria-labelledby="titulo-login">
        <div className="icono-login">
          <Activity size={30} />
        </div>
        <p className="etiqueta-login">SISTEMA DE MONITOREO</p>
        <h1 id="titulo-login">Control del Péndulo Invertido</h1>
        <p className="descripcion-login">
          {registro
            ? "Crea tu cuenta para acceder al panel de control."
            : "Ingresa con tu usuario y contraseña para continuar."}
        </p>
        <form onSubmit={enviar}>
          <label htmlFor="usuario-login">Nombre de usuario</label>
          <div className="entrada-login">
            <UserRound size={18} />
            <input
              id="usuario-login"
              type="text"
              autoComplete="username"
              placeholder={registro ? "Ejemplo: harold_01" : "Tu usuario o correo"}
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              required
              minLength={registro ? 3 : undefined}
              maxLength={registro ? 30 : 254}
              pattern={registro ? "[a-zA-Z0-9_]+" : undefined}
            />
          </div>
          <label htmlFor="clave-login">Contraseña</label>
          <div className="entrada-login">
            <LockKeyhole size={18} />
            <input
              id="clave-login"
              type={mostrarClave ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Tu contraseña"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              required
              minLength={registro ? 12 : undefined}
              maxLength={200}
            />
            <button
              type="button"
              aria-label={
                mostrarClave ? "Ocultar contraseña" : "Mostrar contraseña"
              }
              onClick={() => setMostrarClave(!mostrarClave)}
            >
              {mostrarClave ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {error && (
            <p className="error-login" role="alert">
              {error}
            </p>
          )}
          <button
            className="boton principal enviar-login"
            type="submit"
            disabled={cargando}
          >
            {cargando ? "Verificando..." : registro ? "Crear cuenta" : "Iniciar sesión"}
          </button>
        </form>
        <button
          className="alternar-login"
          type="button"
          onClick={() => {
            setRegistro(!registro);
            setError("");
            setClave("");
          }}
        >
          {registro ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate"}
        </button>
        <p className="pie-login">
          Acceso autorizado · Control y monitoreo de laboratorio
        </p>
      </section>
    </main>
  );
}
