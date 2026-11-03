import { MongoClient, type Collection, type ObjectId } from "mongodb";
import { configuracion } from "./configuracion.js";

export interface UsuarioDocumento {
  _id?: ObjectId;
  nombre: string;
  nombreUsuario?: string;
  correo?: string;
  claveHash: string;
  fechaCreacion: Date;
}

const cliente = new MongoClient(configuracion.mongoUri, {
  serverSelectionTimeoutMS: 10000,
});

export function usuarios(): Collection<UsuarioDocumento> {
  return cliente
    .db(configuracion.nombreBase)
    .collection<UsuarioDocumento>("usuarios");
}

export async function conectarBaseDatos() {
  await cliente.connect();
  const indices = await usuarios().indexes();
  const indiceCorreo = indices.find((indice) => indice.name === "correo_1");
  if (indiceCorreo && !indiceCorreo.sparse) {
    await usuarios().dropIndex("correo_1");
  }
  await usuarios().createIndex({ correo: 1 }, { unique: true, sparse: true });
  await usuarios().createIndex({ nombreUsuario: 1 }, { unique: true, sparse: true });
}

export async function cerrarBaseDatos() {
  await cliente.close();
}
