import { useRouter } from 'next/router';
import Head from 'next/head';
import { useApp } from '@/context/AppContext';
import styles from '@/styles/Voucher.module.css';
import { Download, ChevronLeft, Globe, Calendar, CheckSquare, FileText, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Voucher() {
    const router = useRouter();
    const { id } = router.query;
    const { getSaleDetails } = useApp();
    const [data, setData] = useState(null);

    useEffect(() => {
        if (id) {
            const details = getSaleDetails(id);
            setData(details);
        }
    }, [id, getSaleDetails]);

    if (!data) return <div style={{ padding: '2rem', textAlign: 'center', color: '#1E293B' }}>Cargando Voucher...</div>;
    if (!data.destination) return <div style={{ padding: '2rem', textAlign: 'center', color: '#1E293B' }}>Destino no encontrado</div>;

    const { destination: dest, voucher_code, client_name, total_amount, date, custom_itinerary } = data;

    // Default Checklist Content
    const checklistItems = (dest.includes && dest.includes.length > 0) ? dest.includes : [
        "Aéreos internacionales ida y vuelta",
        "Aéreo interno ida",
        "Tren",
        "Traslados aeropuerto /hotel /aeropuerto",
        "1 Personal ítem",
        "1 Carry on",
        "Alojamiento",
        "Excursiones descritas en el itinerario",
        "Entradas Turísticas",
        "Visita Villa de Papá Noel",
        "Guía de habla hispana",
        "Desayunos",
        "1 Almuerzo",
        "1 Cena",
        "Impuestos",
        "Acompañante desde PR"
    ];

    // Default Terms Content
    const termsContent = `Términos y Condiciones:
Imay LLC H/N/C Julely actúa solamente como intermediario entre los clientes y proveedores de servicio, líneas aéreas, hoteles, transportistas,
guías, entre otros. Por tanto, no se hace responsable en caso de accidentes, pérdidas, demoras, daños, heridas, cambios de itinerario,
cancelaciones de vuelos, enfermedad, actos de guerra, huelgas, actos de la naturaleza, robos, cuarentenas, accidentes, pandemias, epidemias
y/u otros fuera de su control, antes, durante y después de su viaje o relacionadas al mismo. Cualquier reclamación por accidente, robos u
otros incidentes sufridos deberá ser sometido a la compañía que efectúa dicho servicio y será tramitada por este de acuerdo con la legislación
que esté vigente en el país donde recibe el servicio.
Los operadores y Julely se reservan el derecho, de ser necesario, de alterar u omitir cualquier porción del itinerario, sin previo aviso, por
cualquier razón causada de fuerza mayor. Los servicios no prestados por causa de fuerza mayor no tienen derecho a reembolso. Julely no se
responsabiliza por la operación, acto, omisión, robo, accidentes, pandemias, epidemias o sucesos que ocurran antes, durante y después de su
viaje. Los términos y condiciones de cancelación se encuentran disponibles 24/7 en www.julely.com. Estos pueden ser descargados en
cualquier momento para su expediente. CLIENTE acepta y reconoce que al enviar el depósito para la reservación acepta los términos y
condiciones. RECOMENDAMOS que compre un seguro de viajes para su protección, desde el momento de su depósito.`;

    // Itinerary Source (Custom or Default)
    const itineraryList = custom_itinerary && custom_itinerary.length > 0
        ? custom_itinerary
        : (dest.itinerary || []);

    const formattedDate = new Date(date || Date.now()).toLocaleDateString('es-ES', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });

    return (
        <>
            <Head>
                <title>Voucher {voucher_code}</title>
            </Head>

            <div className={styles.voucherContainer}>
                <div className={styles.voucherPage}>

                    {/* 1. Header with Destination */}
                    <div className={styles.header}>
                        <div className={styles.headerOverlay}></div>
                        <img
                            src={dest.hero_image_url}
                            className={styles.headerImg}
                            alt={dest.title}
                            onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2670&auto=format&fit=crop'}
                        />
                        <div className={styles.headerContent}>
                            <div className={styles.logoRow}>
                                <Globe size={28} />
                                <span>TRAVEL AGENDY</span>
                            </div>
                            <h1 className={styles.destinationTitle}>{dest.title.toUpperCase()}</h1>
                            <div className={styles.voucherCode}>{voucher_code}</div>
                        </div>
                    </div>

                    {/* 2. Key Info (Client, Price, Date) */}
                    <div className={styles.infoSection}>
                        <div className={styles.infoCard}>
                            <div className={styles.infoLabel}>VIAJERO PRINCIPAL</div>
                            <div className={styles.infoValue}>{client_name}</div>
                        </div>
                        <div className={styles.infoCard}>
                            <div className={styles.infoLabel}>PRECIO TOTAL</div>
                            <div className={styles.infoValue}>${total_amount ? total_amount.toLocaleString() : '0'} USD</div>
                        </div>
                        <div className={styles.infoCard}>
                            <div className={styles.infoLabel}>FECHA EMISIÓN</div>
                            <div className={styles.infoValue}>{formattedDate}</div>
                        </div>
                    </div>

                    <div className={styles.mainContent}>

                        {/* 3. Checklist */}
                        <div className={styles.sectionBlock}>
                            <h3 className={styles.sectionTitle}>
                                <CheckSquare size={20} />
                                INCLUYE
                            </h3>
                            <div className={styles.checklistGrid}>
                                {checklistItems.map((item, idx) => (
                                    <div key={idx} className={styles.checkItem}>
                                        <div className={styles.customCheck}>✓</div>
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Prepared By Section */}
                            <div className={styles.preparedByBox}>
                                <div className={styles.preparedByLabel}>PREPARADO POR:</div>
                                <div className={styles.preparedByName}>Alberto Flores</div>
                            </div>
                        </div>



                        {/* 5. Dest Description */}
                        <div className={styles.sectionBlock}>
                            <h3 className={styles.sectionTitle}>
                                <MapPin size={20} />
                                SOBRE TU DESTINO
                            </h3>
                            <div className={styles.descriptionText}>
                                {dest.description_long || dest.subtitle}
                            </div>
                        </div>

                        {/* 6. Detailed Itinerary - Allow breaking */}
                        <div className={styles.sectionBlock} style={{ breakInside: 'auto' }}>
                            <h3 className={styles.sectionTitle}>
                                <Calendar size={20} />
                                ITINERARIO DETALLADO
                            </h3>
                            <div className={styles.itineraryList}>
                                {itineraryList.map((item, idx) => (
                                    <div key={idx} className={styles.itineraryItem}>
                                        <div className={styles.dayBadge}>DÍA {item.day || idx + 1}</div>
                                        <div className={styles.itineraryContent}>
                                            <h4 className={styles.itineraryTitle}>{item.name || item.title}</h4>
                                            <p className={styles.itineraryDesc}>{item.description}</p>
                                            {item.image && (
                                                <div className={styles.itineraryImageWrapper}>
                                                    <img src={item.image} alt={item.name || item.title} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 7. Terms & Conditions */}
                        <div className={styles.sectionBlock}>
                            <h3 className={styles.sectionTitle}>
                                <FileText size={20} />
                                TÉRMINOS Y CONDICIONES
                            </h3>
                            <div className={styles.termsText}>
                                {termsContent.split('relacionadas al mismo.')[0]}relacionadas al mismo.
                            </div>

                            {/* Force Page Break */}
                            <div className={styles.pageBreak}></div>

                            <div className={styles.termsText} style={{ marginTop: '2rem' }}>
                                {termsContent.split('relacionadas al mismo.')[1]}
                            </div>
                        </div>

                    </div>

                    {/* 7. Footer (WEB VIEW ONLY) */}
                    <div className={styles.footer}>
                        <div className={styles.footerContent}>
                            <span>Travel Agendy</span>
                            <span>+1 (787) 555-0123</span>
                            <span>www.travelagendy.com</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Print Only Footer (Duplicate for Fixed Position on Every Page) */}
            <div className={styles.printFooter}>
                <div className={styles.footerContent}>
                    <span>Travel Agendy</span>
                    <span>+1 (787) 555-0123</span>
                    <span>www.travelagendy.com</span>
                </div>
            </div>


            <div className={styles.actions}>
                <button className={styles.btnBack} onClick={() => router.back()}>
                    <ChevronLeft size={20} /> Volver
                </button>
                <button className={styles.btnDownload} onClick={() => window.print()}>
                    <Download size={20} /> Descargar PDF
                </button>
            </div>


        </>
    );
}
