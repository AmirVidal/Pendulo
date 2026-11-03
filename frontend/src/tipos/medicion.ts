export type Ganancias = { k1: number; k2: number; k3: number; k4: number };
export type Punto = { tiempo: number; angulo: number; posicion: number };
export type Estado = "Estable" | "Corrigiendo" | "Fuera de rango";
export type Medicion = {
  id: string;
  fecha: string;
  duracion: number;
  anguloMaximo: number;
  ganancias: Ganancias;
  estado: Estado;
  puntos: Punto[];
};
export const gananciasIniciales: Ganancias = {
  k1: 12.5,
  k2: 3.8,
  k3: 18.2,
  k4: 4.6,
};
export function estadoDe(angulo: number, posicion: number): Estado {
  return Math.abs(angulo) > 15 || Math.abs(posicion) > 40.8
    ? "Fuera de rango"
    : Math.abs(angulo) > 3 || Math.abs(posicion) > 15
      ? "Corrigiendo"
      : "Estable";
}
export function duracionTexto(segundos: number) {
  return `${String(Math.floor(segundos / 60)).padStart(2, "0")}:${String(Math.floor(segundos % 60)).padStart(2, "0")}`;
}
