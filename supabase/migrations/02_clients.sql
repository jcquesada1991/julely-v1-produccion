-- =========================================================
-- JULELY DB — SCRIPT 2: CLIENTES
-- Requiere: 01_profiles_roles.sql
-- =========================================================

-- 2A. Tabla principal de clientes (datos de contacto)
CREATE TABLE clients (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by    UUID REFERENCES profiles(id),
  name          TEXT NOT NULL,
  surname       TEXT,
  phone         TEXT,
  email         TEXT,
  address       TEXT,
  notes         TEXT,
  booking_date  DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2B. Tabla de identidad (datos sensibles separados — acceso restringido)
CREATE TABLE client_identity (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id          UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  passport_number    TEXT,
  passport_expiry    DATE,
  birthdate          DATE,
  nationality        TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(client_id)
);
