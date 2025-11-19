
export const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, n));

export const pct = (a: number, b: number) =>
  clamp(Math.round((a / Math.max(1, b)) * 100));

export const fmt = (n: number) => n.toLocaleString();

/* ====== FECHAS: manejar 'YYYY-MM-DD' en zona horaria local ====== */
export const parseLocalDate = (iso: string): Date => {
  if (!iso) return new Date(NaN);
  // Esperamos formato "2025-11-18"
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1); // año, mes-1, día
};

export const isSameDay = (iso: string, base: Date = new Date()): boolean => {
  const d = parseLocalDate(iso);
  return (
    d.getFullYear() === base.getFullYear() &&
    d.getMonth() === base.getMonth() &&
    d.getDate() === base.getDate()
  );
};

export const startOfWeek = (d: Date = new Date()): Date => {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; // lunes = 0
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
};

export const endOfWeek = (d: Date = new Date()): Date => {
  const s = startOfWeek(d);
  const e = new Date(s);
  e.setDate(s.getDate() + 7);
  return e;
};

export const isThisWeek = (iso: string): boolean => {
  const t = parseLocalDate(iso);
  const s = startOfWeek();
  const e = endOfWeek();
  return t >= s && t < e;
};

export const isThisMonth = (
  iso: string,
  base: Date = new Date()
): boolean => {
  const t = parseLocalDate(iso);
  return (
    t.getFullYear() === base.getFullYear() && t.getMonth() === base.getMonth()
  );
};

export const dateMs = (iso: string): number => parseLocalDate(iso).getTime();

export const inRange = (
  iso: string,
  from?: string | null,
  to?: string | null
): boolean => {
  const t = dateMs(iso);
  return (from ? t >= dateMs(from) : true) && (to ? t <= dateMs(to) : true);
};

export const pretty = (v: any) =>
  v == null || v === "" ? "-" : String(v).replaceAll("_", " ");
export const isNonEmpty = (s?: string) => !!(s && s.trim().length > 0);
