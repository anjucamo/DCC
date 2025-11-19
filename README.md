# Digital Contact Center — CRM (workflow de revisión)

## Ejecutar
npm install
npm run dev

## Roles demo
- Asesor: laura@empresa.com / demo
- Back:   back@empresa.com / demo
- Admin:  admin@empresa.com / demo

## Flujo
- Asesor registra venta → PENDIENTE
- BackOffice revisa → APRUEBA o RECHAZA (obligatorio motivo)
- Asesor ve RECHAZADAS con observación y puede CORREGIR y reenviar → vuelve a PENDIENTE
