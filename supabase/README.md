# Julely — Supabase Database Setup Guide

## Requisitos Previos
1. Tener un proyecto en [Supabase](https://supabase.com) creado.
2. Acceso al **SQL Editor** desde el dashboard de Supabase.

---

## Orden de Ejecución

Ejecuta los scripts `.sql` **en este orden exacto** pegando su contenido en el SQL Editor de Supabase:

| Orden | Archivo | Descripción |
|------|---------|-------------|
| 1 | `01_profiles_roles.sql` | Extensión de Auth + roles del sistema |
| 2 | `02_clients.sql` | Tabla de clientes y datos de identidad |
| 3 | `03_destinations.sql` | Destinos, itinerario y actividades |
| 4 | `04_bookings.sql` | Reservas y vouchers |
| 5 | `05_finances.sql` | Facturas, pagos, comprobantes y aceptación legal |
| 6 | `06_rls_policies.sql` | Políticas Row Level Security para todos los roles |
| 7 | `07_indexes_storage.sql` | Índices de rendimiento + Storage buckets |
| 8 | `08_seed_data.sql` | Datos iniciales (destinos, itinerarios de ejemplo) |

---

## Configurar el Primer Usuario Admin

1. Ve a **Supabase → Authentication → Users → Add User**.
2. Crea el usuario con el email del administrador (ej: `admin@julely.com`).
3. Ejecuta este comando SQL para asignarle el rol admin:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'admin@julely.com';
   ```

---

## Storage Buckets

El script `07_indexes_storage.sql` crea los siguientes buckets:

| Bucket | Visibilidad | Uso |
|--------|-------------|-----|
| `product-gallery` | Público | Imágenes de destinos y actividades |
| `vouchers-pdf` | Privado | PDFs de vouchers generados |
| `payment-proofs` | Privado | Comprobantes de pagos (Admin, Contabilidad) |
| `identity-docs` | Privado | Documentos de identidad/pasaporte (Admin, Contabilidad) |

---

## Variables de Entorno para Next.js

Una vez creada la BD, agrega a tu `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

Puedes obtenerlas en **Supabase Dashboard → Settings → API**.

---

## Resumen de Tablas

| Tabla | Filas |
|-------|-------|
| `profiles` | Usuarios del sistema |
| `clients` | Clientes/viajeros |
| `client_identity` | Datos sensibles del cliente |
| `destinations` | Destinos de viaje |
| `destination_itinerary` | Días del itinerario |
| `destination_options` | Includes/excludes/extras |
| `activities` | Excursiones y tours |
| `bookings` | Reservas/Vouchers |
| `invoices` | Facturas |
| `payments` | Registros de pago |
| `receipts` | Comprobantes |
| `legal_acceptances` | Registro de T&C aceptados |
