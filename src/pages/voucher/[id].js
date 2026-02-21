import { useRouter } from 'next/router';
import Head from 'next/head';
import { useApp } from '@/context/AppContext';
import styles from '@/styles/Voucher.module.css';
import { useEffect, useState } from 'react';
import { Download, ChevronLeft, Calendar, CheckSquare, FileText, MapPin, Pencil, Plus, X, User, Globe, CreditCard, ArrowUp, ArrowDown } from 'lucide-react';

export default function Voucher() {
    const router = useRouter();
    const { id, edit } = router.query;
    const { getSaleDetails, clients } = useApp();
    const [data, setData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // Auto-enter edit mode if ?edit=true
    useEffect(() => {
        if (edit === 'true') {
            setIsEditing(true);
        }
    }, [edit]);

    // Editable state
    const [editClientName, setEditClientName] = useState('');
    const [editPassport, setEditPassport] = useState('');
    const [editNationality, setEditNationality] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editPrice, setEditPrice] = useState('');
    const [editDate, setEditDate] = useState('');
    const [editPreparedBy, setEditPreparedBy] = useState('Alberto Flores');
    const [editChecklist, setEditChecklist] = useState([]);
    const [editItinerary, setEditItinerary] = useState([]);
    const [editTerms, setEditTerms] = useState('');
    const [editDescription, setEditDescription] = useState('');

    // Client extended data
    const [clientData, setClientData] = useState(null);

    const defaultTerms = `Términos y Condiciones:
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

    useEffect(() => {
        if (id) {
            const details = getSaleDetails(id);
            setData(details);
        }
    }, [id, getSaleDetails]);

    // Initialize editable fields when data loads
    useEffect(() => {
        if (data) {
            const dest = data.destination || {};
            setEditClientName(data.client_name || '');
            setEditPrice(data.total_amount ? String(data.total_amount) : '0');
            setEditDate(data.date || new Date().toISOString().split('T')[0]);
            setEditDescription(dest.description_long || dest.subtitle || '');
            setEditTerms(defaultTerms);

            const includes = (dest.includes && dest.includes.length > 0) ? dest.includes : [
                "Aéreos internacionales ida y vuelta",
                "Traslados aeropuerto /hotel /aeropuerto",
                "Alojamiento",
                "Excursiones descritas en el itinerario",
                "Guía de habla hispana",
                "Desayunos",
                "Impuestos"
            ];
            setEditChecklist(includes);

            const itinerary = (data.custom_itinerary && data.custom_itinerary.length > 0)
                ? data.custom_itinerary
                : (dest.itinerary || []);
            setEditItinerary(itinerary.map((item, idx) => ({
                ...item,
                day: item.day || idx + 1
            })));

            // Find the full client data from clients array
            if (clients && data.client_name) {
                const nameParts = data.client_name.split(' ');
                const found = clients.find(c =>
                    data.client_name.includes(c.name) && (c.surname ? data.client_name.includes(c.surname) : true)
                );
                setClientData(found || null);
                if (found) {
                    setEditPassport(found.passport || '');
                    setEditNationality(found.nationality || '');
                    setEditPhone(found.phone || '');
                    setEditEmail(found.email || '');
                }
            }
        }
    }, [data, clients]);

    if (!data) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-primary)', background: 'var(--bg-main)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cargando Voucher...</div>;
    if (!data.destination) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-primary)', background: 'var(--bg-main)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Destino no encontrado</div>;

    const { destination: dest, voucher_code } = data;

    const formattedDate = editDate
        ? new Date(`${editDate}T12:00:00`).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    // Checklist helpers
    const addChecklistItem = () => setEditChecklist([...editChecklist, '']);
    const removeChecklistItem = (idx) => setEditChecklist(editChecklist.filter((_, i) => i !== idx));
    const updateChecklistItem = (idx, val) => {
        const updated = [...editChecklist];
        updated[idx] = val;
        setEditChecklist(updated);
    };

    // Itinerary helpers
    const removeItineraryItem = (idx) => {
        const updated = editItinerary.filter((_, i) => i !== idx).map((item, i) => ({ ...item, day: i + 1 }));
        setEditItinerary(updated);
    };
    const moveItineraryItemUp = (idx) => {
        if (idx === 0) return;
        const updated = [...editItinerary];
        const temp = updated[idx];
        updated[idx] = updated[idx - 1];
        updated[idx - 1] = temp;
        // Recalculate days
        const fixedDays = updated.map((item, i) => ({ ...item, day: i + 1 }));
        setEditItinerary(fixedDays);
    }
    const moveItineraryItemDown = (idx) => {
        if (idx === editItinerary.length - 1) return;
        const updated = [...editItinerary];
        const temp = updated[idx];
        updated[idx] = updated[idx + 1];
        updated[idx + 1] = temp;
        // Recalculate days
        const fixedDays = updated.map((item, i) => ({ ...item, day: i + 1 }));
        setEditItinerary(fixedDays);
    }

    // Helper: only render a section if it has content
    const hasChecklist = editChecklist.length > 0 || isEditing;
    const hasDescription = (editDescription && editDescription.trim().length > 0) || isEditing;
    const hasItinerary = editItinerary.length > 0 || isEditing;
    const hasTerms = (editTerms && editTerms.trim().length > 0) || isEditing;

    // Client info items — only show fields that have data
    const clientInfoItems = [];

    // Edit logic for clientInfoItems (use the edit state directly so changes persist after editing)
    const effectivePassport = editPassport;
    const effectiveNationality = editNationality;
    const effectivePhone = editPhone;
    const effectiveEmail = editEmail;

    if (effectivePassport || isEditing) clientInfoItems.push({ label: 'PASAPORTE', value: effectivePassport, setValue: setEditPassport, icon: CreditCard });
    if (effectiveNationality || isEditing) clientInfoItems.push({ label: 'NACIONALIDAD', value: effectiveNationality, setValue: setEditNationality, icon: Globe });
    if (effectivePhone || isEditing) clientInfoItems.push({ label: 'TELÉFONO', value: effectivePhone, setValue: setEditPhone, icon: User });
    if (effectiveEmail || isEditing) clientInfoItems.push({ label: 'EMAIL', value: effectiveEmail, setValue: setEditEmail, icon: User });

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
                                <img src="/images/logo.png" alt="Julely" style={{ height: '60px', objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))' }} />
                            </div>
                            <h1 className={styles.destinationTitle}>{dest.title.toUpperCase()}</h1>
                            <div className={styles.voucherCode}>{voucher_code}</div>
                        </div>
                    </div>

                    {/* 2. Key Info (Client, Date) — always shown */}
                    <div className={styles.infoSection} style={{ gridTemplateColumns: clientInfoItems.length > 0 ? '1fr 1fr' : '1fr 1fr' }}>
                        <div className={styles.infoCard}>
                            <div className={styles.infoLabel}>VIAJERO PRINCIPAL</div>
                            <div className={styles.infoValue}>
                                {isEditing ? (
                                    <input
                                        className={styles.editInput}
                                        value={editClientName}
                                        onChange={(e) => setEditClientName(e.target.value)}
                                        style={{ textAlign: 'center', fontWeight: 700 }}
                                    />
                                ) : editClientName}
                            </div>
                        </div>
                        <div className={styles.infoCard}>
                            <div className={styles.infoLabel}>FECHA EMISIÓN</div>
                            <div className={styles.infoValue}>
                                {isEditing ? (
                                    <input
                                        className={styles.editInput}
                                        type="date"
                                        value={editDate}
                                        onChange={(e) => setEditDate(e.target.value)}
                                        style={{ textAlign: 'center', fontWeight: 700 }}
                                    />
                                ) : formattedDate}
                            </div>
                        </div>
                    </div>

                    {/* 2b. Extended Client Info — CONDITIONAL: only show fields that have data, unless editing */}
                    {clientInfoItems.length > 0 && (
                        <div className={styles.infoSection} style={{
                            gridTemplateColumns: `repeat(${Math.min(clientInfoItems.length, 4)}, 1fr)`,
                            marginTop: '0'
                        }}>
                            {clientInfoItems.map((item, idx) => (
                                <div key={idx} className={styles.infoCard} style={{ padding: '0.75rem 1rem' }}>
                                    <div className={styles.infoLabel} style={{ fontSize: '0.6rem' }}>{item.label}</div>
                                    <div className={styles.infoValue} style={{ fontSize: '0.85rem' }}>
                                        {isEditing ? (
                                            <input
                                                className={styles.editInput}
                                                value={item.value}
                                                onChange={(e) => item.setValue(e.target.value)}
                                                style={{ textAlign: 'center' }}
                                            />
                                        ) : item.value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className={styles.mainContent}>

                        {/* 3. Checklist — CONDITIONAL */}
                        {hasChecklist && (
                            <div className={styles.sectionBlock}>
                                <h3 className={styles.sectionTitle}>
                                    <CheckSquare size={20} />
                                    INCLUYE
                                </h3>
                                <div className={styles.checklistGrid}>
                                    {editChecklist.map((item, idx) => (
                                        <div key={idx} className={styles.checkItem}>
                                            {isEditing ? (
                                                <>
                                                    <button className={styles.editRemoveBtn} onClick={() => removeChecklistItem(idx)} type="button">
                                                        <X size={12} />
                                                    </button>
                                                    <input
                                                        className={styles.editInput}
                                                        value={item}
                                                        onChange={(e) => updateChecklistItem(idx, e.target.value)}
                                                        placeholder="Escribir item..."
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <div className={styles.customCheck}>✓</div>
                                                    <span>{item}</span>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {isEditing && (
                                    <button className={styles.editAddBtn} onClick={addChecklistItem} type="button">
                                        <Plus size={14} /> Agregar item
                                    </button>
                                )}

                                {/* Prepared By Section */}
                                <div className={styles.preparedByBox}>
                                    <div className={styles.preparedByLabel}>PREPARADO POR:</div>
                                    <div className={styles.preparedByName}>
                                        {isEditing ? (
                                            <input
                                                className={styles.editInput}
                                                value={editPreparedBy}
                                                onChange={(e) => setEditPreparedBy(e.target.value)}
                                                style={{ textAlign: 'center', color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
                                            />
                                        ) : editPreparedBy}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 5. Dest Description — CONDITIONAL */}
                        {hasDescription && (
                            <div className={styles.sectionBlock}>
                                <h3 className={styles.sectionTitle}>
                                    <MapPin size={20} />
                                    SOBRE TU DESTINO
                                </h3>
                                <div className={styles.descriptionText}>
                                    {isEditing ? (
                                        <textarea
                                            className={styles.editTextarea}
                                            value={editDescription}
                                            onChange={(e) => setEditDescription(e.target.value)}
                                            rows={4}
                                        />
                                    ) : editDescription}
                                </div>
                            </div>
                        )}

                        {/* Force Page Break before Itinerary — only if there IS an itinerary */}
                        {hasItinerary && <div className={styles.pageBreak}></div>}

                        {/* 6. Detailed Itinerary — CONDITIONAL */}
                        {hasItinerary && (
                            <div className={styles.sectionBlock} style={{ breakInside: 'auto' }}>
                                <h3 className={styles.sectionTitle}>
                                    <Calendar size={20} />
                                    ITINERARIO DETALLADO
                                </h3>
                                <div className={styles.itineraryList}>
                                    {editItinerary.map((item, idx) => (
                                        <div key={idx} className={styles.itineraryItem}>
                                            <div className={styles.dayBadge}>DÍA {item.day || idx + 1}</div>
                                            <div className={styles.itineraryContent} style={{ flex: 1 }}>
                                                <h4 className={styles.itineraryTitle}>{item.name || item.title}</h4>
                                                {item.description && (
                                                    <p className={styles.itineraryDesc}>{item.description}</p>
                                                )}
                                                {item.image && (
                                                    <div className={styles.itineraryImageWrapper}>
                                                        <img src={item.image} alt={item.name || item.title} />
                                                    </div>
                                                )}
                                            </div>
                                            {isEditing && (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center' }}>
                                                    <button className={styles.editRemoveBtn} onClick={() => moveItineraryItemUp(idx)} type="button" disabled={idx === 0} style={{ opacity: idx === 0 ? 0.3 : 1 }}>
                                                        <ArrowUp size={16} />
                                                    </button>
                                                    <button className={styles.editRemoveBtn} onClick={() => moveItineraryItemDown(idx)} type="button" disabled={idx === editItinerary.length - 1} style={{ opacity: idx === editItinerary.length - 1 ? 0.3 : 1 }}>
                                                        <ArrowDown size={16} />
                                                    </button>
                                                    <button className={styles.editRemoveBtn} onClick={() => removeItineraryItem(idx)} type="button">
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Force Page Break before Terms — only if terms exist */}
                        {hasTerms && <div className={styles.pageBreak}></div>}

                        {/* 7. Terms & Conditions — CONDITIONAL */}
                        {hasTerms && (
                            <div className={styles.sectionBlock}>
                                <h3 className={styles.sectionTitle}>
                                    <FileText size={20} />
                                    TÉRMINOS Y CONDICIONES
                                </h3>
                                <div className={styles.termsText}>
                                    {editTerms}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* 7. Footer (WEB VIEW ONLY) */}
                    <div className={styles.footer}>
                        <div className={styles.footerContent}>
                            <span>Julely Travel</span>
                            <span>+1 (787) 555-0123</span>
                            <span>www.julely.com</span>
                        </div>
                    </div>
                </div>

                {/* Signature fixed on bottom right for every page - MOVED OUTSIDE voucherPage */}
                <div className={styles.printSignature}>
                    <img src="/images/footer_signature_v2.jpg" alt="Signature" />
                </div>
            </div>

            <div className={styles.actions}>
                <button className={styles.btnBack} onClick={() => router.back()}>
                    <ChevronLeft size={20} /> Volver
                </button>
                <button
                    className={`${styles.btnEdit} ${isEditing ? styles.active : ''}`}
                    onClick={() => setIsEditing(!isEditing)}
                >
                    <Pencil size={18} /> {isEditing ? 'Listo' : 'Editar'}
                </button>
                <button className={styles.btnDownload} onClick={() => {
                    if (isEditing) setIsEditing(false);
                    setTimeout(() => window.print(), 100);
                }}>
                    <Download size={20} /> Descargar PDF
                </button>
            </div>
        </>
    );
}
