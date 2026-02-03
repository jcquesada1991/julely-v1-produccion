export const MOCK_DATA = {
    users: [
        {
            id: 1,
            email: "admin@travelagendy.com",
            password: "admin", // En un caso real esto estaría hasheado
            name: "Administradora",
            surname: "Sistema",
            role: "Administrador"
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
            isFavorite: true,
            hero_image_url: "https://images.unsplash.com/photo-1613395877344-13d4c79e4284?q=80&w=2668&auto=format&fit=crop",
            description_long: "Disfruta de una experiencia inolvidable en una de las islas más hermosas del mundo. Santorini te ofrece atardeceres mágicos desde Oia, donde el sol se funde con el mar Egeo en un espectáculo de colores. Podrás degustar su gastronomía exquisita, famosa por sus tomates cherry, vinos volcánicos y pescado fresco. Las playas de arena volcánica negra y roja te invitan a relajarte bajo el sol mediterráneo. Explora los pueblos de casas encaladas colgados de los acantilados y sumérgete en la historia de la civilización minoica en Akrotiri.",
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
            description_long: "Un viaje fascinante que recorre Tokio, Kioto y Osaka, sumergiéndote en lo más profundo de la cultura japonesa. Desde la ceremonia del té en jardines zen hasta la tecnología más avanzada en Akihabara, Japón es un país de contrastes. Descubre templos milenarios escondidos entre rascacielos futuristas y disfruta de la hospitalidad inigualable (Omotenashi) de su gente. Viaja en tren bala a velocidades increíbles y prueba la auténtica cocina kaiseki. Cada rincón ofrece una sorpresa, desde moda vanguardista hasta festivales tradicionales llenos de color.",
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
            description_long: "Experimenta el lujo extremo en la ciudad más moderna del mundo, donde lo imposible se hace realidad. Dubai combina rascacielos impresionantes como el Burj Khalifa con playas paradisíacas de aguas cálidas. Aventúrate en el desierto árabe para un safari en 4x4 y una cena bajo las estrellas en un campamento beduino. Disfruta de compras de clase mundial en centros comerciales gigantescos y zocos tradicionales de oro y especias. La arquitectura futurista y la hospitalidad árabe crean un ambiente único y sofisticado.",
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
            description_long: "Relájate en un resort overwater de lujo rodeado de aguas cristalinas color turquesa que parecen sacadas de un sueño. Las Maldivas ofrecen privacidad absoluta y belleza natural incomparable, ideales para desconectar del estrés diario. Explora los vibrantes arrecifes de coral haciendo snorkel o buceo junto a mantarrayas y tortugas marinas. Disfruta de cenas románticas a la luz de las velas en playas privadas de arena blanca. Cada atardecer es una obra maestra que pinta el cielo de naranjas y rosas.",
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
            isFavorite: true,
            hero_image_url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2673&auto=format&fit=crop",
            description_long: "Descubre la magia de París, la Ciudad de la Luz, desde la icónica Torre Eiffel hasta los paseos por los Campos Elíseos. Sumérgete en el arte visitando el Louvre o el Museo de Orsay y déjate llevar por el romanticismo de Montmartre. La gastronomía francesa te deleitará en cada bistró, pastelería y restaurante con estrellas Michelin. Pasea a orillas del Sena al atardecer y admira la arquitectura histórica que hace de esta ciudad un museo al aire libre. La moda, la cultura y la historia te envuelven en cada esquina de esta capital europea.",
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
            description_long: "Vive la energía vibrante de Nueva York, la ciudad que nunca duerme, desde las luces de Times Square hasta la tranquilidad de Central Park. Asiste a un show de Broadway de clase mundial y explora museos icónicos como el MoMA y el Met. Disfruta de la mejor gastronomía urbana, desde pizzas clásicas hasta alta cocina internacional en los mejores restaurantes. Sube al Empire State o al Top of the Rock para vistas panorámicas inolvidables del skyline. Cada barrio, desde SoHo hasta Brooklyn, tiene su propia personalidad y encanto por descubrir.",
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

    ],
    sales: [
        {
            id: 1,
            destination_id: 1, // Santorini
            client_name: "Sofía Vergara",
            client_email: "sofia@example.com",
            amount: 2500,
            status: "Confirmada",
            date: "2024-02-01",
            voucher_code: "VOU-SAN-001",
            custom_itinerary: []
        }
    ],
    clients: [
        {
            id: 1,
            name: "Juan",
            surname: "Pérez",
            phone: "+1 555 0101"
        },
        {
            id: 2,
            name: "María",
            surname: "García",
            phone: "+34 600 000 000"
        }
    ],
    itineraries: [
        {
            id: 1,
            destination_id: 2, // Tokio
            name: "Visita al Templo Senso-ji",
            description: "El templo budista más antiguo de Tokio, situado en Asakusa. Famoso por su gran linterna roja y la calle comercial Nakamise. Es un símbolo de renacimiento y paz para los japoneses.",
            price: 50,
            image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2694&auto=format&fit=crop"
        },
        {
            id: 2,
            destination_id: 2, // Tokio
            name: "Cruce de Shibuya",
            description: "El cruce peatonal más transitado del mundo, símbolo de la modernidad de Tokio. Rodeado de enormes pantallas de neón y gente fashionista, es una experiencia urbana imprescindible.",
            price: 15,
            image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=2670&auto=format&fit=crop"
        },
        {
            id: 3,
            destination_id: 2, // Tokio
            name: "Jardines Imperiales de Shinjuku",
            description: "Un oasis de tranquilidad en medio del bullicio de Tokio. Estos jardines ofrecen una mezcla armoniosa de estilos paisajísticos tradicionales japoneses, franceses e ingleses. En primavera, es uno de los lugares más espectaculares para ver los cerezos en flor, mientras que en otoño los arces tiñen el paisaje de rojo intenso.",
            price: 12,
            image: "https://images.unsplash.com/photo-1522547902298-51566e4fb383?q=80&w=2535&auto=format&fit=crop"
        },

        {
            id: 6,
            destination_id: 2, // Tokio
            name: "Torre de Tokio (Tokyo Tower)",
            description: "Inspirada en la Torre Eiffel, esta estructura icónica ofrece vistas panorámicas impresionantes de la ciudad. Es especialmente hermosa por la noche, cuando se ilumina con colores que cambian según la estación. Desde sus plataformas de observación, en días despejados, incluso se puede vislumbrar el Monte Fuji en el horizonte.",
            price: 25,
            image: "https://images.unsplash.com/photo-1504109586057-7a2ae83d1338?q=80&w=2533&auto=format&fit=crop"
        },

        {
            id: 8,
            destination_id: 1, // Santorini
            name: "Tour Volcánico y Aguas Termales",
            description: "Navega hacia las islas volcánicas de Nea Kameni y Palea Kameni. Camina por el cráter activo y báñate en las aguas termales sulfurosas.",
            price: 65,
            image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2568&auto=format&fit=crop"
        },
        {
            id: 9,
            destination_id: 3, // Dubai
            name: "Safari en el Desierto",
            description: "Una aventura emocionante en 4x4 por las dunas rojas de Dubai. Incluye sandboarding, paseo en camello y una cena tradicional BBQ bajo las estrellas.",
            price: 85,
            image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2694&auto=format&fit=crop"
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
