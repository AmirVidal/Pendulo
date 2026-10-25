import { MongoClient, type Collection, type ObjectId } from "mongodb";
import { configuracion } from "./configuracion.js";

export interface UsuarioDocumento {
  _id?: ObjectId;
  nombre: string;
  correo: string;
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
  await usuarios().createIndex({ correo: 1 }, { unique: true });
}

export async function cerrarBaseDatos() {
  await cliente.close();
}
