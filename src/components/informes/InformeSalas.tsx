
import { useMemo } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { Sale, User } from "../../types";
import { fmt, isSameDay } from "../../utils";
import { Card, Progress } from "../ui";

export function InformeSalas({
  rows,
  users,
}: {
  rows: Sale[];
  users: User[];
}) {
  const tabla = useMemo(() => {
    const m = new Map<string, any>();
    for (const s of rows) {
      const r = m.get(s.asesor) || {
        asesor: s.asesor,
        porta: 0,
        migra: 0,
        acumuladas: 0,
        meta: users.find((u) => u.name === s.asesor)?.metas?.mensual || 40,
        faltan: 0,
        presupuesto:
          users.find((u) => u.name === s.asesor)?.metas?.presupuesto || 0,
      };
      if (s.estado === "APROBADO") {
        if (s.tipo === "PORTABILIDAD") r.porta++;
        if (s.tipo === "MIGRA") r.migra++;
        r.acumuladas++;
      }
      m.set(s.asesor, r);
    }
    const arr = Array.from(m.values());
    arr.forEach((r: any) => {
      r.faltan = Math.max(0, (r.meta || 0) - (r.acumuladas || 0));
    });
    return arr;
  }, [rows, users]);

  const totals = tabla.reduce(
    (a: any, r: any) => ({
      porta: a.porta + r.porta,
      migra: a.migra + r.migra,
      acumuladas: a.acumuladas + r.acumuladas,
      meta: a.meta + r.meta,
      faltan: a.faltan + r.faltan,
      presupuesto: a.presupuesto + r.presupuesto,
    }),
    { porta: 0, migra: 0, acumuladas: 0, meta: 0, faltan: 0, presupuesto: 0 }
  );

  const pendientesHoy = rows.filter(
    (s) => s.estado === "PENDIENTE" && isSameDay(s.fecha)
  ).length;
  const okHoy = rows.filter(
    (s) => s.estado === "APROBADO" && isSameDay(s.fecha)
  ).length;

  return (
    <div className="row two" style={{ marginTop: 16 }}>
      <Card>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {[
                  "AGENTE",
                  "Porta",
                  "Migra",
                  "Acumuladas",
                  "Meta",
                  "Te Faltan",
                  "Presupuesto Diario",
                ].map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tabla.map((r: any, i: number) => (
                <tr key={i} style={{ background: i % 2 ? "#fafafa" : "#fff" }}>
                  <td style={{ fontWeight: 600 }}>{r.asesor}</td>
                  <td>{r.porta}</td>
                  <td>{r.migra}</td>
                  <td>{r.acumuladas}</td>
                  <td>{r.meta}</td>
                  <td>{r.faltan}</td>
                  <td>{r.presupuesto}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td>Total</td>
                <td>{fmt(totals.porta)}</td>
                <td>{fmt(totals.migra)}</td>
                <td>{fmt(totals.acumuladas)}</td>
                <td>{fmt(totals.meta)}</td>
                <td>{fmt(totals.faltan)}</td>
                <td>{fmt(totals.presupuesto)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      <div className="row one responsive-gap">
        <Card header="Presupuesto Diario">
          <div className="kpi-title">Hoy</div>
          <div className="kpi-value">13</div>
        </Card>
        <Card header="Agentes">
          <div className="kpi-title">Activos</div>
          <div className="kpi-value">
            {fmt(new Set(rows.map((r: any) => r.asesor)).size)}
          </div>
        </Card>
        <Card header="Pendientes Hoy">
          <div className="chart h-220">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                {((): any => {
                  const data = [
                    { name: "Ventas Can.", value: okHoy },
                    { name: "Pendiente", value: pendientesHoy },
                  ];
                  return (
                    <>
                      <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={60}
                        outerRadius={50}
                      >
                        {data.map((_, i) => (
                          <Cell key={i} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip />
                    </>
                  );
                })()}
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card header="Meta">
          <div className="kpi-title">Cumplimiento Diario</div>
          <div className="kpi-value">0 %</div>
          <div style={{ marginTop: 8 }}>
            <Progress value={20} />
          </div>
        </Card>
      </div>
    </div>
  );
}
