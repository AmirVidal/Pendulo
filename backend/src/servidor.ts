import express, { type ErrorRequestHandler } from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { configuracion } from "./configuracion.js";
import { conectarBaseDatos, cerrarBaseDatos } from "./baseDatos.js";
import { rutasAutenticacion } from "./rutasAutenticacion.js";

const aplicacion = express();
aplicacion.disable("x-powered-by");
aplicacion.use(helmet());
aplicacion.use(express.json({ limit: "16kb" }));
aplicacion.use(cookieParser());

aplicacion.use((req, res, next) => {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    if (req.get("origin") !== configuracion.origen) {
      res.status(403).json({ mensaje: "Origen no autorizado." });
      return;
    }
  }
  next();
});

aplicacion.use("/api/auth", rutasAutenticacion);
aplicacion.get("/api/salud", (_req, res) => res.json({ estado: "ok" }));

const manejarError: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error("Error del servidor:", error);
  res.status(500).json({ mensaje: "Error interno del servidor." });
};
aplicacion.use(manejarError);

async function iniciar() {
  await conectarBaseDatos();
  const servidor = aplicacion.listen(configuracion.puerto, () => {
    console.log(
      `Servidor iniciado en http://localhost:${configuracion.puerto}`,
    );
  });

  const cerrar = () =>
    servidor.close(() => {
      void cerrarBaseDatos().then(() => process.exit(0));
    });
  process.on("SIGINT", cerrar);
  process.on("SIGTERM", cerrar);
}

iniciar().catch((error) => {
  console.error("No se pudo conectar al servidor o MongoDB:", error);
  process.exit(1);
});
