export const MOCK_DATA = {
    users: [
        {
            id: 1,
            email: "admin@travelagendy.com",
            password: "admin", // En un caso real esto estaría hasheado
            name: "Administradora"
        }
    ],
    destinations: [
        {
            id: 1,
            currency: "USD",
            price: 2500,
            title: "Santorini",
            subtitle: "La joya del Egeo te espera",
            category: "Premium",
            airport_code: "JTR",
            isPremium: true,
            hero_image_url: "https://images.unsplash.com/photo-1613395877344-13d4c79e4284?q=80&w=2668&auto=format&fit=crop",
            description_long: "Disfruta de una experiencia inolvidable en una de las islas más hermosas del mundo. Santorini te ofrece atardeceres mágicos, gastronomía exquisita y playas de arena volcánica.",
            itinerary: [
                { day: 1, title: "Llegada y Bienvenida", description: "Transfer privado al hotel y cena de bienvenida con vista a la caldera." },
                { day: 2, title: "Crucero en Catamarán", description: "Recorrido por las islas volcánicas, aguas termales y almuerzo a bordo." },
                { day: 3, title: "Cata de Vinos", description: "Visita a las bodegas más exclusivas de la isla para degustar vinos locales." },
                { day: 4, title: "Día Libre y Despedida", description: "Tiempo para compras en Oia y cena de despedida." }
            ],
            includes: [
                "Vuelos clase ejecutiva",
                "Alojamiento 5 estrellas",
                "Desayunos y Cenas",
                "Traslados privados"
            ],
            extras: [
                "Seguro de viaje premium",
                "Guía personal en español"
            ],
            target: {
                title: "Parejas y Luna de Miel",
                content: "Ideal para quienes buscan romance, privacidad y lujo absoluto."
            }
        },
        {
            id: 2,
            currency: "USD",
            price: 4200,
            title: "Tokio",
            subtitle: "Contrastes entre templos milenarios y neón",
            category: "Business",
            airport_code: "NRT",
            isPremium: false,
            hero_image_url: "https://images.unsplash.com/photo-1528360983277-13d9012356ee?q=80&w=2670&auto=format&fit=crop",
            description_long: "Un viaje fascinante que recorre Tokio, Kioto y Osaka. Sumérgete en la cultura japonesa, desde la ceremonia del té hasta la tecnología más avanzada.",
            itinerary: [
                { day: 1, title: "Llegada a Tokio", description: "Recepción en Narita y traslado al hotel en Shinjuku." },
                { day: 2, title: "Tokio Moderno", description: "Visita a Shibuya, Akihabara y subida al Skytree." },
                { day: 3, title: "Kioto Histórico", description: "Viaje en tren bala y visita al Pabellón Dorado." },
                { day: 5, title: "Osaka Gastronómico", description: "Tour de comida callejera en Dotonbori." }
            ],
            includes: [
                "JR Pass 7 días",
                "Hoteles 4 y 5 estrellas",
                "Guía bilingüe",
                "Entradas a templos"
            ],
            extras: [
                "Cena con Maiko",
                "Entradas a Universal Studios"
            ],
            target: {
                title: "Cultura y Aventura",
                content: "Perfecto para amantes de la historia, la comida y la fotografía."
            }
        },
        {
            id: 3,
            currency: "USD",
            price: 3800,
            title: "Dubai",
            subtitle: "Lujo y modernidad en el desierto",
            category: "First Class",
            airport_code: "DXB",
            isPremium: false,
            hero_image_url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2670&auto=format&fit=crop",
            description_long: "Experimenta el lujo extremo en la ciudad más moderna del mundo. Dubai combina rascacielos impresionantes, playas paradisíacas y el desierto árabe.",
            itinerary: [
                { day: 1, title: "Llegada a Dubai", description: "Transfer al hotel Burj Al Arab y bienvenida VIP." },
                { day: 2, title: "Safari en el Desierto", description: "Aventura en 4x4 y cena bajo las estrellas." },
                { day: 3, title: "Burj Khalifa", description: "Visita al edificio más alto del mundo." },
                { day: 4, title: "Compras en Dubai Mall", description: "Shopping de lujo y espectáculo de fuentes." }
            ],
            includes: [
                "Vuelos primera clase",
                "Hotel 7 estrellas",
                "Todas las comidas",
                "Chofer privado 24/7"
            ],
            extras: [
                "Vuelo en helicóptero",
                "Cena en el Burj Khalifa"
            ],
            target: {
                title: "Lujo Extremo",
                content: "Para quienes buscan la experiencia más exclusiva y lujosa."
            }
        },
        {
            id: 4,
            currency: "USD",
            price: 5200,
            title: "Maldivas",
            subtitle: "Paraíso tropical exclusivo",
            category: "Premium",
            airport_code: "MLE",
            isPremium: false,
            hero_image_url: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=2665&auto=format&fit=crop",
            description_long: "Relájate en un resort overwater de lujo rodeado de aguas cristalinas. Las Maldivas ofrecen privacidad absoluta y belleza natural incomparable.",
            itinerary: [
                { day: 1, title: "Llegada en Hidroavión", description: "Transfer privado al resort en hidroavión." },
                { day: 2, title: "Snorkel y Buceo", description: "Explora los arrecifes de coral más hermosos." },
                { day: 3, title: "Spa y Relax", description: "Tratamientos de spa con vista al océano." },
                { day: 4, title: "Cena Romántica", description: "Cena privada en la playa bajo las estrellas." }
            ],
            includes: [
                "Vuelos business class",
                "Villa overwater privada",
                "Todo incluido premium",
                "Actividades acuáticas"
            ],
            extras: [
                "Excursión de pesca",
                "Masaje de parejas"
            ],
            target: {
                title: "Romance y Desconexión",
                content: "Ideal para lunas de miel y escapadas románticas."
            }
        },
        {
            id: 5,
            currency: "USD",
            price: 2800,
            title: "París",
            subtitle: "La ciudad del amor y la cultura",
            category: "Economy",
            airport_code: "CDG",
            isPremium: false,
            hero_image_url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2673&auto=format&fit=crop",
            description_long: "Descubre la magia de París, desde la Torre Eiffel hasta los Campos Elíseos. Arte, gastronomía y romance en cada esquina.",
            itinerary: [
                { day: 1, title: "Llegada a París", description: "Check-in en hotel boutique en Le Marais." },
                { day: 2, title: "Torre Eiffel y Louvre", description: "Visita a los iconos más famosos de París." },
                { day: 3, title: "Versalles", description: "Excursión al Palacio de Versalles." },
                { day: 4, title: "Montmartre", description: "Paseo por el barrio bohemio y Sacré-Cœur." }
            ],
            includes: [
                "Vuelos economy",
                "Hotel boutique 4 estrellas",
                "Desayunos",
                "Paris Museum Pass"
            ],
            extras: [
                "Cena en crucero por el Sena",
                "Show en Moulin Rouge"
            ],
            target: {
                title: "Cultura y Arte",
                content: "Perfecto para amantes del arte, la historia y la gastronomía."
            }
        },
        {
            id: 6,
            currency: "USD",
            price: 3200,
            title: "Nueva York",
            subtitle: "La ciudad que nunca duerme",
            category: "Business",
            airport_code: "JFK",
            isPremium: false,
            hero_image_url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2670&auto=format&fit=crop",
            description_long: "Vive la energía de Nueva York, desde Times Square hasta Central Park. Broadway, museos de clase mundial y la mejor gastronomía urbana.",
            itinerary: [
                { day: 1, title: "Llegada a Manhattan", description: "Check-in en hotel en Midtown." },
                { day: 2, title: "Estatua de la Libertad", description: "Ferry a Ellis Island y Estatua de la Libertad." },
                { day: 3, title: "Broadway y Times Square", description: "Show de Broadway y cena en Hell's Kitchen." },
                { day: 4, title: "Central Park y MoMA", description: "Paseo por el parque y visita al museo." }
            ],
            includes: [
                "Vuelos business",
                "Hotel 4 estrellas Manhattan",
                "Desayunos",
                "New York Pass"
            ],
            extras: [
                "Tickets de Broadway premium",
                "Tour en helicóptero"
            ],
            target: {
                title: "Urbano y Dinámico",
                content: "Para quienes aman la vida urbana, el arte y el entretenimiento."
            }
        },
        {
            id: 7,
            currency: "USD",
            price: 2200,
            title: "Bali",
            subtitle: "Isla de los dioses",
            category: "Economy",
            airport_code: "DPS",
            isPremium: false,
            hero_image_url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2638&auto=format&fit=crop",
            description_long: "Descubre la espiritualidad y belleza natural de Bali. Templos antiguos, arrozales en terrazas, playas vírgenes y cultura única.",
            itinerary: [
                { day: 1, title: "Llegada a Ubud", description: "Transfer a resort en el corazón de Bali." },
                { day: 2, title: "Templos y Arrozales", description: "Visita a Tanah Lot y terrazas de arroz." },
                { day: 3, title: "Yoga y Spa", description: "Sesión de yoga y tratamiento balinés." },
                { day: 4, title: "Playas de Seminyak", description: "Relax en las mejores playas de Bali." }
            ],
            includes: [
                "Vuelos economy",
                "Resort boutique",
                "Desayunos y cenas",
                "Clases de yoga"
            ],
            extras: [
                "Ceremonia de purificación",
                "Clase de cocina balinesa"
            ],
            target: {
                title: "Espiritualidad y Naturaleza",
                content: "Ideal para quienes buscan conexión espiritual y belleza natural."
            }
        }
    ],
    sales: [
        {
            id: 101,
            client_name: "Juan Pérez",
            destination_id: 1,
            date: "2023-10-25",
            status: "Confirmada",
            voucher_code: "VOU-SAN-001"
        },
        {
            id: 102,
            client_name: "María García",
            destination_id: 2,
            date: "2023-11-02",
            status: "Pendiente",
            voucher_code: "VOU-JPN-002"
        }
    ],
    // Helper para obtener venta completa con datos de destino
    getSaleDetails: function (saleId) {
        const sale = this.sales.find(s => s.id === saleId);
        if (!sale) return null;
        const destination = this.destinations.find(d => d.id === sale.destination_id);
        return { ...sale, destination };
    }
};
