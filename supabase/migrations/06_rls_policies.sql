-- =========================================================
-- JULELY DB — SCRIPT 6: ROW LEVEL SECURITY (RLS)
-- Requiere: todos los scripts anteriores (01-05)
-- =========================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE profiles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients               ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_identity       ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations          ENABLE ROW LEVEL SECURITY;
ALTER TABLE destination_itinerary ENABLE ROW LEVEL SECURITY;
ALTER TABLE destination_options   ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities            ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings              ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices              ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments              ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts              ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_acceptances     ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────
-- PROFILES
-- ─────────────────────────────────────────────────────────
-- Cada usuario ve su propio perfil; admin puede ver todos
CREATE POLICY "profiles: ver propio o admin"
  ON profiles FOR SELECT
  USING (id = auth.uid() OR get_user_role() = 'admin');

-- Solo admin puede crear/actualizar/borrar perfiles de otros
CREATE POLICY "profiles: admin gestiona todos"
  ON profiles FOR ALL
  USING (get_user_role() = 'admin');

-- Usuario puede actualizar su propio perfil
CREATE POLICY "profiles: usuario actualiza propio"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

-- ─────────────────────────────────────────────────────────
-- CLIENTS
-- ─────────────────────────────────────────────────────────
-- Asesor solo ve sus propios clientes; otros roles ven todos
CREATE POLICY "clients: asesor ve propios"
  ON clients FOR SELECT
  USING (
    get_user_role() IN ('admin', 'supervisor', 'contabilidad', 'operaciones')
    OR created_by = auth.uid()
  );

CREATE POLICY "clients: cualquier autenticado puede crear"
  ON clients FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "clients: asesor/admin puede modificar"
  ON clients FOR UPDATE
  USING (
    get_user_role() IN ('admin', 'supervisor')
    OR created_by = auth.uid()
  );

-- Solo admin puede borrar clientes
CREATE POLICY "clients: solo admin borra"
  ON clients FOR DELETE
  USING (get_user_role() = 'admin');

-- ─────────────────────────────────────────────────────────
-- CLIENT_IDENTITY (datos sensibles: pasaporte, nacimiento)
-- ─────────────────────────────────────────────────────────
CREATE POLICY "client_identity: solo admin y contabilidad"
  ON client_identity FOR ALL
  USING (get_user_role() IN ('admin', 'contabilidad'));

-- ─────────────────────────────────────────────────────────
-- DESTINATIONS
-- ─────────────────────────────────────────────────────────
CREATE POLICY "destinations: todos ven activos"
  ON destinations FOR SELECT
  USING (is_active = TRUE OR get_user_role() IN ('admin', 'operaciones'));

CREATE POLICY "destinations: admin y operaciones gestionan"
  ON destinations FOR ALL
  USING (get_user_role() IN ('admin', 'operaciones'));

CREATE POLICY "destination_itinerary: todos ven"
  ON destination_itinerary FOR SELECT USING (TRUE);

CREATE POLICY "destination_itinerary: admin/op gestionan"
  ON destination_itinerary FOR ALL
  USING (get_user_role() IN ('admin', 'operaciones'));

CREATE POLICY "destination_options: todos ven"
  ON destination_options FOR SELECT USING (TRUE);

CREATE POLICY "destination_options: admin/op gestionan"
  ON destination_options FOR ALL
  USING (get_user_role() IN ('admin', 'operaciones'));

-- ─────────────────────────────────────────────────────────
-- ACTIVITIES
-- ─────────────────────────────────────────────────────────
CREATE POLICY "activities: todos ven activas"
  ON activities FOR SELECT
  USING (is_active = TRUE OR get_user_role() IN ('admin', 'operaciones'));

CREATE POLICY "activities: admin/op gestionan"
  ON activities FOR ALL
  USING (get_user_role() IN ('admin', 'operaciones'));

-- ─────────────────────────────────────────────────────────
-- BOOKINGS
-- ─────────────────────────────────────────────────────────
-- Asesor solo ve sus propias reservas
CREATE POLICY "bookings: asesor ve propias"
  ON bookings FOR SELECT
  USING (
    get_user_role() IN ('admin', 'supervisor', 'contabilidad', 'operaciones')
    OR assigned_to = auth.uid()
  );

CREATE POLICY "bookings: cualquier autenticado puede crear"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "bookings: asesor/admin puede modificar"
  ON bookings FOR UPDATE
  USING (
    get_user_role() IN ('admin', 'supervisor')
    OR assigned_to = auth.uid()
  );

CREATE POLICY "bookings: solo admin borra"
  ON bookings FOR DELETE
  USING (get_user_role() = 'admin');

-- ─────────────────────────────────────────────────────────
-- FINANZAS (solo admin, contabilidad, supervisor)
-- ─────────────────────────────────────────────────────────
CREATE POLICY "invoices: roles financieros"
  ON invoices FOR ALL
  USING (get_user_role() IN ('admin', 'contabilidad', 'supervisor'));

CREATE POLICY "payments: roles financieros"
  ON payments FOR ALL
  USING (get_user_role() IN ('admin', 'contabilidad', 'supervisor'));

CREATE POLICY "receipts: roles financieros"
  ON receipts FOR ALL
  USING (get_user_role() IN ('admin', 'contabilidad', 'supervisor'));

CREATE POLICY "legal_acceptances: admin y contabilidad"
  ON legal_acceptances FOR ALL
  USING (get_user_role() IN ('admin', 'contabilidad'));
