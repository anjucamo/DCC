// src/pages/MisVentas.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type Venta = {
  id: string;
  fecha: string;
  cliente: string;
  producto: string;
  monto: number;
  estado: string;
};

export function MisVentas() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('TODOS');

  useEffect(() => {
    const fetchVentas = async () => {
      setLoading(true);
      let query = supabase
        .from('ventas')
        .select('id, fecha, cliente, producto, monto, estado')
        .order('fecha', { ascending: false });

      if (filtroEstado !== 'TODOS') {
        query = query.eq('estado', filtroEstado);
      }

      const { data, error } = await query;

      if (!error && data) setVentas(data);
      setLoading(false);
    };

    fetchVentas(); // Carga inicial

    const channel = supabase
      .channel('realtime-mis-ventas')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sales' },
        (payload) => {
          console.log('Cambio detectado en mis ventas:', payload);
          fetchVentas(); // Recargar ventas cuando hay un cambio
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel); // Limpiar la suscripción
    };
  }, [filtroEstado]);

  return (
    <div>
      <h1>Mis ventas</h1>

      <label>
        Estado:{' '}
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
          <option value="TODOS">Todos</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="APROBADA">Aprobada</option>
          <option value="RECHAZADA">Rechazada</option>
        </select>
      </label>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Producto</th>
              <th>Monto</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((v) => (
              <tr key={v.id}>
                <td>{v.fecha}</td>
                <td>{v.cliente}</td>
                <td>{v.producto}</td>
                <td>{v.monto}</td>
                <td>{v.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
