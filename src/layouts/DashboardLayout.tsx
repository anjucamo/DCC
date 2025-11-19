// src/layouts/DashboardLayout.tsx
import { useProfile } from '../hooks/useProfile';
import { ReactNode } from 'react';

const menuPorRol: { [key: string]: { path: string; label: string }[] } = {
  asesor: [
    { path: '/nueva-venta', label: 'Nueva venta' },
    { path: '/mis-ventas', label: 'Mis ventas' },
    { path: '/mi-meta', label: 'Mi meta' },
  ],
  back: [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/ventas', label: 'Todas las ventas' },
    { path: '/asesores', label: 'Asesores' },
    { path: '/metas', label: 'Metas' },
  ],
};

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { profile, loading } = useProfile();

  if (loading) return <div>Cargando...</div>;
  if (!profile) return <div>No hay sesión</div>;

  const items = menuPorRol[profile.role] ?? [];

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="user-info">
          <strong>{profile.full_name}</strong>
          <span>Sala {profile.sala}</span>
          <span>Rol: {profile.role}</span>
        </div>
        <nav>
          {items.map((item: { path: string; label: string }) => (
            <a key={item.path} href={item.path}>
              {item.label}
            </a>
          ))}
        </nav>
      </aside>
      <main>{children}</main>
    </div>
  );
}
