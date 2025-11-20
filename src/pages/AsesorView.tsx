
import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Sale, User, Estado } from "../types";
import {
  isSameDay,
  isThisWeek,
  isThisMonth,
  pct,
  fmt,
  isNonEmpty,
} from "../utils";
import { Card, KpiBox, Progress } from "../components/ui";
import { SalesTableMini } from "../components/SalesTableMini";
import { SaleDetailModal } from "../components/SaleDetailModal";
import { Select } from "../components/FormControls";
import { SaleFormModal } from "./SaleFormModal";

export function AsesorView({
  user,
  sales,
  setSales,
  saveSales,
}: {
  user: User;
  sales: Sale[];
  setSales: (updater: (prev: Sale[]) => Sale[]) => void;
  saveSales: (arr: Sale[]) => void;
}) {
  const mySales = useMemo(
    () => sales.filter((s) => s.asesor === user.name),
    [sales, user.name]
  );

  const okH = mySales.filter(
    (s) => s.estado === "APROBADO" && isSameDay(s.fecha)
  ).length;
  const okW = mySales.filter(
    (s) => s.estado === "APROBADO" && isThisWeek(s.fecha)
  ).length;
  const okM = mySales.filter(
    (s) => s.estado === "APROBADO" && isThisMonth(s.fecha)
  ).length;

  const isEmpty = mySales.length === 0;
  // 👇 NUEVO: metas base (40 al mes por asesor)
  const metaMensual = user.metas?.mensual ?? 40;
  const metaSemanal = user.metas?.semanal ?? Math.ceil(metaMensual / 4); // ≈10
  const metaDiaria = user.metas?.diaria ?? Math.ceil(metaMensual / 20); // ≈2 (20 días hábiles)

  const faltanDia = Math.max(metaDiaria - okH, 0);
  const faltanSemana = Math.max(metaSemanal - okW, 0);
  const faltanMes = Math.max(metaMensual - okM, 0);

  const progDia = metaDiaria ? Math.min(100, (okH / metaDiaria) * 100) : 0;
  const progSemana = metaSemanal
    ? Math.min(100, (okW / metaSemanal) * 100)
    : 0;
  const progMes = metaMensual ? Math.min(100, (okM / metaMensual) * 100) : 0;

  const [estadoFiltro, setEstadoFiltro] = useState<"Todos" | Estado>("Todos");
  const mySalesFiltered = useMemo(
    () =>
      mySales.filter(
        (s) => estadoFiltro === "Todos" || s.estado === estadoFiltro
      ),
    [mySales, estadoFiltro]
  );

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Sale | null>(null);
  const [detailSale, setDetailSale] = useState<Sale | null>(null);

  const onAdd = (sale: Sale) => {
    setSales((prev) => {
      const next = [sale, ...prev];
      saveSales(next);
      return next;
    });
  };

  const onUpdate = (sale: Sale) => {
    setSales((prev) => {
      const next = prev.map((s) => (s.id === sale.id ? sale : s));
      saveSales(next);
      return next;
    });
  };
  const handleDelete = (id: string) => {
    setSales((prev) => {
      const next = prev.filter((s) => s.id !== id);
      saveSales(next);
      return next;
    });
  };

  return (
    <div className="container">
      <div className="row auto-3">
        {isEmpty && (
          <div className="empty-sales">
            <h3>Aún no tienes ventas</h3>
            <p>
              Registra tu primera venta con el botón <b>“Registrar venta”</b>.
            </p>
            <button
              className="btn primary"
              onClick={() => {
                setEditing(null);
                setOpenForm(true);
              }}
            >
              Registrar venta
            </button>
          </div>
        )}

        <div className="kpi-hero">
          <div className="kpi-header">
            <p className="kpi-welcome">Hola, {user.name.split(" ")[0]} 👋</p>
            <p className="kpi-subtitle">Así va tu meta de este mes</p>
          </div>

          <div className="kpi-grid">
            {/* Meta diaria */}
            <div className="kpi-card">
              <div className="kpi-title">Meta diaria</div>
              <div className="kpi-main-row">
                <span className="kpi-number">
                  {okH}
                  <span className="kpi-number-meta">/{metaDiaria}</span>
                </span>
                <span className="kpi-chip">
                  Meta: {metaDiaria} ventas / día
                </span>
              </div>
              <div className="kpi-progress-track">
                <div
                  className="kpi-progress-fill"
                  style={{ width: `${progDia}%` }}
                />
              </div>
              <div className="kpi-footer">
                {faltanDia > 0 ? (
                  <>
                    Te faltan <b>{faltanDia}</b> ventas hoy
                  </>
                ) : (
                  <>¡Meta diaria cumplida! ✅</>
                )}
              </div>
            </div>

            {/* Meta semanal */}
            <div className="kpi-card">
              <div className="kpi-title">Meta semanal</div>
              <div className="kpi-main-row">
                <span className="kpi-number">
                  {okW}
                  <span className="kpi-number-meta">/{metaSemanal}</span>
                </span>
                <span className="kpi-chip">
                  Meta: {metaSemanal} ventas / semana
                </span>
              </div>
              <div className="kpi-progress-track">
                <div
                  className="kpi-progress-fill"
                  style={{ width: `${progSemana}%` }}
                />
              </div>
              <div className="kpi-footer">
                {faltanSemana > 0 ? (
                  <>
                    Te faltan <b>{faltanSemana}</b> ventas esta semana
                  </>
                ) : (
                  <>¡Meta semanal cumplida! 🎯</>
                )}
              </div>
            </div>

            {/* Meta mensual */}
            <div className="kpi-card">
              <div className="kpi-title">Meta mensual</div>
              <div className="kpi-main-row">
                <span className="kpi-number">
                  {okM}
                  <span className="kpi-number-meta">/{metaMensual}</span>
                </span>
                <span className="kpi-chip">
                  Meta: {metaMensual} ventas / mes
                </span>
              </div>
              <div className="kpi-progress-track">
                <div
                  className="kpi-progress-fill"
                  style={{ width: `${progMes}%` }}
                />
              </div>
              <div className="kpi-footer">
                {faltanMes > 0 ? (
                  <>
                    Te faltan <b>{faltanMes}</b> ventas este mes
                  </>
                ) : (
                  <>¡Meta mensual lograda! 🏆</>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row one" style={{ marginTop: 16 }}>
        <Card
          header={
            <div className="card">
              <div className="card-header">Mis ventas</div>
              <div className="card-body">
                <div className="filter-mini">
                  <Select
                    label="Estado"
                    value={estadoFiltro}
                    onChange={setEstadoFiltro as any}
                    options={["Todos", "PENDIENTE", "APROBADO", "RECHAZADO"]}
                  />
                </div>
                <button
                  className="btn primary"
                  onClick={() => {
                    setEditing(null);
                    setOpenForm(true);
                  }}
                >
                  <Plus size={16} style={{ marginRight: 6 }} /> Registrar venta
                </button>
              </div>
            </div>
          }
        >
          <div className="card-body">
            <SalesTableMini
              rows={mySalesFiltered}
              readonly
              onView={(s) => setDetailSale(s)}
              onEdit={(s) => {
                setEditing(s);
                setOpenForm(true);
              }}
              onDelete={handleDelete}
            />
          </div>
        </Card>
      </div>

      {openForm && (
        <SaleFormModal
          user={user}
          editing={editing}
          onClose={() => {
            setOpenForm(false);
            setEditing(null);
          }}
          onAdd={onAdd}
          onUpdate={onUpdate}
        />
      )}
      {detailSale && (
        <SaleDetailModal
          sale={detailSale}
          onClose={() => setDetailSale(null)}
        />
      )}
    </div>
  );
}
