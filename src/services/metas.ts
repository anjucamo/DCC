// src/services/metas.ts
import { supabase } from '../lib/supabase';
import { Profile } from '../hooks/useProfile';

export async function getMiMeta(profile: Profile | null) {
  // profile: { id, full_name, sala, role, cedula }

  if (!profile) {
    return { metaMensual: 0, realizadas: 0, avance: 0 };
  }

  const hoy = new Date();
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const inicioMesStr = inicioMes.toISOString().slice(0, 10);
  const hoyStr = hoy.toISOString().slice(0, 10);

  // 1) Meta desde user_meta
  const { data: metas, error: e1 } = await supabase
    .from('user_meta')
    .select('meta_mensual')
    .eq('cedula', profile.cedula)
    .eq('month_start', inicioMesStr)
    .maybeSingle();

  if (e1) throw e1;

  const metaMensual = metas?.meta_mensual ?? 40;

  // 2) Ventas hechas en el mes
  const { data: ventasMes, error: e2 } = await supabase
    .from('sales')
    .select('id')
    .eq('asesor_id', profile.id)
    .gte('fecha', inicioMesStr)
    .lte('fecha', hoyStr)
    .eq('estado', 'APROBADA');

  if (e2) throw e2;

  const realizadas = ventasMes?.length ?? 0;
  const avance = Math.min(100, Math.round((realizadas / metaMensual) * 100));

  return { metaMensual, realizadas, avance };
}
