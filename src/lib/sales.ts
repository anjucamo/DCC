// src/lib/sales.ts
import { supabase } from "./supabase";
import { Sale } from "../types";

const LS_SALES = "dcc_sales_v2";

/**
 * Guarda una venta en Supabase (tabla public.ventas)
 * usando el JSON completo en la columna crudo.
 */
export async function saveSaleInSupabase(sale: Sale) {
  try {
    const payload = {
      identificacion: sale.id,        // PK en Supabase
      esos_id: sale.asesorId,         // id interno del asesor
      asesor: sale.asesor,            // nombre del asesor
      sala: sale.sala,
      fecha: sale.fecha,              // "YYYY-MM-DD"
      cliente: sale.cliente,
      // Usa el número de grabación como numero_aportar en BD
      numero_aportar: sale.numeroGrabacion ?? null,
      cedula: sale.cedula ?? null,
      estado: sale.estado,
      monto: sale.monto ?? null,
      crudo: sale,                    // todo el objeto Sale
    };

    const { error } = await supabase.from("ventas").upsert(payload);

    if (error) {
      console.error("Error guardando venta en Supabase:", error);
    }
  } catch (e) {
    console.error("Error inesperado guardando venta en Supabase:", e);
  }
}

/**
 * Lee TODAS las ventas desde Supabase y reconstruye el tipo Sale
 * usando la columna crudo (jsonb).
 */
/**
 * Lee TODAS las ventas desde Supabase y reconstruye el tipo Sale
 * usando la columna crudo (jsonb), pero SOBREESCRIBE el estado
 * con la columna `estado` real de la tabla.
 */
export async function fetchSalesFromSupabase(): Promise<Sale[]> {
  try {
    const { data, error } = await supabase
      .from("ventas")
      .select("crudo, fecha, estado")
      .order("fecha", { ascending: false });

    if (error) {
      console.error("Error cargando ventas desde Supabase:", error);
      return [];
    }

    if (!data) return [];

    const sales: Sale[] = data
      .map((row: any) => {
        const sale = row.crudo as Sale | null;

        if (!sale || !sale.id) return null;

        // Si la fila trae `estado` en la tabla, pisamos el del JSON.
        if (row.estado) {
          sale.estado = row.estado;
        }

        return sale;
      })
      .filter((s): s is Sale => !!s);

    return sales;
  } catch (err) {
    console.error("Error inesperado cargando ventas:", err);
    return [];
  }
}


/**
 * LocalStorage: lo puedes seguir usando como caché.
 */
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
