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
            id: 2,
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
            id: 3,
            currency: "USD",
            price: 3800,
            title: "Dubai",
            subtitle: "Lujo y modernidad en el desierto",
            category: "First Class",
            airport_code: "DXB",
            isPremium: true,
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
        }
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
            phone: "+1 555 0101",
            email: "juan.perez@email.com",
            passport: "PA1234567",
            birthdate: "1985-03-15",
            nationality: "Estadounidense",
            address: "123 Main St, Miami, FL",
            notes: "Prefiere asiento de ventana. Vegetariano.",
            booking_date: "2024-01-20"
        },
        {
            id: 2,
            name: "María",
            surname: "García",
            phone: "+34 600 000 000",
            email: "maria.garcia@email.com",
            passport: "ES9876543",
            birthdate: "1990-07-22",
            nationality: "Española",
            address: "Calle Gran Vía 10, Madrid",
            notes: "",
            booking_date: "2024-01-25"
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
