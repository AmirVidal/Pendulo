import { useEffect, useState } from "react";
import { gananciasIniciales } from "../tipos/medicion";
import type { Ganancias } from "../tipos/medicion";
export default function PanelGanancias({
  ganancias,
  aplicar,
  bloqueado,
}: {
  ganancias: Ganancias;
  aplicar: (g: Ganancias) => void;
  bloqueado: boolean;
}) {
  const [valores, setValores] = useState(ganancias);
  useEffect(() => setValores(ganancias), [ganancias]);
  return (
    <>
      <div className="campos-ganancias">
        {(["k1", "k2", "k3", "k4"] as const).map((k) => (
          <label key={k}>
            <span>{k.toUpperCase()}</span>
            <input
              type="number"
              step="0.1"
              value={Number.isNaN(valores[k]) ? "" : valores[k]}
              disabled={bloqueado}
              onChange={(e) =>
                setValores({
                  ...valores,
                  [k]: e.target.value === "" ? NaN : Number(e.target.value),
                })
              }
            />
          </label>
        ))}
      </div>
      <div className="botones-ganancias">
        <button
          className="boton principal"
          disabled={bloqueado || !Object.values(valores).every(Number.isFinite)}
          onClick={() => aplicar({ ...valores })}
        >
          Aplicar
        </button>
        <button
          className="boton secundario"
          disabled={bloqueado}
          onClick={() => {
            setValores({ ...gananciasIniciales });
            aplicar({ ...gananciasIniciales });
          }}
        >
          Restablecer
        </button>
      </div>
    </>
  );
}
