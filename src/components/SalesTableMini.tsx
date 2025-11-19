
import { Edit3 } from "lucide-react";
import { Sale, Estado } from "../types";

export function SalesTableMini({
  rows,
  readonly = false,
  onApprove,
  onPending,
  onReject,
  onEdit,
  onView,
  onDelete,
}: {
  rows: Sale[];
  readonly?: boolean;
  onApprove?: (id: string) => void;
  onPending?: (id: string) => void;
  onReject?: (id: string) => void;
  onEdit?: (s: Sale) => void;
  onView?: (s: Sale) => void;
  onDelete?: (id: string) => void;
}) {
  const tone = (s: Estado) =>
    s === "APROBADO"
      ? "#059669"
      : s === "PENDIENTE"
      ? "#92400e"
      : "#991b1b";

  return (
    <div className="table-wrap">
      <table className="stack">
        <thead>
          <tr>
            {[
              "Sala",
              "Asesor",
              "Nombre del Cliente",
              "Cédula",
              "Número a portar",
              "Estado",
              "Observación",
              "Acciones",
            ].map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td data-label="Sala">{r.sala}</td>
              <td data-label="Asesor">{r.asesor}</td>
              <td data-label="Nombre del Cliente" style={{ fontWeight: 600 }}>
                {r.cliente}
              </td>
              <td data-label="Cédula">{r.cedula || "-"}</td>
              <td data-label="Número a portar">{r.numeroAPortar || "-"}</td>

              <td data-label="Estado">
                <span
                  className="pill"
                  style={{
                    borderColor: "#e5e7eb",
                    color:
                      r.estado === "APROBADO"
                        ? "#059669"
                        : r.estado === "PENDIENTE"
                        ? "#92400e"
                        : "#991b1b",
                  }}
                >
                  {r.estado === "APROBADO" ? "EXITOSA" : r.estado}
                </span>
              </td>
              <td data-label="Observación" className="obs">
                {r.observacion || ""}
              </td>

              <td data-label="Acciones">
                <div className="btn-row">
                  {onView && (
                    <button
                      className="btn"
                      onClick={() => onView(r)}
                      title="Ver detalle"
                    >
                      Ver detalle
                    </button>
                  )}

                  {readonly ? (
                    <>
                      {onEdit && (
                        <button
                          className="btn"
                          onClick={() => onEdit(r)}
                          title="Editar"
                        >
                          <Edit3 size={16} />
                        </button>
                      )}

                      {onDelete && (
                        <button
                          className="btn danger"
                          onClick={() => onDelete(r.id)}
                          title="Eliminar"
                        >
                          Eliminar
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      {onApprove && (
                        <button
                          className="btn primary"
                          onClick={() => onApprove(r.id)}
                          title="Marcar Exitosa"
                        >
                          Exitosa
                        </button>
                      )}
                      {onPending && (
                        <button
                          className="btn"
                          onClick={() => onPending(r.id)}
                          title="Marcar Pendiente"
                        >
                          Pendiente
                        </button>
                      )}
                      {onReject && (
                        <button
                          className="btn"
                          onClick={() => onReject(r.id)}
                          title="Rechazar con observación"
                        >
                          Rechazar…
                        </button>
                      )}
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <p className="table-empty">No hay registros con estos filtros.</p>
      )}
    </div>
  );
}
