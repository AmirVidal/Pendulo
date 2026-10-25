import "dotenv/config";

function obligatoria(nombre: string): string {
  const valor = process.env[nombre]?.trim();
  if (!valor) throw new Error(`Falta ${nombre} en backend/.env`);
  return valor;
}

export const configuracion = {
  puerto: Number(process.env.PUERTO ?? 3000),
  mongoUri: obligatoria("MONGODB_URI"),
  nombreBase: process.env.MONGODB_BD?.trim() || "pendulo",
  secreto: obligatoria("JWT_SECRETO"),
  origen: process.env.ORIGEN_FRONTEND || "http://localhost:5173",
  produccion: process.env.ENTORNO === "produccion",
};

if (configuracion.secreto.length < 32)
  throw new Error("JWT_SECRETO debe tener 32 caracteres o más");
if (!Number.isInteger(configuracion.puerto) || configuracion.puerto < 1)
  throw new Error("PUERTO inválido");
