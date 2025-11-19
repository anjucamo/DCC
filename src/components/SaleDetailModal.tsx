
import { Sale } from "../types";
import { pretty } from "../utils";
import { Modal } from "./ui";

function KV({ label, value }: { label: string; value: any }) {
  return (
    <div className="kv">
      <div className="kv-label">{label}</div>
      <div className="kv-value">{pretty(value)}</div>
    </div>
  );
}

export function SaleDetailModal({
  sale,
  onClose,
}: {
  sale: Sale;
  onClose: () => void;
}) {
  const estadoLabel =
    sale.estado === "APROBADO"
      ? "EXITOSA"
      : sale.estado === "PENDIENTE"
      ? "PENDIENTE"
      : "RECHAZADA";

  const estadoClass =
    sale.estado === "APROBADO"
      ? "detail-status"
      : sale.estado === "PENDIENTE"
      ? "detail-status-pendiente"
      : "detail-status-rechazado";

  return (
    <Modal title={`Detalle de venta`} onClose={onClose} maxWidth={1000}>
      <div className="detail-root">
        {/* ENCABEZADO BONITO */}
        <div className="detail-header">
          <div className="detail-title-block">
            <div className="detail-title">
              {sale.cliente || "Cliente sin nombre"}
            </div>
            <div className="detail-subtitle">
              Venta del <b>{sale.fecha}</b> · Sala <b>{sale.sala}</b> · Asesor{" "}
              <b>{sale.asesor}</b>
            </div>
          </div>

          <div className="detail-badges">
            <div className={`detail-pill ${estadoClass}`}>
              <span className="detail-pill-label">Estado</span>
              <span>{estadoLabel}</span>
            </div>
            <div className="detail-pill">
              <span className="detail-pill-label">Tipo</span>
              <span>{pretty(sale.tipo)}</span>
            </div>
            {sale.operador && (
              <div className="detail-pill">
                <span className="detail-pill-label">Operador</span>
                <span>{sale.operador}</span>
              </div>
            )}
          </div>
        </div>

        {/* GRID DE TARJETAS */}
        <div className="detail-grid">
          {/* Datos de la venta */}
          <div className="detail-card">
            <div className="detail-card-title">Datos de la venta</div>
            <div className="detail-card-subtitle">
              Resumen general de la operación.
            </div>
            <KV label="Sala" value={sale.sala} />
            <KV label="Fecha" value={sale.fecha} />
            <KV label="Asesor" value={sale.asesor} />
            <KV label="Origen" value={sale.origen} />
            <KV label="Tipificación" value={sale.tipificacion} />
            <KV label="Tipo de venta" value={sale.tipoVenta} />
          </div>

          {/* Cliente y documento */}
          <div className="detail-card">
            <div className="detail-card-title">Cliente y documento</div>
            <div className="detail-card-subtitle">
              Información principal del titular.
            </div>
            <KV label="Nombre" value={sale.cliente} />
            <KV label="Tipo de documento" value={sale.tipoDocumento} />
            <KV label="Cédula" value={sale.cedula} />
            <KV label="Fecha de nacimiento" value={sale.fechaNacimiento} />
            <KV label="Fecha de expedición" value={sale.fechaExpedicion} />
            <KV label="Tipo de cliente" value={sale.tipoCliente} />
          </div>

          {/* Contacto */}
          <div className="detail-card">
            <div className="detail-card-title">Contacto</div>
            <div className="detail-card-subtitle">
              Datos para comunicación con el cliente.
            </div>
            <KV label="Celular" value={sale.celular} />
            <KV label="Número adicional" value={sale.numeroAdicional} />
            <KV label="Número a portar" value={sale.numeroAPortar} />
            <KV label="NIP" value={sale.nip} />
            <KV label="Email" value={sale.emailCliente} />
            <KV label="N° de grabación" value={sale.numeroGrabacion} />
          </div>

          {/* Ubicación */}
          <div className="detail-card">
            <div className="detail-card-title">Ubicación</div>
            <div className="detail-card-subtitle">
              Dirección donde se presta el servicio.
            </div>
            <KV label="Dirección" value={sale.direccion} />
            <KV label="Barrio" value={sale.barrio} />
            <KV label="Ciudad" value={sale.ciudad} />
            <KV label="Departamento" value={sale.departamento} />
            <KV label="Vereda" value={sale.vereda} />
            <KV label="Recorrido / Nota" value={sale.recorrido} />
          </div>

          {/* Plan y oferta */}
          <div className="detail-card">
            <div className="detail-card-title">Plan y oferta</div>
            <div className="detail-card-subtitle">
              Información del plan contratado.
            </div>
            <KV label="Plan general" value={sale.planGeneral} />
            <KV
              label="Código plan adquirido"
              value={sale.codigoPlanAdquirir}
            />
            <KV label="ID Descuento oferta" value={sale.idDescuentoOferta} />
            <KV label="Fecha activación" value={sale.fechaActivacion} />
            <KV label="Cargo fijo mensual" value={sale.cargoFijoMensual} />
          </div>

          {/* Operadores y SIM */}
          <div className="detail-card">
            <div className="detail-card-title">Operadores, SIM y red</div>
            <div className="detail-card-subtitle">
              Información técnica de la línea.
            </div>
            <KV label="Operador destino" value={sale.operador} />
            <KV label="Operador donante" value={sale.operadorDonante} />
            <KV
              label="Evaluación identidad"
              value={sale.evaluacionIdentidad}
            />
            <KV label="ICCID" value={sale.iccid} />
            <KV label="Red del equipo" value={sale.redEquipo} />
            <KV label="SIM adquirida" value={sale.simAdquirida} />
          </div>

          {/* Logística y contrato */}
          <div className="detail-card">
            <div className="detail-card-title">Logística y contrato</div>
            <div className="detail-card-subtitle">
              Cómo se entrega y bajo qué modalidad se firma.
            </div>
            <KV label="Envío logístico" value={sale.envioLogistico} />
            <KV label="Cliente Todo Claro" value={sale.clienteTodoClaro} />
            <KV label="Tipo de contrato" value={sale.tipoContrato} />
            <KV label="Producto" value={sale.producto} />
          </div>

          {/* Observaciones / historial */}
          <div className="detail-card">
            <div className="detail-card-title">Observaciones</div>
            <div className="detail-card-subtitle">
              Motivo en caso de rechazo y anotaciones históricas.
            </div>
            <KV label="Observación actual" value={sale.observacion} />
            <div style={{ marginTop: 6 }}>
              {sale.obsHist && sale.obsHist.length > 0 ? (
                <ul className="obs-list">
                  {sale.obsHist.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              ) : (
                <div className="note">Sin historial adicional.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
