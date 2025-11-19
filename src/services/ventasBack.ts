// src/services/ventasBack.ts
import { supabase } from '../lib/supabase';

export async function agregarObservacionVenta(ventaId: string, nuevaObs: string, nuevoEstado?: string) {
  const timestamp = new Date().toISOString();
  const linea = `${timestamp}: ${nuevaObs}`;

  const updateData: any = {
    obs_hist: [linea], // se mergea con existente con una RPC o con spread en front
  };

  if (nuevoEstado) updateData.estado = nuevoEstado;

  // Aquí lo ideal es tener una función RPC que haga: obs_hist = obs_hist || linea
  // Pero para algo sencillo, primero traemos la venta:
  const { data: venta, error: e1 } = await supabase
    .from('sales')
    .select('obs_hist')
    .eq('id', ventaId)
    .single();

  if (e1) throw e1;

  const anterior = venta?.obs_hist ?? [];
  const nuevoHist = [...anterior, linea];

  const { error: e2 } = await supabase
    .from('sales')
    .update({ obs_hist: nuevoHist, estado: nuevoEstado ?? (venta as any).estado })
    .eq('id', ventaId);

  if (e2) throw e2;
}
