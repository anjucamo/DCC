import { useMemo, useState } from "react";
import { Filter } from "lucide-react";
import { Sale, User, Estado } from "../types";
import { inRange, pct, fmt } from "../utils";
import { Card, KpiBox, Gauge } from "../components/ui";
import { SalesTableMini } from "../components/SalesTableMini";
import { RejectDialog } from "../components/RejectDialog";
import { SaleDetailModal } from "../components/SaleDetailModal";
import { Select, DateInput } from "../components/FormControls";
import { InformePrincipal } from "../components/informes/InformePrincipal";
import { InformeGeneral } from "../components/informes/InformeGeneral";
import { InformeSalas } from "../components/informes/InformeSalas";
import { TestPanel } from "../components/TestPanel";
import { saveSaleInSupabase } from "../lib/sales";


function exportCSV(rows: Sale[]) {
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
  const csv = [header, ...rows.map(mapRow)]
    .map((r) =>
      r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ventas_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function BackOfficeView({
  sales,
  setSales,
  users,
  saveSales,
  isAdmin = false,
}: {
  sales: Sale[];
  setSales: (updater: (prev: Sale[]) => Sale[]) => void;
  users: User[];
  saveSales: (arr: Sale[]) => void;
  isAdmin?: boolean;
}) {
  const asesores = users.filter((u) => u.role === "asesor");
  const [estado, setEstado] = useState<"Todos" | Estado>("Todos");
  const [asesorId, setAsesorId] = useState<string>("Todos");
  const [sala, setSala] = useState<string>("Todas");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [tab, setTab] = useState<
    "principal" | "general" | "salas" | "detalle"
  >("detalle");

  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [detailSale, setDetailSale] = useState<Sale | null>(null);

  const filtered = useMemo(
    () =>
      sales.filter(
        (s) =>
          (estado === "Todos" || s.estado === estado) &&
          (asesorId === "Todos" || s.asesorId === asesorId) &&
          (sala === "Todas" || s.sala === sala) &&
          inRange(s.fecha, from || null, to || null)
      ),
    [sales, estado, asesorId, sala, from, to]
  );
  // ✅ META GLOBAL
  const metaGlobal = 2465;

  // Ventas exitosas (todas las aprobadas)
  const ventasExitosas = sales.filter((s) => s.estado === "APROBADO").length;

  // Porcentaje de avance vs meta global
  const avanceMeta = pct(ventasExitosas, metaGlobal);

  const counts = useMemo(
    () => ({
      pend: filtered.filter((s) => s.estado === "PENDIENTE").length,
    }),
    [filtered]
  );

  const setStatus = (id: string, st: Estado) => {
  if (st === "RECHAZADO") {
    setRejectingId(id);
    setRejectReason("");
    return;
  }

  let updated: Sale | null = null;

  setSales((prev) => {
    const next: Sale[] = prev.map((s) => {
      if (s.id !== id) return s;

      const updatedSale: Sale = {
        ...s,
        estado: st,
        observacion: st === "APROBADO" ? "" : s.observacion,
      };

      updated = updatedSale;
      return updatedSale;
    });

    saveSales(next);
    return next;
  });

  // Enviar el cambio también a Supabase (tabla ventas)
  if (updated) {
    saveSaleInSupabase(updated);
  }
};


const confirmReject = () => {
  if (!rejectingId || !rejectReason) return;
  const reason = rejectReason.trim();

  let updated: Sale | null = null;

  setSales((prev) => {
    const next: Sale[] = prev.map((s) => {
      if (s.id !== rejectingId) return s;

      const updatedSale: Sale = {
        ...s,
        estado: "RECHAZADO",
        observacion: reason,
        obsHist: [
          ...(s.obsHist || []),
          `[${new Date().toLocaleString()}] ${reason}`,
        ],
      };

      updated = updatedSale;
      return updatedSale;
    });

    saveSales(next);
    return next;
  });

  if (updated) {
    saveSaleInSupabase(updated);
  }

  setRejectingId(null);
  setRejectReason("");
};

  const cancelReject = () => {
    setRejectingId(null);
    setRejectReason("");
  };

  return (
    <div className="container">
      {/* fila de KPIs compacta */}
      <div className="row auto-3 back-kpi-row">
        <KpiBox
          title="Ventas Pendientes"
          value={<span style={{ color: "var(--magenta)" }}>{fmt(counts.pend)}</span>}
        />
        <KpiBox
          title="Presupuesto Diario"
          value={fmt(
            users
              .filter((u) => u.role === "asesor")
              .reduce((a, u) => a + (u.metas?.presupuesto || 0), 0)
          )}
        />
        <Card>
          <div className="kpi-title">Meta</div>
          <div className="kpi-meta-layout">
            <div className="kpi-meta-gauge">
              {/* ✅ usa el porcentaje calculado */}
              <Gauge pctValue={avanceMeta} />
            </div>
            <div className="kpi-meta-number">
              {/* ✅ ventas exitosas actuales */}
              <span className="kpi-meta-strong">{fmt(ventasExitosas)}</span>
              {/* ✅ meta fija: 2465 */}
              <span className="kpi-meta-dim"> / {fmt(metaGlobal)}</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="toolbar back-toolbar">
        <div className="left">
          <span className="toolbar-title">
            Panel {isAdmin ? "Administrador" : "Back Office"}
          </span>
        </div>
      </div>

      <div className="card filters-card">
        <div className="card-header filters-header">
          <span className="filters-title">
            <Filter size={16} />
            Filtros
          </span>
          <button className="btn" onClick={() => exportCSV(filtered)}>
            Exportar CSV
          </button>
        </div>
        <div className="card-body filters-grid">
          <Select
            label="Sala"
            value={sala}
            onChange={setSala}
            options={["Todas", "1", "2", "3", "4", "5"]}
          />
          <Select
            label="Estado"
            value={estado}
            onChange={setEstado as any}
            options={["Todos", "PENDIENTE", "APROBADO", "RECHAZADO"]}
          />
          <div className="span-2">
            <Select
              label="Agente"
              value={asesorId}
              onChange={setAsesorId}
              options={[
                "Todos",
                ...asesores.map((a) => ({ label: a.name, value: a.id })),
              ]}
            />
          </div>
          <DateInput label="Desde" value={from} onChange={setFrom} />
          <DateInput label="Hasta" value={to} onChange={setTo} />
        </div>
      </div>

      <div className="tabs" style={{ marginTop: 8 }}>
        {(
          [
            ["detalle", "Ventas (lista mínima)"],
            ["principal", "Informe Principal"],
            ["general", "Informe General"],
            ["salas", "Informe Salas"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            className={"tab" + (tab === id ? " active" : "")}
            onClick={() => setTab(id as any)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "detalle" && (
        <Card header="Ventas">
          <div className="card-body">
            <SalesTableMini
              rows={filtered}
              onView={(s) => setDetailSale(s)}
              onApprove={(id) => setStatus(id, "APROBADO")}
              onPending={(id) => setStatus(id, "PENDIENTE")}
              onReject={(id) => {
                setRejectingId(id);
                setRejectReason("");
              }}
            />
          </div>
        </Card>
      )}
      {tab === "principal" && <InformePrincipal rows={filtered} users={users} />}
      {tab === "general" && <InformeGeneral rows={filtered} />}
      {tab === "salas" && <InformeSalas rows={filtered} users={users} />}

      {rejectingId && (
        <RejectDialog
          reason={rejectReason}
          setReason={setRejectReason}
          onConfirm={confirmReject}
          onCancel={cancelReject}
        />
      )}
      {detailSale && (
        <SaleDetailModal
          sale={detailSale}
          onClose={() => setDetailSale(null)}
        />
      )}

      <div style={{ marginTop: 16 }}>
        <TestPanel sales={filtered} />
      </div>
    </div>
  );
}
