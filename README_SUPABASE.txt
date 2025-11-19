
DCC — Supabase (sin Prisma) listo

1) Supabase
   - Entra a SQL Editor y ejecuta:
     - supabase-setup.sql (crea tabla, enum y RPC de login; agrega admin 1073513192/Admin25**)
     - supabase-seed-list.sql (carga toda tu lista con claves por rol)

2) Frontend
   - .env ya tiene tu URL/anon key
   - Instala y ejecuta:
     npm install
     npm run dev
   - Abre http://localhost:5173

3) Login
   - Por cédula + contraseña (RPC app_login_cedula)
   - Admin: 1073513192 / Admin25**
   - Users: Digital25** (según lista)
   - Back: Back25**
