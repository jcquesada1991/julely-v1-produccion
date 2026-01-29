import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Modal from '@/components/Modal';
import SaleForm from '@/components/SaleForm';
import { useApp } from '@/context/AppContext';
import styles from '@/styles/ListCard.module.css';
import { Plus, FileText, Calendar, MapPin, User } from 'lucide-react';

export default function Sales() {
    const router = useRouter();
    const { sales, destinations, addSale } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = (formData) => {
        addSale(formData);
        setIsModalOpen(false);
    };

    const getDestTitle = (id) => {
        const d = destinations.find(x => x.id === parseInt(id));
        return d ? d.title : 'Destino desconocido';
    };

    const getDestPrice = (id) => {
        const d = destinations.find(x => x.id === parseInt(id));
        return d ? `${d.currency} $${d.price.toLocaleString()}` : 'N/A';
    };

    return (
        <DashboardLayout title="Registro de Ventas">
            <Head>
                <title>Ventas | TravelAgendy</title>
            </Head>

            {/* Header with Create Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                        Registro de Ventas
                    </h2>
                    <p style={{ color: '#64748B', marginTop: '0.5rem' }}>
                        Gestiona todas las ventas y vouchers
                    </p>
                </div>
                <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} /> Registrar Nueva Venta
                </button>
            </div>

            {/* Sales Cards List */}
            <div>
                {sales.map(sale => (
                    <div key={sale.id} className={styles.listCard}>
                        {/* Voucher Code Badge */}
                        <div style={{
                            minWidth: '120px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '0.75rem 1rem',
                            background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                            borderRadius: '12px',
                            color: 'white',
                            fontWeight: 800,
                            fontSize: '0.85rem',
                            fontFamily: 'Outfit',
                            flexShrink: 0
                        }}>
                            <FileText size={16} style={{ marginRight: '6px' }} />
                            {sale.voucher_code}
                        </div>

                        {/* Content */}
                        <div className={styles.listCardContent}>
                            {/* Cliente */}
                            <div className={styles.listCardInfo}>
                                <div className={styles.listCardLabel}>Cliente</div>
                                <div className={styles.listCardValue} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <User size={14} color="#64748B" />
                                    {sale.client_name}
                                </div>
                            </div>

                            {/* Destino */}
                            <div className={styles.listCardInfo}>
                                <div className={styles.listCardLabel}>Destino</div>
                                <div className={styles.listCardValue} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <MapPin size={14} color="#64748B" />
                                    {getDestTitle(sale.destination_id)}
                                </div>
                            </div>

                            {/* Fecha */}
                            <div className={styles.listCardInfo}>
                                <div className={styles.listCardLabel}>Fecha</div>
                                <div className={styles.listCardValue} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Calendar size={14} color="#64748B" />
                                    {sale.date}
                                </div>
                            </div>

                            {/* Estado */}
                            <div className={styles.listCardInfo}>
                                <div className={styles.listCardLabel}>Estado</div>
                                <div className={styles.listCardValue}>
                                    <span style={{
                                        padding: '0.3rem 0.75rem',
                                        borderRadius: '12px',
                                        fontSize: '0.8rem',
                                        fontWeight: 700,
                                        background: sale.status === 'Confirmada' ?
                                            'linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)' :
                                            'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                                        color: sale.status === 'Confirmada' ? '#166534' : '#92400E',
                                        border: sale.status === 'Confirmada' ? '1px solid #BBF7D0' : '1px solid #FDE68A'
                                    }}>
                                        {sale.status === 'Confirmada' ? '✓' : '⏳'} {sale.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className={styles.listCardActions}>
                            <button
                                className={styles.listCardActionBtn}
                                onClick={() => router.push(`/voucher/${sale.id}`)}
                                title="Ver Voucher"
                            >
                                <FileText size={18} color="#0EA5E9" />
                            </button>
                        </div>
                    </div>
                ))}

                {sales.length === 0 && (
                    <div style={{
                        padding: '4rem 2rem',
                        textAlign: 'center',
                        background: 'white',
                        borderRadius: '16px',
                        border: '2px dashed #E2E8F0'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                        <div style={{ color: '#64748B', fontSize: '1.1rem', fontWeight: 600 }}>
                            No hay ventas registradas aún
                        </div>
                        <div style={{ color: '#94A3B8', marginTop: '0.5rem' }}>
                            Haz clic en "Registrar Nueva Venta" para agregar una
                        </div>
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Nueva Venta"
            >
                <SaleForm
                    onSubmit={handleSubmit}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </DashboardLayout>
    );
}
