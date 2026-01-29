FLUJO REAL DEL SISTEMA 
👩‍💼 Escenario real

El cliente llega físicamente / WhatsApp / llamada

La administradora atiende al cliente

La administradora es la única que usa el sistema

El sistema sirve para:

Gestionar destinos

Registrar ventas

Generar vouchers

Descargar PDFs profesionales para entregar al cliente

🏗️ ARQUITECTURA GENERAL DEL SISTEMA
🔐 1. LOGIN (SOLO STAFF)
Objetivo

Restringir el acceso únicamente a trabajadores de la agencia

Características visuales (MUY IMPORTANTE)

Diseño moderno y premium

Minimalista

Branding de la agencia

Animaciones suaves

Fondo con imagen de viaje o video sutil

Componentes

Logo de la agencia

Email

Password

Botón “Ingresar”

Comportamiento

Validaciones claras

Mensajes profesionales

Redirección automática al Dashboard

📊 2. DASHBOARD PRINCIPAL (POST-LOGIN)
Objetivo

Que la administradora tenga todo a primera mano

🧭 Dashboard – Secciones principales
🔹 KPIs (arriba)

Destinos activos

Ventas totales

Vouchers generados

Clientes registrados

🗺️ 3. GESTIÓN DE DESTINOS (CRUD COMPLETO)
Vista

Cards premium (NO tablas)

Imagen grande del destino

Título

Estado (Activo / Inactivo)

Acciones por destino

➕ Crear destino

✏️ Editar destino

🗑️ Eliminar destino

👁️ Ver preview del voucher

📦 Datos del destino (CLAVE)

Cada destino ES EL CONTENIDO DEL VOUCHER, por lo tanto debe guardar:

agency_name

agency_logo_url

destination_name

hero_image_url

title

subtitle

description_long

itinerary_title

itinerary_description

itinerary_content

target_title

target_content

includes_title

includes_content

extras_title

extras_content

👉 Exactamente la data que enviaste
👉 Esta data se reutiliza en:

Preview HTML

PDF final

💼 4. GESTIÓN DE VENTAS (EL CORAZÓN DEL SISTEMA)
¿Qué es una venta?

Una venta =
📍 Cliente + Destino + Voucher generado

🧾 Card de venta (MUY IMPORTANTE)

Cada venta se muestra en Cards premium con:

Nombre del cliente

Destino

Fecha de venta

Estado

Imagen del destino

Botones por venta

👁️ Ver preview del voucher (HTML)

📄 Generar / Descargar PDF

👁️ 5. PREVIEW DEL VOUCHER (HTML FULLSCREEN)

⚠️ ESTE ES EL PASO MÁS CRÍTICO

Comportamiento

Modal fullscreen o página dedicada

Scroll vertical

Se ve idéntico a un PDF

Diseño tipo revista de lujo

🎨 DISEÑO DEL VOUCHER (HTML + PDF)
🟦 PORTADA

Imagen hero (destination)

Overlay elegante

Logo agencia

Nombre del paquete

Subtitle (slogan corto)

Código de venta / voucher

🟩 DESCRIPCIÓN DEL VIAJE

Texto largo

Párrafos amplios

Tipografía elegante

Espaciado generoso

Enfoque emocional

🟨 ITINERARIO

Día X: Actividad

Bloques bien separados

Iconografía

Posible timeline vertical

🟥 SERVICIOS
Incluye

Lista con check ✔

Extras / No incluye

Lista con íconos distintos

🟪 ¿PARA QUIÉN ES ESTE VIAJE?

Público objetivo

Estilo del viaje

Nivel de personalización

🟫 FOOTER / DETALLES LEGALES

Nombre agencia

Logo pequeño

Email / Teléfono

Disclaimer legal

Fecha emisión

Código de venta

📄 6. GENERACIÓN DEL PDF
Reglas ABSOLUTAS

El PDF debe ser idéntico al HTML

Mismo layout

Mismas imágenes

Mismos colores

Mismas tipografías

Flujo

Administradora ve preview HTML

Click “Generar PDF”

Se descarga automáticamente

PDF se guarda asociado a la venta

🎯 PRINCIPIOS DE DISEÑO (NO NEGOCIABLES)

Estilo premium / luxury travel

Inspiración:

Revistas de viajes

Brochures de hoteles 5⭐

Colores:

Neutros

Dorado / beige / azul profundo

Tipografías:

Serif elegante para títulos

Sans moderna para contenido

🧠 CONCEPTO CLAVE (QUÉ ESTÁS CONSTRUYENDO)

Esto NO es solo un sistema administrativo
Es una máquina de generación de vouchers de lujo

El cliente:

No ve el sistema

Solo recibe un PDF impecable

La administradora:

Vende mejor

Profesionaliza la experiencia

Entrega algo tangible y elegante
