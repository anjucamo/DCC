# DCC-CRM - CRM para Digital Contact Center

## 1. Justificación del Proyecto

En un entorno de contact center dinámico, la gestión manual o descentralizada del ciclo de vida de las ventas (desde el registro por parte del asesor hasta la aprobación por el back office) genera ineficiencias, retrasa los procesos, dificulta la visibilidad del rendimiento en tiempo real y puede llevar a errores en el cálculo de comisiones o metas. Este proyecto nace de la necesidad de centralizar y automatizar dicho flujo.

## 2. Objetivo General

Implementar una solución de CRM web que centralice y automatice el registro, seguimiento y aprobación de ventas, mejorando la eficiencia operativa del equipo de asesores y back office, y proporcionando visibilidad en tiempo real sobre el rendimiento y las metas del Digital Contact Center.

**Nota:** Este es un objetivo general propuesto. Se recomienda reemplazarlo por el objetivo definido formalmente en el acta de inicio del proyecto.

## 3. Tecnologías Utilizadas

-   **Framework Frontend**: React
-   **Lenguaje**: TypeScript
-   **Herramientas de Desarrollo**: Vite
-   **Backend y Base de Datos**: Supabase
-   **Visualización de Datos**: Recharts
-   **Iconos**: Lucide React

## 4. Características Principales

-   **Autenticación de usuarios**: Sistema de inicio de sesión seguro basado en roles (Asesor, Back Office, Admin) utilizando Supabase.
-   **Gestión de ventas**: Los asesores pueden crear, ver y editar sus propias ventas.
-   **Flujo de aprobación**: El personal de back office puede revisar, aprobar o rechazar las ventas enviadas por los asesores.
-   **Paneles de control por rol**: Interfaces de usuario personalizadas para cada tipo de usuario.
-   **Persistencia de datos**: Almacenamiento de datos fiable y en tiempo real con Supabase.

## 5. Cómo Empezar

Siga estas instrucciones para poner en marcha el proyecto en su máquina local.

### Requisitos Previos

-   Node.js (v18 o superior)
-   npm (incluido con Node.js)
-   Una cuenta de Supabase

### Instalación

1.  Clone este repositorio:
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd DCC-CRM
    ```
2.  Instale las dependencias:
    ```bash
    npm install
    ```
3.  Configure sus variables de entorno creando un archivo `.env` en la raíz del proyecto con el siguiente contenido:
    ```
    VITE_SUPABASE_URL=https://<SU_ID_DE_PROYECTO>.supabase.co
    VITE_SUPABASE_ANON_KEY=<SU_LLAVE_ANONIMA>
    ```
    *Puede encontrar estas claves en la sección de configuración de la API de su proyecto de Supabase.*

4.  Configure la base de datos de Supabase ejecutando los scripts `supabase-setup.sql` y `supabase-seed-list.sql` en el editor de SQL de su panel de Supabase.

## 6. Uso de la Aplicación

Una vez completada la configuración, inicie la aplicación:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

### Flujo de Trabajo

1.  Un **asesor** registra una nueva venta (estado `PENDIENTE`).
2.  Un miembro de **back office** la revisa y la `APRUEBA` o `RECHAZA`. Si se rechaza, debe incluir una razón.
3.  El asesor puede corregir y reenviar las ventas `RECHAZADAS`.

## 7. Scripts Disponibles

-   `npm run dev`: Inicia el servidor de desarrollo.
-   `npm run build`: Compila la aplicación para producción.
-   `npm run preview`: Previsualiza la compilación de producción localmente.
