
import { useState } from "react";
import {
  Sale,
  User,
  Origen,
  TipoCliente,
  RedEquipo,
  SimAdquirida,
  Tipificacion,
} from "../types";
import { saveSaleInSupabase } from "../lib/sales";
import { isNonEmpty } from "../utils";
import { Modal, Stepper } from "../components/ui";

function FieldRow({
  cols = 2,
  children,
}: {
  cols?: 1 | 2 | 3 | 4;
  children: React.ReactNode;
}) {
  return (
    <div
      className="field-row"
      style={{ ["--cols" as any]: cols } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
const SALAS = ["1", "2", "3", "4", "5"] as const;
const DOC_TYPES = ["CEDULA", "CEDULA_EXTRANJERA"] as const;
const ORIGEN_OPTS: Origen[] = [
  "BASE",
  "REDES_SOCIALES",
  "GESTION_PROPIA",
  "B2CHAT",
];
const TIPO_CLIENTE_OPTS: TipoCliente[] = ["POSPAGO", "PREPAGO"];
const EVAL_ID: Sale["evaluacionIdentidad"][] = [
  "BIOMETRIA_FACIAL_EXTERNA",
  "VALIDACION_ID",
  "VISION_OTP",
  "POLIEDRO",
  "BIOMETRIA_FACIAL",
  "POLIEDRO_OTP",
  "SAFE",
  "BASE_SIN_VALIDACION",
];

const DONANTE: Sale["operadorDonante"][] = [
  "TIGO",
  "MOVISTAR",
  "WOM",
  "ETB",
  "VIRGIN",
  "MOVIL_EXITO",
  "OTRO",
];

const RED_OPTS: RedEquipo[] = ["4G", "5G"];
const SIM_OPTS: SimAdquirida[] = ["SI", "NO"];
const TIPIFICACION_OPTS: Tipificacion[] = [
  "VENTA_MOVIL",
  "VENTA_CONVERGENCIA",
];

function deriveTipoFrom(tipoVenta?: Sale["tipoVenta"]): Sale["tipo"] {
  if (!tipoVenta) return "MIGRA";
  if (tipoVenta === "PORTA_POSTPAGO" || tipoVenta === "PORTA_PREPAGO")
    return "PORTABILIDAD";
  if (tipoVenta === "MIGRACION") return "MIGRA";
  return "MIGRA";
}
function getTodayLocal() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`; // YYYY-MM-DD en hora local
}

export function SaleFormModal({
  user,
  editing,
  onClose,
  onAdd,
  onUpdate,
}: {
  user: User;
  editing: Sale | null;
  onClose: () => void;
  onAdd: (s: Sale) => void;
  onUpdate: (s: Sale) => void;
}) {
  const steps = [
    "Datos básicos",
    "Documento/Contacto",
    "Cliente",
    "Dirección",
    "Venta/Operadores",
    "Plan/Oferta",
    "Logística/SIM/Red",
    "Resumen",
  ];
  const [step, setStep] = useState(0);

  const digits = (v: string, max: number) =>
    v.replace(/\D/g, "").slice(0, max);

  // ======= Estado de todos los campos =======
  const [salaSel, setSalaSel] = useState<string>(editing?.sala || "");
  const [fecha, setFecha] = useState(editing?.fecha || getTodayLocal());

  const [origen, setOrigen] = useState<Origen | "">(editing?.origen || "");
  const [tipoCliente, setTipoCliente] = useState<TipoCliente | "">(
    editing?.tipoCliente || ""
  );

  const [tipoDocumento, setTipoDocumento] = useState<
    Sale["tipoDocumento"] | ""
  >(editing?.tipoDocumento || "");
  const [cedula, setCedula] = useState(editing?.cedula || "");
  const [celular, setCelular] = useState(editing?.celular || "");
  const [numeroGrabacion, setNumeroGrabacion] = useState(
    editing?.numeroGrabacion || ""
  );
  const [numeroAdicional, setNumeroAdicional] = useState(
    editing?.numeroAdicional || ""
  );
  const [emailCliente, setEmailCliente] = useState(editing?.emailCliente || "");

  const [cliente, setCliente] = useState(editing?.cliente || "");
  const [fechaNacimiento, setFechaNacimiento] = useState(
    editing?.fechaNacimiento || ""
  );
  const [fechaExpedicion, setFechaExpedicion] = useState(
    editing?.fechaExpedicion || ""
  );

  const [direccion, setDireccion] = useState(editing?.direccion || "");
  const [departamento, setDepartamento] = useState(editing?.departamento || "");
  const [ciudad, setCiudad] = useState(editing?.ciudad || "");
  const [barrio, setBarrio] = useState(editing?.barrio || "");
  const [vereda, setVereda] = useState(editing?.vereda || "");
  const [recorrido, setRecorrido] = useState(editing?.recorrido || "");

  const [tipoVenta, setTipoVenta] = useState<Sale["tipoVenta"] | "">(
    editing?.tipoVenta || ""
  );
  const [evaluacionIdentidad, setEvaluacionIdentidad] = useState<
    Sale["evaluacionIdentidad"] | ""
  >(editing?.evaluacionIdentidad || "");
  const [operador, setOperador] = useState<string>(editing?.operador || "CLARO"); // valor fijo por defecto
  const [operadorDonante, setOperadorDonante] = useState<
    Sale["operadorDonante"] | ""
  >(editing?.operadorDonante || "");
  const [numeroAPortar, setNumeroAPortar] = useState(
    editing?.numeroAPortar || ""
  );
  const [nip, setNip] = useState(editing?.nip || "");

  const [planGeneral, setPlanGeneral] = useState<Sale["planGeneral"] | "">(
    editing?.planGeneral || ""
  );
  const [planId, setPlanId] = useState(editing?.planId || ""); // ya no se pide en el formulario
  const [idDescuentoOferta, setIdDescuentoOferta] = useState(
    editing?.idDescuentoOferta || ""
  );
  const [descuentoOferta, setDescuentoOferta] = useState(
    editing?.descuentoOferta != null ? String(editing.descuentoOferta) : ""
  );
  const [codigoPlanAdquirir, setCodigoPlanAdquirir] = useState(
    editing?.codigoPlanAdquirir || ""
  );
  const [fechaActivacion, setFechaActivacion] = useState(
    editing?.fechaActivacion || ""
  );
  const [cargoFijoMensual, setCargoFijoMensual] = useState(
    editing?.cargoFijoMensual != null ? String(editing.cargoFijoMensual) : ""
  );

  const [envioLogistico, setEnvioLogistico] = useState<
    Sale["envioLogistico"] | ""
  >(editing?.envioLogistico || "");
  const [clienteTodoClaro, setClienteTodoClaro] = useState<
    Sale["clienteTodoClaro"] | ""
  >(editing?.clienteTodoClaro || "");
  const [tipoContrato, setTipoContrato] = useState<Sale["tipoContrato"] | "">(
    editing?.tipoContrato || ""
  );
  const [redEquipo, setRedEquipo] = useState<RedEquipo | "">(
    editing?.redEquipo || ""
  );
  const [simAdquirida, setSimAdquirida] = useState<SimAdquirida | "">(
    editing?.simAdquirida || ""
  );
  const [iccid, setIccid] = useState(editing?.iccid || "");

  const [tipificacion, setTipificacion] = useState<Tipificacion | "">(
    editing?.tipificacion || ""
  );

  const [producto, setProducto] = useState(editing?.producto || ""); // ya no se pide, pero lo dejamos interno
  const [monto, setMonto] = useState(
    editing ? String(editing.monto) : ""
  ); // ya no se pide, por defecto 0
  const [observacion, setObservacion] = useState(editing?.observacion || "");

  const [msg, setMsg] = useState("");

  const RX = {
    cedula: /^\d{5,12}$/,
    phone: /^\d{10}$/,
    nip: /^\d{5}$/,
    iccid: /^\d{12}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  };
  const notFuture = (iso?: string) => !iso || new Date(iso) <= new Date();
  const ageOK = (iso?: string) => {
    if (!iso) return false;
    const years = Math.floor(
      (Date.now() - new Date(iso).getTime()) / (365.25 * 24 * 3600 * 1000)
    );
    return years >= 14;
  };
  const selected = (v: any) =>
    v !== null && v !== undefined && String(v).trim() !== "";

  const isPorta =
    tipoVenta === "PORTA_POSTPAGO" || tipoVenta === "PORTA_PREPAGO";
  const needICCID = simAdquirida === "SI";

  // ======= Validación por pasos =======
  function canNext(): boolean {
    if (step === 0) {
      return (
        selected(salaSel) &&
        selected(fecha) &&
        selected(origen) &&
        selected(tipoCliente) &&
        notFuture(fecha)
      );
    }
    if (step === 1) {
      return (
        selected(tipoDocumento) &&
        RX.cedula.test(cedula) &&
        RX.phone.test(celular) &&
        isNonEmpty(numeroGrabacion) &&
        RX.email.test(emailCliente) &&
        RX.phone.test(numeroAdicional)
      );
    }
    if (step === 2) {
      return (
        isNonEmpty(cliente) &&
        selected(fechaNacimiento) &&
        selected(fechaExpedicion) &&
        notFuture(fechaNacimiento) &&
        notFuture(fechaExpedicion) &&
        ageOK(fechaNacimiento)
      );
    }
    if (step === 3) {
      return (
        isNonEmpty(direccion) &&
        isNonEmpty(departamento) &&
        isNonEmpty(ciudad) &&
        isNonEmpty(barrio)
      );
    }
    if (step === 4) {
      const baseOk = selected(tipoVenta) && selected(evaluacionIdentidad);
      if (!baseOk) return false;
      if (isPorta) {
        return (
          selected(operadorDonante) &&
          RX.phone.test(numeroAPortar) &&
          RX.nip.test(nip)
        );
      }
      return true;
    }
    if (step === 5) {
      return (
        selected(planGeneral) &&
        isNonEmpty(idDescuentoOferta) &&
        isNonEmpty(codigoPlanAdquirir) &&
        selected(fechaActivacion) && // sin max, puede futuro
        Number(cargoFijoMensual) > 0
      );
    }
    if (step === 6) {
      const base =
        selected(envioLogistico) &&
        selected(clienteTodoClaro) &&
        selected(tipoContrato) &&
        selected(redEquipo) &&
        selected(simAdquirida) &&
        selected(tipificacion);
      if (!base) return false;
      if (needICCID && !RX.iccid.test(iccid)) return false;
      return true;
    }
    if (step === 7) {
      return isNonEmpty(observacion);
    }
    return true;
  }

  function buildSale(): Sale {
    return {
      id: editing ? editing.id : `s_${Date.now()}`,
      asesorId: user.id,
      asesor: user.name,
      sala: salaSel,
      fecha,

      cliente: cliente.trim(),
      tipoDocumento: tipoDocumento as any,
      cedula: cedula.trim(),
      celular: celular.trim(),
      numeroGrabacion: numeroGrabacion.trim(),
      numeroAdicional: numeroAdicional.trim(),
      emailCliente: emailCliente.trim(),

      fechaNacimiento,
      fechaExpedicion,

      origen: origen as any,
      ciudad: ciudad.trim(),
      direccion: direccion.trim(),
      departamento: departamento.trim(),
      barrio: barrio.trim(),
      vereda: vereda.trim(),
      recorrido: recorrido.trim(),

      tipoVenta: tipoVenta as any,
      evaluacionIdentidad: evaluacionIdentidad as any,
      operador: operador,
      operadorDonante: (operadorDonante || undefined) as any,
      numeroAPortar: numeroAPortar.trim(),
      nip: nip.trim(),

      planGeneral: planGeneral as any,
      planId: planId.trim(),
      idDescuentoOferta: idDescuentoOferta.trim(),
      descuentoOferta: descuentoOferta ? Number(descuentoOferta) : undefined,
      codigoPlanAdquirir: codigoPlanAdquirir.trim(),
      fechaActivacion,
      cargoFijoMensual: Number(cargoFijoMensual),

      envioLogistico: envioLogistico as any,
      clienteTodoClaro: clienteTodoClaro as any,
      tipoContrato: tipoContrato as any,
      redEquipo: redEquipo as any,
      simAdquirida: simAdquirida as any,
      iccid: iccid.trim(),

      tipificacion: tipificacion as any,
      tipoCliente: tipoCliente as any,

      producto: producto.trim() || "PLAN CLARO", // valor por defecto
      tipo: deriveTipoFrom(tipoVenta as any),
      monto: Number(monto || 0), // si no llenas monto, va 0
      estado: "PENDIENTE",
      observacion: observacion.trim(),
      obsHist: editing?.obsHist || [],
    };
  }

  const submit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Si el paso actual no pasa validación, no seguimos
    if (!canNext()) {
      setMsg(
        "Revisa los campos del paso actual: todos los obligatorios deben estar completos."
      );
      return;
    }

    const sale = buildSale();
    // 👈 arma la venta con todos los campos

    // 1) Guardar en Supabase (tabla ventas)
    await saveSaleInSupabase(sale);

    // 2) Guardar en estado/localStorage
    if (editing) {
      onUpdate(sale);
    } else {
      onAdd(sale);
    }

    onClose();
  };

  return (
    <Modal
      title={editing ? "Corregir venta" : "Registrar venta"}
      onClose={onClose}
      maxWidth={980}
    >
      <Stepper steps={steps} current={step} />

      {/* Paso 0: básicos */}
      {step === 0 && (
        <div className="form-step">
          <div className="form-step-header">
            <div>
              <div className="form-step-title">Datos de la venta</div>
              <p className="form-step-subtitle">
                Selecciona la sala, la fecha, el origen del lead y el tipo de
                cliente.
              </p>
            </div>
            <span className="form-step-pill">Paso 1 de 8</span>
          </div>
          <div className="form-step-body space-y-3">
            <FieldRow cols={2}>
              <div>
                <label className="label">Sala *</label>
                <select
                  className="select"
                  value={salaSel}
                  onChange={(e) => setSalaSel(e.target.value)}
                >
                  <option value="">Seleccionar</option>
                  {SALAS.map((s) => (
                    <option key={s} value={s}>
                      Sala {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Fecha *</label>
                <input
                  type="date"
                  className="input"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                />
              </div>
            </FieldRow>
            <FieldRow cols={2}>
              <div>
                <label className="label">Origen *</label>
                <select
                  className="select"
                  value={origen}
                  onChange={(e) => setOrigen(e.target.value as any)}
                >
                  <option value="">Seleccionar</option>
                  {ORIGEN_OPTS.map((o) => (
                    <option key={o} value={o}>
                      {o.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Tipo de cliente *</label>
                <select
                  className="select"
                  value={tipoCliente}
                  onChange={(e) => setTipoCliente(e.target.value as any)}
                >
                  <option value="">Seleccionar</option>
                  {TIPO_CLIENTE_OPTS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            </FieldRow>
          </div>
        </div>
      )}

      {/* Paso 1: documento / contacto */}
      {step === 1 && (
        <div className="form-step">
          <div className="form-step-header">
            <div>
              <div className="form-step-title">Documento y contacto</div>
              <p className="form-step-subtitle">
                Datos de identificación del cliente, teléfonos y correo.
              </p>
            </div>
            <span className="form-step-pill">Paso 2 de 8</span>
          </div>
          <div className="form-step-body space-y-3">
            <FieldRow cols={3}>
              <div>
                <label className="label">Tipo de documento *</label>
                <select
                  className="select"
                  value={tipoDocumento}
                  onChange={(e) => setTipoDocumento(e.target.value as any)}
                >
                  <option value="">Seleccionar</option>
                  {DOC_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Cédula *</label>
                <input
                  inputMode="numeric"
                  className="input"
                  value={cedula}
                  onChange={(e) => setCedula(digits(e.target.value, 12))}
                  placeholder="Sólo números"
                />
              </div>
              <div>
                <label className="label">Celular (10 dígitos) *</label>
                <input
                  inputMode="numeric"
                  className="input"
                  value={celular}
                  onChange={(e) => setCelular(digits(e.target.value, 10))}
                  placeholder="XXXXXXXXXX"
                />
              </div>
            </FieldRow>

            <FieldRow cols={3}>
              <div>
                <label className="label">Número de grabación *</label>
                <input
                  className="input"
                  value={numeroGrabacion}
                  onChange={(e) => setNumeroGrabacion(e.target.value)}
                  placeholder="ID de audio / radicado"
                />
              </div>
              <div>
                <label className="label">Email *</label>
                <input
                  className="input"
                  value={emailCliente}
                  onChange={(e) => setEmailCliente(e.target.value)}
                  placeholder="cliente@correo.com"
                />
              </div>
              <div>
                <label className="label">
                  Número adicional (10 dígitos) *
                </label>
                <input
                  inputMode="numeric"
                  className="input"
                  value={numeroAdicional}
                  onChange={(e) =>
                    setNumeroAdicional(digits(e.target.value, 10))
                  }
                  placeholder="XXXXXXXXXX"
                />
              </div>
            </FieldRow>
          </div>
        </div>
      )}

      {/* Paso 2: cliente */}
      {step === 2 && (
        <div className="form-step">
          <div className="form-step-header">
            <div>
              <div className="form-step-title">Datos del cliente</div>
              <p className="form-step-subtitle">
                Nombre completo y fechas asociadas al documento del cliente.
              </p>
            </div>
            <span className="form-step-pill">Paso 3 de 8</span>
          </div>
          <div className="form-step-body space-y-3">
            <FieldRow cols={2}>
              <div>
                <label className="label">Nombre del cliente *</label>
                <input
                  className="input"
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                  placeholder="Nombre y apellidos"
                />
              </div>
              <div>
                <label className="label">Fecha de nacimiento *</label>
                <input
                  type="date"
                  className="input"
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                />
              </div>
            </FieldRow>
            <FieldRow cols={1}>
              <div>
                <label className="label">Fecha de expedición *</label>
                <input
                  type="date"
                  className="input"
                  value={fechaExpedicion}
                  onChange={(e) => setFechaExpedicion(e.target.value)}
                />
              </div>
            </FieldRow>
          </div>
        </div>
      )}

      {/* Paso 3: dirección */}
      {step === 3 && (
        <div className="form-step">
          <div className="form-step-header">
            <div>
              <div className="form-step-title">Dirección y zona</div>
              <p className="form-step-subtitle">
                Ubicación principal del cliente para la instalación o entrega.
              </p>
            </div>
            <span className="form-step-pill">Paso 4 de 8</span>
          </div>
          <div className="form-step-body space-y-3">
            <FieldRow cols={2}>
              <div>
                <label className="label">Dirección *</label>
                <input
                  className="input"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Calle, número, apto"
                />
              </div>
              <div>
                <label className="label">Departamento *</label>
                <input
                  className="input"
                  value={departamento}
                  onChange={(e) => setDepartamento(e.target.value)}
                />
              </div>
            </FieldRow>
            <FieldRow cols={2}>
              <div>
                <label className="label">Ciudad *</label>
                <input
                  className="input"
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  placeholder="Ej.: Bogotá"
                />
              </div>
              <div>
                <label className="label">Barrio *</label>
                <input
                  className="input"
                  value={barrio}
                  onChange={(e) => setBarrio(e.target.value)}
                />
              </div>
            </FieldRow>
            <FieldRow cols={1}>
              <div>
                <label className="label">Vereda</label>
                <input
                  className="input"
                  value={vereda}
                  onChange={(e) => setVereda(e.target.value)}
                />
              </div>
            </FieldRow>
            <FieldRow cols={1}>
              <div>
                <label className="label">Recorrido / Nota</label>
                <textarea
                  className="input"
                  style={{ minHeight: 90 }}
                  value={recorrido}
                  onChange={(e) => setRecorrido(e.target.value)}
                  placeholder="Describe el recorrido o notas adicionales (opcional)"
                />
              </div>
            </FieldRow>
          </div>
        </div>
      )}

      {/* Paso 4: venta / operadores */}
      {step === 4 && (
        <div className="form-step">
          <div className="form-step-header">
            <div>
              <div className="form-step-title">Tipo de venta y operadores</div>
              <p className="form-step-subtitle">
                Define si es línea nueva, portabilidad o migración y la
                validación de identidad.
              </p>
            </div>
            <span className="form-step-pill">Paso 5 de 8</span>
          </div>
          <div className="form-step-body space-y-3">
            <FieldRow cols={2}>
              <div>
                <label className="label">Tipo de venta *</label>
                <select
                  className="select"
                  value={tipoVenta}
                  onChange={(e) => setTipoVenta(e.target.value as any)}
                >
                  <option value="">Seleccionar</option>
                  <option value="LINEA_NUEVA">Línea nueva</option>
                  <option value="PORTA_POSTPAGO">Portabilidad pospago</option>
                  <option value="PORTA_PREPAGO">Portabilidad prepago</option>
                  <option value="MIGRACION">Migración</option>
                </select>
              </div>
              <div>
                <label className="label">Validación de identidad *</label>
                <select
                  className="select"
                  value={evaluacionIdentidad}
                  onChange={(e) =>
                    setEvaluacionIdentidad(e.target.value as any)
                  }
                >
                  <option value="">Seleccionar</option>
                  {EVAL_ID.map((v) => (
                    <option key={v} value={v}>
                      {v?.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </FieldRow>

            <FieldRow cols={2}>
              <div>
                <label className="label">
                  Operador donante {isPorta ? "*" : ""}
                </label>
                <select
                  className="select"
                  value={operadorDonante}
                  onChange={(e) => setOperadorDonante(e.target.value as any)}
                  disabled={!isPorta}
                >
                  <option value="">Seleccionar</option>
                  {DONANTE.map((d) => (
                    <option key={d} value={d}>
                      {d?.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </FieldRow>

            <FieldRow cols={2}>
              <div>
                <label className="label">
                  Número a portar (10) {isPorta ? "*" : ""}
                </label>
                <input
                  inputMode="numeric"
                  className="input"
                  value={numeroAPortar}
                  onChange={(e) =>
                    setNumeroAPortar(digits(e.target.value, 10))
                  }
                  placeholder="XXXXXXXXXX"
                  disabled={!isPorta}
                />
              </div>
              <div>
                <label className="label">NIP (5) {isPorta ? "*" : ""}</label>
                <input
                  inputMode="numeric"
                  className="input"
                  value={nip}
                  onChange={(e) => setNip(digits(e.target.value, 5))}
                  placeholder="XXXXX"
                  disabled={!isPorta}
                />
              </div>
            </FieldRow>
          </div>
        </div>
      )}

      {/* Paso 5: plan / oferta */}
      {step === 5 && (
        <div className="form-step">
          <div className="form-step-header">
            <div>
              <div className="form-step-title">Plan y oferta</div>
              <p className="form-step-subtitle">
                Define el plan general, código de oferta y el cargo fijo
                mensual.
              </p>
            </div>
            <span className="form-step-pill">Paso 6 de 8</span>
          </div>
          <div className="form-step-body space-y-3">
            <FieldRow cols={2}>
              <div>
                <label className="label">Plan general *</label>
                <select
                  className="select"
                  value={planGeneral}
                  onChange={(e) => setPlanGeneral(e.target.value as any)}
                >
                  <option value="">Seleccionar</option>
                  <option value="CONECTADOS">Conectado</option>
                  <option value="POWER">Power</option>
                  <option value="PREPAGO">Prepago</option>
                </select>
              </div>
              <div>
                <label className="label">ID Descuento de la oferta *</label>
                <input
                  className="input"
                  value={idDescuentoOferta}
                  onChange={(e) => setIdDescuentoOferta(e.target.value)}
                  placeholder="Ej.: OFF-12345"
                />
              </div>
            </FieldRow>

            <FieldRow cols={2}>
              <div>
                <label className="label">Código del plan adquirido *</label>
                <input
                  className="input"
                  value={codigoPlanAdquirir}
                  onChange={(e) => setCodigoPlanAdquirir(e.target.value)}
                />
              </div>
              <div>
                <label className="label">Fecha de activación *</label>
                <input
                  type="date"
                  className="input"
                  value={fechaActivacion}
                  onChange={(e) => setFechaActivacion(e.target.value)}
                />
              </div>
            </FieldRow>

            <FieldRow cols={1}>
              <div>
                <label className="label">CFM (Cargo Fijo Mensual) *</label>
                <input
                  inputMode="numeric"
                  className="input"
                  value={cargoFijoMensual}
                  onChange={(e) =>
                    setCargoFijoMensual(digits(e.target.value, 7))
                  }
                  placeholder="0"
                />
              </div>
            </FieldRow>
          </div>
        </div>
      )}

      {/* Paso 6: logística / SIM / red */}
      {step === 6 && (
        <div className="form-step">
          <div className="form-step-header">
            <div>
              <div className="form-step-title">Logística, SIM y red</div>
              <p className="form-step-subtitle">
                Define cómo se entrega la SIM, tipo de contrato y si el cliente
                ya es Todo Claro.
              </p>
            </div>
            <span className="form-step-pill">Paso 7 de 8</span>
          </div>
          <div className="form-step-body space-y-3">
            <FieldRow cols={3}>
              <div>
                <label className="label">Envío logístico *</label>
                <select
                  className="select"
                  value={envioLogistico}
                  onChange={(e) => setEnvioLogistico(e.target.value as any)}
                >
                  <option value="">Seleccionar</option>
                  <option value="CLIENTE_COMPRA_SIM">Cliente compra SIM</option>
                  <option value="ENTREGA_LOGISTICA">Entrega logística</option>
                  <option value="MIGRACION">Migración</option>
                </select>
              </div>
              <div>
                <label className="label">Cliente Todo Claro *</label>
                <select
                  className="select"
                  value={clienteTodoClaro}
                  onChange={(e) => setClienteTodoClaro(e.target.value as any)}
                >
                  <option value="">Seleccionar</option>
                  <option value="SI">Sí</option>
                  <option value="NO">No</option>
                </select>
              </div>
              <div>
                <label className="label">Tipo de contrato *</label>
                <select
                  className="select"
                  value={tipoContrato}
                  onChange={(e) => setTipoContrato(e.target.value as any)}
                >
                  <option value="">Seleccionar</option>
                  <option value="CONTRATO_DIGITAL">Contrato digital</option>
                  <option value="CONTRATO_GRABADO">Contrato grabado</option>
                </select>
              </div>
            </FieldRow>

            <FieldRow cols={2}>
              <div>
                <label className="label">Red del equipo *</label>
                <select
                  className="select"
                  value={redEquipo}
                  onChange={(e) => setRedEquipo(e.target.value as any)}
                >
                  <option value="">Seleccionar</option>
                  {RED_OPTS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">SIM adquirida *</label>
                <select
                  className="select"
                  value={simAdquirida}
                  onChange={(e) => setSimAdquirida(e.target.value as any)}
                >
                  <option value="">Seleccionar</option>
                  {SIM_OPTS.map((s) => (
                    <option key={s} value={s}>
                      {s === "SI" ? "Sí" : "No"}
                    </option>
                  ))}
                </select>
              </div>
            </FieldRow>

            <FieldRow cols={1}>
              <div>
                <label className="label">
                  ICCID {simAdquirida === "SI" ? "*" : ""}
                </label>
                <input
                  inputMode="numeric"
                  className="input"
                  value={iccid}
                  onChange={(e) => setIccid(digits(e.target.value, 20))}
                  placeholder="19–20 dígitos"
                />
              </div>
            </FieldRow>

            <FieldRow cols={1}>
              <div>
                <label className="label">Tipificación *</label>
                <select
                  className="select"
                  value={tipificacion}
                  onChange={(e) => setTipificacion(e.target.value as any)}
                >
                  <option value="">Seleccionar</option>
                  {TIPIFICACION_OPTS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </FieldRow>
          </div>
        </div>
      )}

      {/* Paso 7: resumen / observación */}
      {step === 7 && (
        <div className="form-step">
          <div className="form-step-header">
            <div>
              <div className="form-step-title">
                Resumen y observación final
              </div>
              <p className="form-step-subtitle">
                Revisa que los datos estén correctos y escribe una observación
                clara antes de enviar.
              </p>
            </div>
            <span className="form-step-pill">Paso 8 de 8</span>
          </div>
          <div className="form-step-body space-y-3">
            <div className="grid-2">
              <div>
                <div>
                  <b>Cliente:</b> {cliente || "-"}
                </div>
                <div className="note">Cédula: {cedula || "-"}</div>
                <div className="note">Celular: {celular || "-"}</div>
                <div className="note">
                  Recorrido: {recorrido ? recorrido.slice(0, 120) : "-"}
                </div>
              </div>
              <div>
                <div>
                  <b>Venta:</b> {(tipoVenta || "").toString().replaceAll("_", " ")}
                </div>
                <div className="note">Operador destino: {operador}</div>
                <div className="note">Donante: {operadorDonante || "-"}</div>
                <div className="note">Monto: {monto || 0}</div>
              </div>
            </div>
            <FieldRow cols={1}>
              <div>
                <label className="label">Observación *</label>
                <textarea
                  className="input"
                  style={{ minHeight: 90 }}
                  value={observacion}
                  onChange={(e) => setObservacion(e.target.value)}
                  placeholder="Comentarios relevantes…"
                />
              </div>
            </FieldRow>
          </div>
        </div>
      )}

      <div className="modal-actions">
        <button
          className="btn"
          onClick={() => (step > 0 ? setStep(step - 1) : onClose())}
        >
          {step > 0 ? "Atrás" : "Cancelar"}
        </button>
        {step < steps.length - 1 ? (
          <button
            className="btn primary"
            onClick={() =>
              canNext()
                ? setStep(step + 1)
                : setMsg("Revisa los campos obligatorios del paso.")
            }
          >
            Siguiente
          </button>
        ) : (
          <button className="btn primary" onClick={submit}>
            Enviar
          </button>
        )}
      </div>

      {msg && <p className="form-msg">{msg}</p>}
    </Modal>
  );
}
