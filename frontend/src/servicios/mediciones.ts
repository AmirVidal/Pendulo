import type { Medicion } from "../tipos/medicion";
const CLAVE = "pendulo_mediciones_v2";
function claveUsuario(id: string) {
  return `${CLAVE}_${id}`;
}

export function cargarMediciones(id: string): Medicion[] {
  try {
    const datos: unknown = JSON.parse(
      localStorage.getItem(claveUsuario(id)) ?? "[]",
    );
    return Array.isArray(datos) ? (datos as Medicion[]) : [];
  } catch {
    return [];
  }
}
export function persistirMediciones(id: string, mediciones: Medicion[]) {
  localStorage.setItem(claveUsuario(id), JSON.stringify(mediciones));
}
