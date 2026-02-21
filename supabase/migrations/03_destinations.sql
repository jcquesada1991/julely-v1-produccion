-- =========================================================
-- JULELY DB — SCRIPT 3: CATÁLOGO DE DESTINOS Y ACTIVIDADES
-- Requiere: 01_profiles_roles.sql
-- =========================================================

CREATE TYPE destination_category AS ENUM ('Economy', 'Premium', 'First Class');

-- 3A. Destinos
CREATE TABLE destinations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title             TEXT NOT NULL,
  subtitle          TEXT,
  description_long  TEXT,
  category          destination_category NOT NULL DEFAULT 'Economy',
  airport_code      TEXT,
  currency          TEXT NOT NULL DEFAULT 'USD',
  price_adult       NUMERIC(10,2) NOT NULL DEFAULT 0,
  price_child       NUMERIC(10,2),
  hero_image_url    TEXT,
  is_premium        BOOLEAN DEFAULT FALSE,
  is_active         BOOLEAN DEFAULT TRUE,
  created_by        UUID REFERENCES profiles(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3B. Itinerario día a día del destino
CREATE TABLE destination_itinerary (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  day_number     INT NOT NULL,
  title          TEXT NOT NULL,
  description    TEXT,
  image_url      TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3C. Opciones: include / exclude / extra por destino
CREATE TABLE destination_options (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  type           TEXT NOT NULL CHECK (type IN ('include', 'exclude', 'extra')),
  label          TEXT NOT NULL,
  sort_order     INT DEFAULT 0
);

-- 3D. Actividades / Excursiones (puntos de interés vendibles)
CREATE TABLE activities (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id  UUID REFERENCES destinations(id) ON DELETE SET NULL,
  name            TEXT NOT NULL,
  description     TEXT,
  price           NUMERIC(10,2) DEFAULT 0,
  currency        TEXT DEFAULT 'USD',
  image_url       TEXT,
  is_active       BOOLEAN DEFAULT TRUE,
  created_by      UUID REFERENCES profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
