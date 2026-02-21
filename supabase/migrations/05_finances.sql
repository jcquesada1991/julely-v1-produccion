-- =========================================================
-- JULELY DB — SCRIPT 5: FINANZAS (FACTURAS, PAGOS, COMPROBANTES)
-- Requiere: 04_bookings.sql
-- =========================================================

CREATE TYPE payment_method AS ENUM (
  'efectivo', 'zelle', 'paypal', 'transferencia', 'tarjeta', 'otro'
);

-- 5A. Facturas
CREATE TABLE invoices (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id    UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  amount_due    NUMERIC(10,2) NOT NULL,
  due_date      DATE,           -- Auto-calculado: 60 días antes de travel_date
  is_paid       BOOLEAN DEFAULT FALSE,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger: calcular due_date automáticamente (60 días antes de salida)
CREATE OR REPLACE FUNCTION set_invoice_due_date()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.due_date IS NULL THEN
    SELECT travel_date - INTERVAL '60 days'
    INTO NEW.due_date
    FROM bookings WHERE id = NEW.booking_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_invoice_due_date
  BEFORE INSERT ON invoices
  FOR EACH ROW EXECUTE FUNCTION set_invoice_due_date();

-- 5B. Pagos
CREATE TABLE payments (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id     UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  booking_id     UUID NOT NULL REFERENCES bookings(id),
  amount         NUMERIC(10,2) NOT NULL,
  method         payment_method NOT NULL,
  fee_percent    NUMERIC(5,2) DEFAULT 0,   -- Ej: 5 para PayPal +5%
  fee_amount     NUMERIC(10,2) DEFAULT 0,  -- Monto del fee calculado
  paid_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes          TEXT,
  registered_by  UUID REFERENCES profiles(id),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger: calcular fee_amount automáticamente
CREATE OR REPLACE FUNCTION calc_payment_fee()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.fee_percent > 0 THEN
    NEW.fee_amount := ROUND(NEW.amount * NEW.fee_percent / 100, 2);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_calc_payment_fee
  BEFORE INSERT OR UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION calc_payment_fee();

-- 5C. Comprobantes de pago
CREATE TABLE receipts (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id       UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  transaction_ref  TEXT,           -- Número de transacción
  account_info     TEXT,           -- Cuenta destino (ej: Zelle: correo@email.com)
  file_url         TEXT,           -- URL en Storage bucket payment-proofs
  confirmed_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5D. Registro de aceptación de Términos y Condiciones
CREATE TABLE legal_acceptances (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id      UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  client_id       UUID REFERENCES clients(id),
  terms_version   TEXT NOT NULL DEFAULT '2025-09-15',
  accepted_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address      INET,
  method          TEXT DEFAULT 'deposit'  -- El cliente acepta al enviar el depósito
);
