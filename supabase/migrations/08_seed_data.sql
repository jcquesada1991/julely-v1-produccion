-- =========================================================
-- JULELY DB — SCRIPT 8: DATOS INICIALES (SEED)
-- Requiere: todos los scripts anteriores (01-07)
-- NOTA: Reemplaza los UUIDs de ejemplo con tus propios valores
--       Primero crea un usuario admin en Supabase Auth,
--       luego actualiza su rol aquí.
-- =========================================================

-- Actualizar rol del primer usuario admin
-- (reemplaza el email con tu email real de administrador)
UPDATE profiles
SET role = 'admin'
WHERE email = 'admin@julely.com';

-- Destino 1: París
INSERT INTO destinations (title, subtitle, description_long, category, airport_code, currency, price_adult, hero_image_url, is_active)
VALUES (
  'París',
  'La ciudad del amor y la cultura',
  'Descubre la magia de París, la Ciudad de la Luz, desde la icónica Torre Eiffel hasta los paseos por los Campos Elíseos. Sumérgete en el arte visitando el Louvre o el Museo de Orsay y déjate llevar por el romanticismo de Montmartre.',
  'Economy',
  'CDG',
  'USD',
  2800.00,
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2673&auto=format&fit=crop',
  TRUE
);

-- Destino 2: Maldivas
INSERT INTO destinations (title, subtitle, description_long, category, airport_code, currency, price_adult, hero_image_url, is_active)
VALUES (
  'Maldivas',
  'Paraíso tropical exclusivo',
  'Relájate en un resort overwater de lujo rodeado de aguas cristalinas color turquesa. Las Maldivas ofrecen privacidad absoluta y belleza natural incomparable, ideales para desconectar del estrés diario.',
  'Premium',
  'MLE',
  'USD',
  5200.00,
  'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=2665&auto=format&fit=crop',
  TRUE
);

-- Destino 3: Dubai
INSERT INTO destinations (title, subtitle, description_long, category, airport_code, currency, price_adult, hero_image_url, is_active)
VALUES (
  'Dubai',
  'Lujo y modernidad en el desierto',
  'Experimenta el lujo extremo en la ciudad más moderna del mundo, donde lo imposible se hace realidad. Dubai combina rascacielos impresionantes como el Burj Khalifa con playas paradisíacas de aguas cálidas.',
  'First Class',
  'DXB',
  'USD',
  3800.00,
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2670&auto=format&fit=crop',
  TRUE
);

-- Itinerario de París (usando id del destino creado arriba)
WITH paris AS (SELECT id FROM destinations WHERE title = 'París' LIMIT 1)
INSERT INTO destination_itinerary (destination_id, day_number, title, description)
SELECT paris.id, day_number, title, description FROM paris,
(VALUES
  (1, 'Llegada a París', 'Check-in en hotel boutique en Le Marais.'),
  (2, 'Torre Eiffel y Louvre', 'Visita a los iconos más famosos de París.'),
  (3, 'Versalles', 'Excursión al Palacio de Versalles.'),
  (4, 'Montmartre', 'Paseo por el barrio bohemio y Sacré-Cœur.')
) AS days(day_number, title, description);

-- Incluye de París
WITH paris AS (SELECT id FROM destinations WHERE title = 'París' LIMIT 1)
INSERT INTO destination_options (destination_id, type, label, sort_order)
SELECT paris.id, 'include', label, sort_order FROM paris,
(VALUES
  ('Vuelos economy', 1),
  ('Hotel boutique 4 estrellas', 2),
  ('Desayunos', 3),
  ('Paris Museum Pass', 4)
) AS opts(label, sort_order);

-- Actividades / Puntos de interés
WITH dubai AS (SELECT id FROM destinations WHERE title = 'Dubai' LIMIT 1)
INSERT INTO activities (destination_id, name, description, price, image_url)
SELECT dubai.id, 'Safari en el Desierto',
  'Una aventura emocionante en 4x4 por las dunas rojas de Dubai. Incluye sandboarding, paseo en camello y cena tradicional BBQ.',
  85.00,
  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2694&auto=format&fit=crop'
FROM dubai;
