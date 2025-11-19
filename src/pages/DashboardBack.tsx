// src/pages/DashboardBack.tsx
import { useEffect, useState } from 'react';
import { getDashboardGlobal } from '../services/dashboard';

type DashboardData = {
  conteoHoy: number;
  totalHoy: number;
  conteoMes: number;
  totalMes: number;
};

export function DashboardBack() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    (async () => {
      const d = await getDashboardGlobal();
      setData(d);
    })();
  }, []);

  if (!data) return <p>Cargando dashboard...</p>;

  return (
    <div>
      <h1>Dashboard general</h1>

      <div className="cards">
        <div className="card">
          <h2>Ventas de hoy</h2>
          <p>Cantidad: {data.conteoHoy}</p>
          <p>Total: {data.totalHoy}</p>
        </div>

        <div className="card">
          <h2>Ventas del mes</h2>
          <p>Cantidad: {data.conteoMes}</p>
          <p>Total: {data.totalMes}</p>
        </div>
      </div>
    </div>
  );
}
