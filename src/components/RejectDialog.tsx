
import { isNonEmpty } from "../utils";
import { Modal } from "./ui";

export function RejectDialog({
  reason,
  setReason,
  onConfirm,
  onCancel,
}: {
  reason: string;
  setReason: (s: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal title="Motivo del rechazo" onClose={onCancel}>
      <div className="card modal-card" style={{ maxWidth: 520 }}>
        <div className="card-header">Motivo del rechazo</div>
        <div className="card-body modal-body">
          <p className="note" style={{ marginTop: -6, marginBottom: 8 }}>
            Escribe por qué se rechaza esta venta. Este texto lo verá el asesor
            y quedará registrado.
          </p>
          <textarea
            className="input"
            style={{ minHeight: 110 }}
            placeholder="Ej.: Documento ilegible, datos incompletos, no coincide con pedido, etc."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div className="flex-row">
            <button className="btn" onClick={onCancel}>
              Cancelar
            </button>
            <button
              className="btn primary"
              onClick={onConfirm}
              disabled={!isNonEmpty(reason)}
            >
              Guardar rechazo
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
