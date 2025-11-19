// src/services/dashboard.ts
import { supabase } from '../lib/supabase';

export async function getDashboardGlobal() {
  const hoy = new Date().toISOString().slice(0, 10);
  const inicioMes = new Date();
  inicioMes.setDate(1);
  const inicioMesStr = inicioMes.toISOString().slice(0, 10);

  // Total ventas hoy
  const { data: ventasHoy, error: e1 } = await supabase
    .from('sales')
    .select('id, monto')
    .eq('fecha', hoy);

  // Total ventas mes
  const { data: ventasMes, error: e2 } = await supabase
    .from('sales')
    .select('id, monto')
    .gte('fecha', inicioMesStr)
    .lte('fecha', hoy);

  if (e1 || e2) throw e1 ?? e2;

  const totalHoy = ventasHoy?.reduce((acc, v) => acc + Number(v.monto), 0) ?? 0;
  const totalMes = ventasMes?.reduce((acc, v) => acc + Number(v.monto), 0) ?? 0;

  return {
    totalHoy,
    totalMes,
    conteoHoy: ventasHoy?.length ?? 0,
    conteoMes: ventasMes?.length ?? 0,
  };
}
