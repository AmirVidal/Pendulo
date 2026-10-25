import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { usuarios } from "./baseDatos.js";
import { generarToken, verificarToken } from "./autenticacion.js";
import { configuracion } from "./configuracion.js";

export const rutasAutenticacion = Router();
const nombreCookie = "sesion_pendulo";
const opcionesCookie = {
  httpOnly: true,
  secure: configuracion.produccion,
  sameSite: "strict" as const,
  path: "/",
};

function respuestaUsuario(usuario: {
  _id?: ObjectId;
  nombre: string;
  nombreUsuario?: string;
  correo?: string;
}) {
  return {
    id: usuario._id!.toHexString(),
    nombre: usuario.nombre,
    nombreUsuario: usuario.nombreUsuario ?? usuario.correo ?? usuario.nombre,
    correo: usuario.correo ?? "",
  };
}

rutasAutenticacion.post(
  "/registro",
  rateLimit({ windowMs: 60 * 60_000, limit: 5 }),
  async (req, res, next) => {
    try {
      const { nombreUsuario, clave } = req.body ?? {};
      if (
        typeof nombreUsuario !== "string" ||
        !/^[a-zA-Z0-9_]{3,30}$/.test(nombreUsuario) ||
        typeof clave !== "string" ||
        clave.length < 12 ||
        clave.length > 200
      ) {
        res.status(400).json({
          mensaje: "Usa un nombre de 3 a 30 caracteres (letras, números o _) y una contraseña de al menos 12 caracteres.",
        });
        return;
      }

      const normalizado = nombreUsuario.toLowerCase();
      if (await usuarios().findOne({ nombreUsuario: normalizado })) {
        res.status(409).json({ mensaje: "Ese nombre de usuario ya está registrado." });
        return;
      }

      const resultado = await usuarios().insertOne({
        nombre: nombreUsuario,
        nombreUsuario: normalizado,
        claveHash: await bcrypt.hash(clave, 12),
        fechaCreacion: new Date(),
      });

      const token = await generarToken(resultado.insertedId.toHexString());
      res.cookie(nombreCookie, token, { ...opcionesCookie, maxAge: 8 * 60 * 60_000 });
      res.status(201).json({
        usuario: respuestaUsuario({ _id: resultado.insertedId, nombre: nombreUsuario, nombreUsuario: normalizado }),
      });
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
        res.status(409).json({ mensaje: "Ese nombre de usuario ya está registrado." });
        return;
      }
      next(error);
    }
  },
);

rutasAutenticacion.post(
  "/login",
  rateLimit({ windowMs: 15 * 60_000, limit: 10 }),
  async (req, res, next) => {
    try {
      const { identificador, clave } = req.body ?? {};
      if (
        typeof identificador !== "string" ||
        typeof clave !== "string" ||
        !identificador.trim() ||
        !clave ||
        identificador.length > 254 ||
        clave.length > 200
      ) {
        res
          .status(400)
          .json({ mensaje: "Ingresa tu usuario y contraseña." });
        return;
      }

      const valor = identificador.trim().toLowerCase();
      const usuario = await usuarios().findOne({
        $or: [{ nombreUsuario: valor }, { correo: valor }],
      });
      const valido = usuario
        ? await bcrypt.compare(clave, usuario.claveHash)
        : false;
      if (!usuario?._id || !valido) {
        res.status(401).json({ mensaje: "Usuario o contraseña incorrectos." });
        return;
      }

      const token = await generarToken(usuario._id.toHexString());
      res.cookie(nombreCookie, token, {
        ...opcionesCookie,
        maxAge: 8 * 60 * 60_000,
      });
      res.json({ usuario: respuestaUsuario(usuario) });
    } catch (error) {
      next(error);
    }
  },
);

rutasAutenticacion.get("/me", async (req, res, next) => {
  try {
    const token = req.cookies?.[nombreCookie];
    const id = typeof token === "string" ? await verificarToken(token) : null;
    if (!id || !ObjectId.isValid(id)) {
      res.status(401).json({ mensaje: "Sesión no válida." });
      return;
    }
    const usuario = await usuarios().findOne({ _id: new ObjectId(id) });
    if (!usuario?._id) {
      res.status(401).json({ mensaje: "Usuario no encontrado." });
      return;
    }
    res.json({ usuario: respuestaUsuario(usuario) });
  } catch (error) {
    next(error);
  }
});

rutasAutenticacion.post("/logout", (_req, res) => {
  res.clearCookie(nombreCookie, opcionesCookie);
  res.json({ mensaje: "Sesión cerrada." });
});
