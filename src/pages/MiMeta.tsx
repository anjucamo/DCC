// src/pages/MiMeta.tsx
import { useEffect, useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import { getMiMeta } from '../services/metas';

type Meta = {
  metaMensual: number;
  realizadas: number;
  avance: number;
};

export function MiMeta() {
  const { profile } = useProfile();
  const [data, setData] = useState<Meta | null>(null);

  useEffect(() => {
    if (!profile) return;
    (async () => {
      const d = await getMiMeta(profile);
      setData(d);
    })();
  }, [profile]);

  if (!profile || !data) return <p>Cargando...</p>;

  return (
    <div>
      <h1>Mi meta mensual</h1>
      <p>Meta: {data.metaMensual} ventas aprobadas</p>
      <p>Realizadas: {data.realizadas}</p>
      <p>Avance: {data.avance}%</p>

      <div
        style={{
          border: '1px solid #ccc',
          borderRadius: 6,
          overflow: 'hidden',
          width: 300,
          height: 20,
        }}
      >
        <div
          style={{
            width: `${data.avance}%`,
            height: '100%',
            background: '#4caf50',
            transition: 'width 0.3s',
          }}
        />
      </div>
    </div>
  );
}
