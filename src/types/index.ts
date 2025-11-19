
export type Role = "asesor" | "back" | "admin";
export type User = {
  id: string;
  role: Role;
  name: string;
  email: string;
  password: string;
  sala: string;
  metas?: {
    diaria: number;
    semanal: number;
    mensual: number;
    presupuesto: number;
  };
};

export type Estado = "PENDIENTE" | "APROBADO" | "RECHAZADO";
export type Tipo = "PORTABILIDAD" | "MIGRA" | "HOGAR";

/** ===== Nuevos tipos del dominio ===== */
export type Origen = "BASE" | "REDES_SOCIALES" | "GESTION_PROPIA" | "B2CHAT";
export type TipoCliente = "POSPAGO" | "PREPAGO";
export type Tipificacion = "VENTA_MOVIL" | "VENTA_CONVERGENCIA";
export type RedEquipo = "4G" | "5G";
export type SimAdquirida = "SI" | "NO";

/** ====== Tipo principal de Venta (expandido) ====== */
export type Sale = {
  id: string;
  asesorId: string;
  asesor: string;

  sala: string; // Sala
  fecha: string; // "YYYY-MM-DD"

  cliente: string;
  tipoDocumento?: "CEDULA" | "CEDULA_EXTRANJERA";
  cedula?: string;
  celular?: string;
  numeroGrabacion?: string;
  numeroAdicional?: string;
  emailCliente?: string;

  fechaNacimiento?: string;
  fechaExpedicion?: string;

  origen?: Origen;

  iccid?: string;
  numeroAPortar?: string;
  nip?: string;

  tipoVenta?: "LINEA_NUEVA" | "PORTA_POSTPAGO" | "PORTA_PREPAGO" | "MIGRACION";
  evaluacionIdentidad?:
    | "BIOMETRIA_FACIAL_EXTERNA"
    | "VALIDACION_ID"
    | "VISION_OTP"
    | "POLIEDRO"
    | "BIOMETRIA_FACIAL"
    | "POLIEDRO_OTP"
    | "SAFE"
    | "BASE_SIN_VALIDACION";

  direccion?: string;
  departamento?: string;
  ciudad?: string;
  barrio?: string;
  vereda?: string;
  recorrido?: string;

  operador: string;
  operadorDonante?:
    | "TIGO"
    | "MOVISTAR"
    | "WOM"
    | "ETB"
    | "VIRGIN"
    | "MOVIL_EXITO"
    | "OTRO";

  planGeneral?: "CONECTADOS" | "POWER" | "PREPAGO";
  planId?: string;
  idDescuentoOferta?: string;
  descuentoOferta?: number;
  codigoPlanAdquirir?: string;
  fechaActivacion?: string;
  cargoFijoMensual?: number;

  envioLogistico?: "CLIENTE_COMPRA_SIM" | "ENTREGA_LOGISTICA" | "MIGRACION";
  clienteTodoClaro?: "SI" | "NO";
  tipoContrato?: "CONTRATO_GRABADO" | "CONTRATO_DIGITAL";

  redEquipo?: RedEquipo;
  simAdquirida?: SimAdquirida;
  tipificacion?: Tipificacion;
  tipoCliente?: TipoCliente;

  producto: string;
  tipo: "PORTABILIDAD" | "MIGRA" | "HOGAR"; // derivado
  monto: number;
  estado: "PENDIENTE" | "APROBADO" | "RECHAZADO";
  observacion?: string;
  obsHist?: string[];
};
