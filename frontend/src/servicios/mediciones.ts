import type { Medicion } from '../tipos/medicion'
const CLAVE='pendulo_mediciones_v1'
export function cargarMediciones():Medicion[] { try { const datos:unknown=JSON.parse(localStorage.getItem(CLAVE)??'[]'); return Array.isArray(datos)?datos as Medicion[]:[] } catch { return [] } }
export function persistirMediciones(mediciones:Medicion[]) { localStorage.setItem(CLAVE,JSON.stringify(mediciones)) }
