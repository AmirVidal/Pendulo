import { SignJWT, jwtVerify } from "jose";
import { configuracion } from "./configuracion.js";

const secreto = new TextEncoder().encode(configuracion.secreto);
const emisor = "control-pendulo-invertido";

export function generarToken(id: string): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(id)
    .setIssuer(emisor)
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secreto);
}

export async function verificarToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, secreto, { issuer: emisor });
    return payload.sub ?? null;
  } catch {
    return null;
  }
}
