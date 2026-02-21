-- =========================================================
-- JULELY DB — SCRIPT 4: RESERVAS (BOOKINGS / VOUCHERS)
-- Requiere: 01_profiles_roles.sql, 02_clients.sql, 03_destinations.sql
-- =========================================================

CREATE TYPE booking_status AS ENUM (
  'pendiente', 'confirmada', 'cancelada', 'completada'
);

CREATE TYPE price_display AS ENUM (
  'desglose',     -- Muestra precio detallado por persona
  'solo_total',   -- Solo total
  'ninguno'       -- No muestra precio en PDF
);

CREATE TABLE bookings (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voucher_code        TEXT UNIQUE NOT NULL,
  destination_id      UUID REFERENCES destinations(id),
  client_id           UUID REFERENCES clients(id),
  assigned_to         UUID REFERENCES profiles(id),  -- Asesor responsable

  -- Datos viajero en el voucher (editables directamente)
  client_name         TEXT NOT NULL,
  num_adults          INT DEFAULT 1,
  num_children        INT DEFAULT 0,

  -- Finanzas
  total_amount        NUMERIC(10,2) NOT NULL DEFAULT 0,
  amount_paid         NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency            TEXT DEFAULT 'USD',
  price_display       price_display DEFAULT 'solo_total',

  -- Fechas
  travel_date         DATE,
  return_date         DATE,
  booking_date        DATE NOT NULL DEFAULT CURRENT_DATE,
  emission_date       DATE NOT NULL DEFAULT CURRENT_DATE,

  -- Contenido editable del voucher
  hotel_info          JSONB DEFAULT '{}',    -- {name, address, phone, checkin, checkout}
  custom_itinerary    JSONB DEFAULT '[]',    -- Días del itinerario editados manualmente
  custom_includes     JSONB DEFAULT '[]',    -- Checklist editable del voucher
  prepared_by         TEXT,

  -- Estado
  status              booking_status NOT NULL DEFAULT 'pendiente',

  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Secuencia y función para generar código voucher automático
CREATE SEQUENCE voucher_seq START 1;

CREATE OR REPLACE FUNCTION generate_voucher_code(dest_title TEXT)
RETURNS TEXT LANGUAGE plpgsql AS $$
DECLARE
  prefix TEXT;
  seq    BIGINT;
BEGIN
  prefix := UPPER(LEFT(REGEXP_REPLACE(dest_title, '[^a-zA-Z]', '', 'g'), 3));
  seq    := NEXTVAL('voucher_seq');
  RETURN 'VOU-' || prefix || '-' || LPAD(seq::TEXT, 3, '0');
END;
$$;
