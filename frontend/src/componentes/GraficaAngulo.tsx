import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Punto } from "../tipos/medicion";
export default function GraficaAngulo({
  puntos,
  altura = 310,
}: {
  puntos: Punto[];
  altura?: number;
}) {
  return (
    <div style={{ height: altura, width: "100%", minWidth: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={puntos}
          margin={{ top: 12, right: 15, bottom: 12, left: 0 }}
        >
          <CartesianGrid stroke="#2a4356" strokeDasharray="3 5" />
          <XAxis
            dataKey="tiempo"
            type="number"
            domain={["dataMin", "dataMax"]}
            tick={{ fill: "#91a9ba", fontSize: 11 }}
            tickFormatter={(v) => Number(v).toFixed(0)}
            label={{
              value: "Tiempo (s)",
              position: "insideBottom",
              offset: -9,
              fill: "#91a9ba",
            }}
          />
          <YAxis
            width={48}
            tick={{ fill: "#91a9ba", fontSize: 11 }}
            label={{
              value: "Ángulo (°)",
              angle: -90,
              position: "insideLeft",
              fill: "#91a9ba",
            }}
          />
          <Tooltip
            contentStyle={{
              background: "#132b3c",
              color: "#fff",
              border: "1px solid #3d6073",
              borderRadius: 8,
            }}
            formatter={(v) => `${Number(v).toFixed(2)}°`}
            labelFormatter={(v) => `Tiempo: ${Number(v).toFixed(2)} s`}
          />
          <Legend verticalAlign="top" height={32} />
          <ReferenceLine
            y={0}
            stroke="#29e990"
            strokeDasharray="6 4"
            strokeWidth={2}
          />
          <Line
            name="Ángulo"
            type="monotone"
            dataKey="angulo"
            stroke="#00d7f9"
            strokeWidth={2.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
