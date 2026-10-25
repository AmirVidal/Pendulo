import bcrypt from "bcryptjs";
import { conectarBaseDatos, cerrarBaseDatos, usuarios } from "./baseDatos.js";

async function crearUsuario() {
  const nombre = process.env.USUARIO_INICIAL_NOMBRE?.trim();
  const correo = process.env.USUARIO_INICIAL_CORREO?.trim().toLowerCase();
  const clave = process.env.USUARIO_INICIAL_CLAVE;

  if (
    !nombre ||
    !correo ||
    !correo.includes("@") ||
    !clave ||
    clave.length < 12
  ) {
    throw new Error(
      "Configura nombre, correo y una contraseña inicial de al menos 12 caracteres en .env",
    );
  }
  await conectarBaseDatos();
  if (await usuarios().findOne({ correo }))
    throw new Error("El usuario ya existe y no se modificó");
  await usuarios().insertOne({
    nombre,
    correo,
    claveHash: await bcrypt.hash(clave, 12),
    fechaCreacion: new Date(),
  });
  console.log("Usuario creado. Elimina USUARIO_INICIAL_CLAVE de tu .env.");
}

crearUsuario()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => void cerrarBaseDatos());
