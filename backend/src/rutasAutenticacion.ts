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

rutasAutenticacion.post(
  "/login",
  rateLimit({ windowMs: 15 * 60_000, limit: 10 }),
  async (req, res, next) => {
    try {
      const { correo, clave } = req.body ?? {};
      if (
        typeof correo !== "string" ||
        typeof clave !== "string" ||
        !correo.trim() ||
        !clave ||
        correo.length > 254 ||
        clave.length > 200
      ) {
        res
          .status(400)
          .json({ mensaje: "Ingresa un correo y contraseña válidos." });
        return;
      }

      const usuario = await usuarios().findOne({
        correo: correo.trim().toLowerCase(),
      });
      const valido = usuario
        ? await bcrypt.compare(clave, usuario.claveHash)
        : false;
      if (!usuario?._id || !valido) {
        res.status(401).json({ mensaje: "Correo o contraseña incorrectos." });
        return;
      }

      const token = await generarToken(usuario._id.toHexString());
      res.cookie(nombreCookie, token, {
        ...opcionesCookie,
        maxAge: 8 * 60 * 60_000,
      });
      res.json({
        usuario: {
          id: usuario._id.toHexString(),
          nombre: usuario.nombre,
          correo: usuario.correo,
        },
      });
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
    res.json({
      usuario: { id, nombre: usuario.nombre, correo: usuario.correo },
    });
  } catch (error) {
    next(error);
  }
});

rutasAutenticacion.post("/logout", (_req, res) => {
  res.clearCookie(nombreCookie, opcionesCookie);
  res.json({ mensaje: "Sesión cerrada." });
});
