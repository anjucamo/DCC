
import { supabase } from "./supabase";
import { Sale } from "../types";

const LS_SALES = "dcc_sales_v2";

export async function saveSaleInSupabase(sale: Sale) {
  try {
    const { error } = await supabase
      .from("ventas") // 👈 tu tabla REAL
      .upsert(
        {
          // OJO: usa los nombres de columnas que tienes en Supabase
          identificacion: sale.id, // uuid (mismo id que en el front)
          esos_id: sale.asesorId, // si tu columna se llama distinto, cámbialo
          asesor: sale.asesor,
          sala: sale.sala,
          fecha: sale.fecha, // "YYYY-MM-DD"
          cliente: sale.cliente,
          numero_aportar: sale.numeroAPortar || null,
          cedula: sale.cedula || null,
          estado: sale.estado,
          monto: sale.monto ?? null,
          // si creaste una columna "raw jsonb", puedes descomentar:
          // raw: sale
        },
        { onConflict: "identificacion" } // si ya existe, la actualiza
      );

    if (error) {
      console.error("Error guardando venta en Supabase", error);
    }
  } catch (err) {
    console.error("Error inesperado guardando venta en Supabase", err);
  }
}

export function loadSales(): Sale[] {
  try {
    const raw = localStorage.getItem(LS_SALES);
    if (raw) return JSON.parse(raw) as Sale[];
  } catch {}
  return [];
}

export function saveSales(arr: Sale[]) {
  try {
    localStorage.setItem(LS_SALES, JSON.stringify(arr));
  } catch {}
}
