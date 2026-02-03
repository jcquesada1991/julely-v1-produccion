import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Modal from '@/components/Modal';
import SaleForm from '@/components/SaleForm';
import { useApp } from '@/context/AppContext';
import styles from '@/styles/DashboardV2.module.css'; // Using V2 styles for Table
import { Plus, MapPin, Trash2, Map, FileText } from 'lucide-react';

export default function Sales() {
    const router = useRouter();
    const { sales, destinations, addSale, deleteSale } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewingItinerary, setViewingItinerary] = useState(null);

    const handleAddSale = (formData) => {
        addSale(formData);
        setIsModalOpen(false);
    };

    const getDestinationName = (id) => {
        const d = destinations.find(x => String(x.id) === String(id));
        return d ? d.title : 'Desconocido';
    };

    return (
        <DashboardLayout title="Registro de Ventas">
            <Head>
                <title>Ventas | TravelAgendy</title>
            </Head>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 className={styles.pageTitle} style={{ fontSize: '2rem' }}>Ventas</h2>
                    <p style={{ color: '#64748B' }}>Gestiona tus registros de venta e itinerarios</p>
                </div>
                <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} /> Nueva Venta
                </button>
            </div>

            <div className={styles.paramountCard}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.tableHeader}>ID</th>
                            <th className={styles.tableHeader}>Fecha</th>
                            <th className={styles.tableHeader}>Cliente</th>
                            <th className={styles.tableHeader}>Destino</th>
                            <th className={styles.tableHeader}>Días</th>
                            <th className={styles.tableHeader}>Total</th>
                            <th className={styles.tableHeader}>Estado</th>
                            <th className={styles.tableHeader} style={{ textAlign: 'center' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.map((sale) => (
                            <tr key={sale.id}>
                                <td style={{ fontWeight: 600 }}>#{sale.id}</td>
                                <td style={{ fontSize: '0.9rem', color: '#64748B' }}>
                                    {new Date(sale.date || Date.now()).toLocaleDateString('es-ES', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    })}
                                </td>
                                <td><div style={{ fontWeight: 700, color: '#1E293B' }}>{sale.client_name}</div></td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748B' }}>
                                        <MapPin size={16} />
                                        {getDestinationName(sale.destination_id)}
                                    </div>
                                </td>
                                <td>
                                    <span style={{
                                        fontWeight: 700,
                                        color: '#3B82F6',
                                        background: '#EFF6FF',
                                        padding: '0.25rem 0.6rem',
                                        borderRadius: '6px',
                                        fontSize: '0.8rem'
                                    }}>
                                        {sale.custom_itinerary ? sale.custom_itinerary.length : 0} Días
                                    </span>
                                </td>
                                <td>
                                    <span style={{
                                        fontWeight: 800,
                                        color: '#059669',
                                        background: '#ECFDF5',
                                        padding: '0.25rem 0.6rem',
                                        borderRadius: '6px',
                                        fontSize: '0.8rem',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '2px'
                                    }}>
                                        $ {sale.total_amount ? sale.total_amount.toLocaleString() : '0'} USD
                                    </span>
                                </td>
                                <td>
                                    <span style={{
                                        padding: '0.3rem 0.8rem',
                                        borderRadius: '99px',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        background: sale.status === 'Confirmada' ? '#DCFCE7' : '#FEF3C7',
                                        color: sale.status === 'Confirmada' ? '#166534' : '#92400E',
                                        border: `1px solid ${sale.status === 'Confirmada' ? '#BBF7D0' : '#FDE68A'}`
                                    }}>
                                        {sale.status}
                                    </span>
                                </td>
                                <td>
                                    <div className={styles.actions} style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                        <button
                                            className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                                            data-tooltip="Ver Itinerario"
                                            onClick={() => setViewingItinerary(sale)}
                                        >
                                            <Map size={16} />
                                        </button>
                                        <button
                                            className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                                            data-tooltip="Ver Voucher"
                                            onClick={() => router.push(`/voucher/${sale.id}`)}
                                        >
                                            <FileText size={16} />
                                        </button>
                                        <button
                                            className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                                            data-tooltip="Eliminar"
                                            onClick={() => deleteSale(sale.id)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {sales.length === 0 && (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>
                                    No hay ventas registradas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Nueva Venta"
            >
                <SaleForm
                    onSubmit={handleAddSale}
                    onCancel={() => setIsModalOpen(false)}
                />

            </Modal>

            {/* Itinerary Visualization Modal */}
            <Modal
                isOpen={!!viewingItinerary}
                onClose={() => setViewingItinerary(null)}
                title="Itinerario Detallado"
            >
                {viewingItinerary && (
                    <div style={{ padding: '0 1rem' }}>
                        <div style={{ marginBottom: '2rem', textAlign: 'center', paddingBottom: '1.5rem', borderBottom: '1px dashed #E2E8F0' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.5rem' }}>
                                {getDestinationName(viewingItinerary.destination_id)}
                            </h2>
                            <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
                                Viajero: <span style={{ fontWeight: 600, color: '#0F172A' }}>{viewingItinerary.client_name}</span>
                            </p>
                        </div>

                        <div style={{ position: 'relative', paddingLeft: '1.5rem', marginBottom: '2rem' }}>
                            {/* Line */}
                            <div style={{
                                position: 'absolute',
                                left: '7px',
                                top: '0',
                                bottom: '0',
                                width: '2px',
                                background: '#E2E8F0'
                            }}></div>

                            {viewingItinerary.custom_itinerary && viewingItinerary.custom_itinerary.length > 0 ? (
                                viewingItinerary.custom_itinerary.map((item, index) => (
                                    <div key={index} style={{ marginBottom: '2rem', position: 'relative' }}>
                                        {/* Dot */}
                                        <div style={{
                                            position: 'absolute',
                                            left: '-1.45rem',
                                            top: '0',
                                            width: '14px',
                                            height: '14px',
                                            borderRadius: '50%',
                                            background: '#0EA5E9',
                                            border: '3px solid white',
                                            boxShadow: '0 0 0 2px #E0F2FE',
                                            zIndex: 2
                                        }}></div>

                                        <div style={{
                                            background: 'linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%)',
                                            borderRadius: '16px',
                                            padding: '1.25rem',
                                            border: '1px solid #F1F5F9',
                                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <span style={{
                                                    fontSize: '0.7rem',
                                                    fontWeight: 800,
                                                    color: '#6366F1',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em',
                                                    background: '#EEF2FF',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '50px'
                                                }}>
                                                    DÍA {item.day}
                                                </span>
                                                <span style={{ fontWeight: 700, color: '#059669' }}>
                                                    $ {item.price ? Number(item.price).toLocaleString() : '0'} USD
                                                </span>
                                            </div>
                                            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#1E293B' }}>{item.name}</h4>
                                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748B', lineHeight: '1.5' }}>
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ color: '#94A3B8', fontStyle: 'italic' }}>Sin itinerario personalizado.</div>
                            )}
                        </div>

                        {/* Total Footer */}
                        <div style={{
                            background: '#0F172A',
                            margin: '0 -2rem -2rem -2rem', // Bleed to edges
                            padding: '1.5rem 2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            color: 'white'
                        }}>
                            <span style={{ fontSize: '1rem', fontWeight: 500, opacity: 0.8 }}>Total Venta</span>
                            <span style={{ fontSize: '1.75rem', fontWeight: 800 }}>
                                {(() => {
                                    return `$ ${viewingItinerary.total_amount ? viewingItinerary.total_amount.toLocaleString() : '0'} USD`;
                                })()}
                            </span>
                        </div>
                    </div>
                )}
            </Modal>
        </DashboardLayout>
    );
}
