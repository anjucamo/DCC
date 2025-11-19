
import { useMemo } from "react";
import { Sale, User } from "../../types";
import { fmt, pct } from "../../utils";

export function InformePrincipal({
  rows,
  users,
}: {
  rows: Sale[];
  users: User[];
}) {
  const tabla = useMemo(() => {
    const map = new Map<string, any>();
    rows.forEach((r) => {
      const meta = users.find((u) => u.name === r.asesor)?.metas?.mensual || 40;
      const cur = map.get(r.asesor) || {
        agente: r.asesor,
        porta: 0,
        migra: 0,
        pendMov: 0,
        descMov: 0,
        meta,
        servHogar: 0,
        ventHogar: 0,
        pendHogar: 0,
        descHogar: 0,
        metaPct: 0,
      };
      if (r.tipo === "PORTABILIDAD" && r.estado === "APROBADO") cur.porta += 1;
      if (r.tipo === "MIGRA" && r.estado === "APROBADO") cur.migra += 1;
      if (r.tipo === "HOGAR" && r.estado === "APROBADO") cur.ventHogar += 1;
      if (r.estado === "PENDIENTE") {
        if (r.tipo === "HOGAR") cur.pendHogar += 1;
        else cur.pendMov += 1;
      }
      if (r.estado === "RECHAZADO") {
        if (r.tipo === "HOGAR") cur.descHogar -= 1;
        else cur.descMov -= 1;
      }
      map.set(r.asesor, cur);
    });
    const arr = Array.from(map.values());
    arr.forEach((m: any) => {
      const acum = m.porta + m.migra + m.ventHogar;
      m.metaPct = Math.round((acum / (m.meta || 1)) * 100);
    });
    return arr;
  }, [rows, users]);

  const totals = useMemo(
    () =>
      tabla.reduce(
        (a: any, r: any) => ({
          porta: a.porta + r.porta,
          migra: a.migra + r.migra,
          pendMovil: a.pendMovil + r.pendMovil,
          descMovil: a.descMovil + r.descMovil,
          meta: a.meta + r.meta,
          servHogar: a.servHogar + r.servHogar,
          ventHogar: a.ventHogar + r.ventHogar,
          pendHogar: a.pendHogar + r.pendHogar,
          descHogar: a.descHogar + r.descHogar,
        }),
        {
          porta: 0,
          migra: 0,
          pendMovil: 0,
          descMovil: 0,
          meta: 0,
          servHogar: 0,
          ventHogar: 0,
          pendHogar: 0,
          descHogar: 0,
        }
      ),
    [tabla]
  );

  return (
    <div className="card" style={{ marginTop: 16, overflow: "hidden" }}>
      <table>
        <thead>
          <tr>
            {[
              "AGENTE",
              "Porta",
              "Migra",
              "Pend. Movil",
              "Desc. Movil",
              "Meta",
              "Serv. Hogar",
              "Ventas Hogar",
              "Pend. Hogar",
              "Desc. Hogar",
              "Meta Porcentaje",
            ].map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tabla.map((row: any, i: number) => (
            <tr key={i} style={{ background: i % 2 ? "#fafafa" : "#fff" }}>
              <td style={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                {row.agente}
              </td>
              <td>{row.porta}</td>
              <td>{row.migra}</td>
              <td>{row.pendMov || 0}</td>
              <td style={{ color: row.descMov < 0 ? "#e11d48" : "#111" }}>
                {row.descMov || 0}
              </td>
              <td>{row.meta}</td>
              <td>{row.servHogar}</td>
              <td>{row.ventHogar}</td>
              <td>{row.pendHogar}</td>
              <td style={{ color: row.descHogar < 0 ? "#e11d48" : "#111" }}>
                {row.descHogar}
              </td>
              <td>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <div className="progress">
                    <i style={{ width: row.metaPct + "%" }} />
                  </div>
                  <span style={{ fontFeatureSettings: "'tnum' 1" }}>
                    {row.metaPct}%
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td>{fmt(totals.porta)}</td>
            <td>{fmt(totals.migra)}</td>
            <td>{fmt(totals.pendMovil)}</td>
            <td>{fmt(totals.descMovil)}</td>
            <td>{fmt(totals.meta)}</td>
            <td>{fmt(totals.servHogar)}</td>
            <td>{fmt(totals.ventHogar)}</td>
            <td>{fmt(totals.pendHogar)}</td>
            <td>{fmt(totals.descHogar)}</td>
            <td>
              {(() => {
                const acum = totals.porta + totals.migra + totals.ventHogar;
                return (
                  <span style={{ fontFeatureSettings: "'tnum' 1" }}>
                    {pct(acum, totals.meta)}%
                  </span>
                );
              })()}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
