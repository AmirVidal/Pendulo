import { useState, type FormEvent } from "react";
import { Activity, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { ingresar, type Usuario } from "../servicios/autenticacion";

export default function Login({
  alIngresar,
}: {
  alIngresar: (usuario: Usuario) => void;
}) {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [mostrarClave, setMostrarClave] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setCargando(true);
    setError("");
    try {
      alIngresar(await ingresar(correo.trim(), clave));
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
          Ingresa tus credenciales para acceder al panel de control y las
          mediciones.
        </p>
        <form onSubmit={enviar}>
          <label htmlFor="correo-login">Correo electrónico</label>
          <div className="entrada-login">
            <Mail size={18} />
            <input
              id="correo-login"
              type="email"
              autoComplete="username"
              placeholder="usuario@ejemplo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              maxLength={254}
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
            {cargando ? "Verificando..." : "Iniciar sesión"}
          </button>
        </form>
        <p className="pie-login">
          Acceso autorizado · Control y monitoreo de laboratorio
        </p>
      </section>
    </main>
  );
}
