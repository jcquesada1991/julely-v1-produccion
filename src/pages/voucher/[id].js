import { useRouter } from 'next/router';
import Head from 'next/head';
import { useApp } from '@/context/AppContext';
import styles from '@/styles/Voucher.module.css';
import { Download, ChevronLeft, Globe, CheckCircle, Clock, PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

// Helper to parse newline separated strings into arrays
const parseList = (content) => {
    if (!content) return [];
    if (Array.isArray(content)) return content;
    return content.split(/\r?\n/).filter(item => item.trim().length > 0);
};

// Helper to parse itinerary content
const parseItinerary = (itineraryData) => {
    if (Array.isArray(itineraryData)) return itineraryData;
    if (typeof itineraryData !== 'string') return [];

    const blocks = itineraryData.split(/\r?\n\r?\n/);
    return blocks.map(block => {
        const lines = block.split(/\r?\n/);
        const title = lines[0];
        const description = lines.slice(1).join(' ');
        return { title, description };
    });
};

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

    const { destination: dest, voucher_code } = data;

    // Use parse helpers
    const includes = parseList(dest.includes || dest.includes_content);
    const extras = parseList(dest.extras || dest.extras_content);
    const itinerary = (dest.itinerary && Array.isArray(dest.itinerary))
        ? dest.itinerary
        : parseItinerary(dest.itinerary_content);

    // Robust Fallback for Feature Image (Beach/Palms)
    // Using a direct, high-quality static URL that is reliable
    const featureImage = 'https://images.unsplash.com/photo-1542259681-d4cd716f7267?q=80&w=600&fit=crop';

    // Agency name logic - Specific request override
    const displayAgencyName = "Travel Agency";

    // Destination Name Logic: Use "destination_name" (e.g. Tailandia) preferentially, then Title.
    // If destination_name is missing, try to extract from title or default to "DESTINO"
    let destName = dest.destination_name;
    if (!destName && dest.title) {
        // Simple heuristic: Take first word or try to find known destination names? 
        // Better to just use title if name is missing, but user asked for "TOKIO" style.
        destName = dest.title.split(' ')[0].toUpperCase();
        if (destName.length < 3) destName = "DESTINO";
    }
    if (!destName) destName = "DESTINO";

    return (
        <>
            <Head>
                <title>Voucher {voucher_code} - {destName}</title>
            </Head>

            <div className={styles.voucherContainer}>
                <div className={styles.voucherPage}>

                    {/* Header */}
                    <div className={styles.header}>
                        <img
                            src={dest.hero_image_url}
                            className={styles.headerImg}
                            alt={dest.title}
                            onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2670&auto=format&fit=crop'}
                        />
                        <div className={styles.overlay}></div>

                        <div className={styles.brandLogo}>
                            <Globe size={24} />
                            <span>{displayAgencyName.toUpperCase()}</span>
                        </div>

                        <div className={styles.bestSellerBadge}>
                            <span>Venta</span>
                            <span>Top</span>
                        </div>

                        <div className={styles.mainTitle}>
                            <div className={styles.tagline}>¡Tu Próxima Aventura!</div>
                            {/* Showing the specific destination name here in BIG text */}
                            <div className={styles.destinationName}>{destName.toUpperCase()}</div>
                            {/* Removed the subtitle below as requested since it was often redundant or incorrect */}
                        </div>
                    </div>

                    {/* Price Strip */}
                    <div className={styles.priceStrip}>
                        <div className={styles.priceText}>
                            {dest.currency || '$'} {dest.price ? dest.price.toLocaleString() : 'CONSULTAR'}
                        </div>
                    </div>

                    {/* Grid Layout */}
                    <div className={styles.grid}>

                        {/* Left Col: Includes & Itinerary */}
                        <div className={styles.leftCol}>

                            {/* Includes */}
                            <div>
                                <div className={styles.sectionHeader}>
                                    <CheckCircle size={24} className={styles.sectionHeaderIcon} />
                                    <h3>¿Qué incluye este viaje?</h3>
                                </div>
                                <ul className={styles.includesList}>
                                    {includes.map((inc, i) => (
                                        <li key={i}>
                                            <div className={styles.checkIcon}>✓</div>
                                            {inc}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Itinerary */}
                            {itinerary.length > 0 && (
                                <div>
                                    <div className={styles.sectionHeader}>
                                        <Clock size={24} className={`${styles.sectionHeaderIcon} ${styles.sectionHeaderIconPrimary}`} />
                                        <h3>Itinerario</h3>
                                    </div>
                                    <div className={styles.timeline}>
                                        {itinerary.map((item, idx) => (
                                            <div key={idx} className={styles.timelineItem}>
                                                <div className={styles.timelineDot}></div>
                                                <div className={styles.timelineContent}>
                                                    <h4>{item.title}</h4>
                                                    {item.description && <p>{item.description}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Right Col: Why -> Image -> Extras */}
                        <div className={styles.rightCol}>

                            {/* 1. Why This Destination */}
                            <div className={styles.whyBox}>
                                <div className={styles.whyHeader}>
                                    ¿Por qué {destName}?
                                </div>
                                <div className={styles.whyText}>
                                    {dest.target_content || dest.description_long || "Una experiencia inolvidable te espera."}
                                </div>
                            </div>

                            {/* 2. Circular Image REMOVED */}{/*  */}

                            {/* 3. Extras */}
                            {extras.length > 0 && (
                                <div className={styles.extrasBox}>
                                    <div className={styles.extrasHeader}>
                                        <PlusCircle size={16} style={{ display: 'inline', marginRight: '4px', marginBottom: '-2px' }} />
                                        Extras Opcionales
                                    </div>
                                    <ul className={styles.extrasList}>
                                        {extras.map((ext, i) => (
                                            <li key={i}><span>•</span>{ext}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                        </div>

                    </div>

                    {/* Footer */}
                    <div className={styles.footer}>
                        <div className={styles.contactGrid}>
                            <div className={styles.contactItem}>
                                {/* Spacer for Alignment */}
                                <div className={styles.contactLabel}>&nbsp;</div>
                                <div className={styles.agencyNameFooter}>{displayAgencyName}</div>
                            </div>
                            <div className={styles.contactItem}>
                                <div className={styles.contactLabel}>Teléfono</div>
                                <div className={styles.contactVal}>+1 (787) 555-0123</div>
                            </div>
                            <div className={styles.contactItem}>
                                <div className={styles.contactLabel}>Código Reserva</div>
                                <div className={styles.contactVal} style={{ fontFamily: 'monospace' }}>{voucher_code}</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className={styles.actions}>
                <button className="btn-outline" style={{ background: 'white', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '50px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', cursor: 'pointer', fontWeight: 600, color: '#0F172A' }} onClick={() => router.back()}>
                    <ChevronLeft size={20} /> Volver
                </button>
                <button className="btn-white" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '50px', background: '#0EA5E9', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 800, boxShadow: '0 4px 12px rgba(14, 165, 233, 0.4)' }} onClick={() => window.print()}>
                    <Download size={20} /> Descargar PDF
                </button>
            </div>

            <style jsx global>{`
                @media print {
                    @page {
                        size: A4;
                        margin: 0;
                    }
                    html, body {
                        width: 100%;
                        height: 100%;
                        margin: 0 !important;
                        padding: 0 !important;
                        overflow: hidden;
                    }
                }
            `}</style>
        </>
    );
}
