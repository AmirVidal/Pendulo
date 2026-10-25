export interface Usuario {
  id: string;
  nombre: string;
  nombreUsuario: string;
  correo: string;
}

async function obtenerRespuesta(
  respuesta: Response,
): Promise<{ usuario: Usuario }> {
  const datos = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok)
    throw new Error(datos.mensaje || "No se pudo completar la solicitud.");
  return datos as { usuario: Usuario };
}

export async function ingresar(
  identificador: string,
  clave: string,
): Promise<Usuario> {
  const respuesta = await fetch("/api/auth/login", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identificador, clave }),
  });
  return (await obtenerRespuesta(respuesta)).usuario;
}

export async function registrar(
  nombreUsuario: string,
  clave: string,
): Promise<Usuario> {
  const respuesta = await fetch("/api/auth/registro", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombreUsuario, clave }),
  });
  return (await obtenerRespuesta(respuesta)).usuario;
}

export async function consultarSesion(): Promise<Usuario | null> {
  const respuesta = await fetch("/api/auth/me", { credentials: "same-origin" });
  if (respuesta.status === 401) return null;
  return (await obtenerRespuesta(respuesta)).usuario;
}

export async function salir(): Promise<void> {
  const respuesta = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "same-origin",
  });
  if (!respuesta.ok) throw new Error("No se pudo cerrar la sesión.");
}
