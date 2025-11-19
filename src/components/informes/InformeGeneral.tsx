
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { Sale, Estado } from "../../types";
import { Card } from "../ui";

function groupBy<T>(arr: T[], key: keyof T | ((x: T) => string)) {
  const m = new Map<string, T[]>();
  for (const x of arr) {
    const k =
      typeof key === "function"
        ? (key as any)(x)
        : String((x as any)[key]);
    m.set(k, (m.get(k) || []).concat(x));
  }
  return m;
}

export function InformeGeneral({ rows }: { rows: Sale[] }) {
  const byDate = groupBy(rows, "fecha");
  const line = Array.from(byDate.keys())
    .sort()
    .map((fecha) => {
      const items = byDate.get(fecha)!;
      const c = (st: Estado) => items.filter((x: any) => x.estado === st).length;
      return {
        fecha,
        PENDIENTE: c("PENDIENTE"),
        APROBADO: c("APROBADO"),
        RECHAZADO: c("RECHAZADO"),
      };
    });

  const claro = rows.filter((s) => s.operador === "CLARO").length;
  const donutClaro = [
    { name: "NO", value: Math.max(0, rows.length - claro) },
    { name: "SI", value: claro },
  ];

  const byOp = groupBy(rows, "operador");
  const donutOp = (
    ["CLARO", "TIGO", "MOVISTAR", "VIRGIN", "WOM", "ETB", "OTROS"] as const
  )
    .map((op) => ({ name: op, value: (byOp.get(op) || []).length }))
    .filter((x) => x.value > 0);

  const asesores = Array.from(new Set(rows.map((s) => s.asesor)));
  const stacked = asesores.map((a) => {
    const r = rows.filter((s) => s.asesor === a);
    const obj: any = { asesor: a };
    for (const op of [
      "CLARO",
      "TIGO",
      "MOVISTAR",
      "VIRGIN",
      "WOM",
      "ETB",
      "OTROS",
    ] as const)
      obj[op] = r.filter((s) => s.operador === op).length;
    return obj;
  });

  return (
    <div className="row two" style={{ marginTop: 16 }}>
      <Card header="Ventas por Fecha">
        <div className="chart h-280">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={line}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="PENDIENTE"
                stroke="#8884d8"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="APROBADO"
                stroke="#10b981"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="RECHAZADO"
                stroke="#ef4444"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card header="Todo Claro">
        <div className="chart h-280">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutClaro}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={90}
              >
                {donutClaro.map((_, i) => (
                  <Cell key={i} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card header="Asesor por Operador">
        <div className="chart h-330">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stacked}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="asesor"
                interval={0}
                angle={-30}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Legend />
              <Tooltip />
              {(
                [
                  "CLARO",
                  "TIGO",
                  "MOVISTAR",
                  "VIRGIN",
                  "WOM",
                  "ETB",
                  "OTROS",
                ] as const
              ).map((op) => (
                <Bar key={op} dataKey={op} stackId="a" />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card header="Ventas por Operador">
        <div className="chart h-330">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={donutOp} dataKey="value" nameKey="name" outerRadius={110}>
                {donutOp.map((_, i) => (
                  <Cell key={i} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
