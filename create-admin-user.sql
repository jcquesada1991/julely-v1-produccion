-- Script para crear usuario administrador en Julely Travel
-- Ejecutar este script en: Supabase Dashboard > SQL Editor

-- PASO 1: Primero crea el usuario en Authentication desde el Dashboard de Supabase
-- O usa la función de Supabase para crear usuario (requiere extensión)

-- PASO 2: Después de crear el usuario en Auth, copia su UUID y reemplázalo aquí
-- Luego ejecuta este INSERT para crear su perfil:

INSERT INTO profiles (id, full_name, role, is_active, created_at)
VALUES (
  'REEMPLAZA-CON-EL-UUID-DEL-USUARIO',  -- UUID del usuario creado en Auth
  'Administrador Julely',                -- Nombre completo
  'admin',                                -- Rol: admin, asesor, supervisor, contabilidad, operaciones
  true,                                   -- Usuario activo
  NOW()                                   -- Fecha de creación
);

-- CREDENCIALES DE EJEMPLO:
-- Email: admin@julely.com
-- Password: JulelyAdmin2024!
-- Rol: admin (acceso completo)

-- NOTAS:
-- 1. El UUID debe coincidir exactamente con el ID del usuario en auth.users
-- 2. Los roles disponibles son: admin, asesor, supervisor, contabilidad, operaciones
-- 3. Solo 'admin' tiene acceso completo al sistema
