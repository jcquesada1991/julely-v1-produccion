-- =========================================================
-- JULELY DB — SCRIPT 7: ÍNDICES, TRIGGERS updated_at Y STORAGE
-- Requiere: todos los scripts anteriores (01-06)
-- =========================================================

-- ─────────────────────────────────────────────────────────
-- FUNCIÓN GENÉRICA updated_at
-- ─────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Aplicar a todas las tablas con updated_at
CREATE TRIGGER trg_upd_profiles
  BEFORE UPDATE ON profiles FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_upd_clients
  BEFORE UPDATE ON clients FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_upd_client_identity
  BEFORE UPDATE ON client_identity FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_upd_destinations
  BEFORE UPDATE ON destinations FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_upd_activities
  BEFORE UPDATE ON activities FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_upd_bookings
  BEFORE UPDATE ON bookings FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────────────────
-- ÍNDICES PARA PERFORMANCE
-- ─────────────────────────────────────────────────────────
CREATE INDEX idx_bookings_client_id    ON bookings(client_id);
CREATE INDEX idx_bookings_assigned_to  ON bookings(assigned_to);
CREATE INDEX idx_bookings_destination  ON bookings(destination_id);
CREATE INDEX idx_bookings_status       ON bookings(status);
CREATE INDEX idx_bookings_travel_date  ON bookings(travel_date);
CREATE INDEX idx_clients_created_by    ON clients(created_by);
CREATE INDEX idx_clients_email         ON clients(email);
CREATE INDEX idx_dest_itinerary_dest   ON destination_itinerary(destination_id);
CREATE INDEX idx_dest_options_dest     ON destination_options(destination_id);
CREATE INDEX idx_activities_dest       ON activities(destination_id);
CREATE INDEX idx_invoices_booking      ON invoices(booking_id);
CREATE INDEX idx_payments_booking      ON payments(booking_id);
CREATE INDEX idx_payments_invoice      ON payments(invoice_id);

-- ─────────────────────────────────────────────────────────
-- STORAGE BUCKETS
-- Ejecutar en Supabase Dashboard → Storage → New Bucket
-- O también puede ejecutarse aquí si tienes el plugin storage
-- ─────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public) VALUES
  ('product-gallery', 'product-gallery', TRUE),
  ('vouchers-pdf',    'vouchers-pdf',    FALSE),
  ('payment-proofs',  'payment-proofs',  FALSE),
  ('identity-docs',   'identity-docs',   FALSE)
ON CONFLICT (id) DO NOTHING;

-- Storage: product-gallery (fotos de destinos y actividades — público)
CREATE POLICY "gallery: lectura pública"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-gallery');

CREATE POLICY "gallery: admin y operaciones suben"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-gallery' AND
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'operaciones')
  );

CREATE POLICY "gallery: admin y operaciones borran"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'product-gallery' AND
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'operaciones')
  );

-- Storage: vouchers-pdf (PDFs generados — cualquier autenticado puede leer el propio)
CREATE POLICY "vouchers: usuarios autenticados"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'vouchers-pdf' AND auth.uid() IS NOT NULL
  );

-- Storage: payment-proofs (comprobantes — solo admin y contabilidad)
CREATE POLICY "proofs: contabilidad y admin"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'payment-proofs' AND
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'contabilidad')
  );

-- Storage: identity-docs (pasaportes — solo admin y contabilidad)
CREATE POLICY "identity-docs: solo admin y contabilidad"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'identity-docs' AND
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'contabilidad')
  );
