
import { useState } from "react";
import { ClipboardList, CheckCircle2, XCircle } from "lucide-react";
import { Sale, Estado } from "../types";
import { Card } from "./ui";

function buildCSV(rows: Sale[]) {
  const header = [
    "id",
    "fecha",
    "asesor",
    "sala",
    "cliente",
    "producto",
    "tipo",
    "operador",
    "monto",
    "estado",
    "observacion",
  ];
  const mapRow = (s: Sale) => [
    s.id,
    s.fecha,
    s.asesor,
    s.sala,
    s.cliente,
    s.producto,
    s.tipo,
    s.operador,
    s.monto,
    s.estado,
    s.observacion || "",
  ];
  return [header, ...rows.map(mapRow)]
    .map((r) =>
      r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");
}
function updateStatusWithReason(
  rows: Sale[],
  id: string,
  newStatus: Estado,
  reason?: string
) {
  return rows.map((s) => {
    if (s.id !== id) return s;
    if (newStatus === "RECHAZADO") {
      const obsHist = [...(s.obsHist || []), reason || ""];
      return { ...s, estado: newStatus, observacion: reason || "", obsHist };
    }
    return {
      ...s,
      estado: newStatus,
      observacion: newStatus === "APROBADO" ? "" : s.observacion,
    };
  });
}
function resubmitCorrection(s: Sale) {
  return { ...s, estado: "PENDIENTE" as Estado, observacion: "" };
}
function lineSeriesByDate(rows: Sale[]) {
  const map: any = {};
  rows.forEach((r) => {
    const k = r.fecha;
    if (!map[k])
      map[k] = { fecha: k, PENDIENTE: 0, APROBADO: 0, RECHAZADO: 0 };
    (map[k] as any)[r.estado] += 1;
  });
  return Object.values(map).sort((a: any, b: any) =>
    (a as any).fecha.localeCompare((b as any).fecha)
  ) as any[];
}

function applyExternalStatus(rows: Sale[], id: string, status: Estado) {
  return rows.map((s) =>
    s.id === id
      ? {
          ...s,
          estado: status,
          observacion: status === "APROBADO" ? "" : s.observacion,
        }
      : s
  );
}

export function TestPanel({ sales }: { sales: Sale[] }) {
  const [results, setResults] = useState<any[]>([]);
  const run = () => {
    const t: any[] = [];
    (() => {
      const sample = [
        {
          id: "t1",
          fecha: "2025-10-01",
          asesor: "A",
          sala: "1",
          cliente: "C1",
          producto: "P1",
          tipo: "PORTABILIDAD",
          operador: "CLARO",
          monto: 10,
          estado: "PENDIENTE",
          observacion: "",
        },
      ] as any;
      const csv = buildCSV(sample as any);
      const okHeader = csv.split("\n")[0].includes("observacion");
      t.push({
        name: "CSV incluye observacion",
        pass: okHeader,
        detail: csv.split("\n")[0],
      });
    })();
    (() => {
      const arr = [{ id: "x1", estado: "PENDIENTE" }] as any;
      const res = updateStatusWithReason(
        arr as any,
        "x1",
        "RECHAZADO",
        "Doc ilegible"
      );
      const r: any = (res as any)[0];
      t.push({
        name: "updateStatusWithReason añade motivo",
        pass:
          r.estado === "RECHAZADO" &&
          r.observacion === "Doc ilegible" &&
          (r.obsHist || []).length === 1,
        detail: JSON.stringify(r),
      });
    })();
    (() => {
      const sale: any = {
        id: "x2",
        estado: "RECHAZADO",
        observacion: "faltan datos",
      };
      const r = resubmitCorrection(sale as any);
      t.push({
        name: "resubmitCorrection limpia observacion y pone PENDIENTE",
        pass: r.estado === "PENDIENTE" && r.observacion === "",
        detail: JSON.stringify(r),
      });
    })();
    (() => {
      const arr = [
        { fecha: "2025-10-02", estado: "APROBADO" },
        { fecha: "2025-10-01", estado: "PENDIENTE" },
        { fecha: "2025-10-01", estado: "APROBADO" },
      ] as any;
      const serie: any = lineSeriesByDate(arr as any);
      const sorted =
        serie[0].fecha === "2025-10-01" && serie[1].fecha === "2025-10-02";
      const countsOk =
        serie[0].APROBADO === 1 &&
        serie[0].PENDIENTE === 1 &&
        serie[1].APROBADO === 1;
      t.push({
        name: "lineSeriesByDate",
        pass: sorted && countsOk,
        detail: JSON.stringify(serie),
      });
    })();
    (() => {
      const arr = [{ id: "ext1", estado: "PENDIENTE", observacion: "x" }] as any;
      const r = applyExternalStatus(arr as any, "ext1", "APROBADO" as any)[0];
      t.push({
        name: "applyExternalStatus APRUEBA y limpia observacion",
        pass: r.estado === "APROBADO" && r.observacion === "",
        detail: JSON.stringify(r),
      });
    })();
    setResults(t);
  };
  return (
    <Card
      header={
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <ClipboardList size={16} />
          Pruebas automáticas
        </span>
      }
    >
      {results.length === 0 ? (
        <p className="note">
          Clic en “Ejecutar tests” para validar CSV, rechazo con observación,
          reenvío y verificación externa.
        </p>
      ) : (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "grid",
            gap: 8,
          }}
        >
          {results.map((r: any, i: number) => (
            <li key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {r.pass ? (
                <CheckCircle2 size={16} color="#059669" />
              ) : (
                <XCircle size={16} color="#e11d48" />
              )}
              <span style={{ fontWeight: 700 }}>{r.name}:</span>
              <span style={{ color: r.pass ? "#065f46" : "#b91c1c" }}>
                {r.pass ? "OK" : "FALLÓ"}
              </span>
              <span className="note">({r.detail})</span>
            </li>
          ))}
        </ul>
      )}
      <div style={{ marginTop: 10 }}>
        <button className="btn" onClick={run}>
          Ejecutar tests
        </button>
      </div>
    </Card>
  );
}
