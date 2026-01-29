import Head from 'next/head';
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Modal from '@/components/Modal';
import DestinationForm from '@/components/DestinationForm';
import DestinationDetailsModal from '@/components/DestinationDetailsModal';
import { useApp } from '@/context/AppContext';
import styles from '@/styles/DashboardV2.module.css';
import { Plus, Edit2, Trash2, Eye, Medal } from 'lucide-react';

export default function Destinations() {
    const { destinations, addDestination, updateDestination, deleteDestination } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDest, setEditingDest] = useState(null);
    const [detailsDest, setDetailsDest] = useState(null);

    const handleOpenCreate = () => {
        setEditingDest(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (dest) => {
        setEditingDest(dest);
        setIsModalOpen(true);
    };

    const handleSubmit = (formData) => {
        if (editingDest) {
            updateDestination(editingDest.id, formData);
        } else {
            addDestination(formData);
        }
        setIsModalOpen(false);
    };

    return (
        <DashboardLayout title="Gestión de Destinos">
            <Head>
                <title>Destinos | TravelAgendy</title>
            </Head>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
                <button className="btn-primary" onClick={handleOpenCreate}>
                    <Plus size={20} /> Nuevo Destino
                </button>
            </div>

            <div className={styles.gridContainer}>
                {destinations.map((dest) => (
                    <div key={dest.id} className={`${styles.card} ${dest.isPremium ? styles.premiumCard : ''}`}>
                        {/* Image Container */}
                        <div className={styles.cardImgWrap}>
                            <img
                                src={dest.hero_image_url || `https://source.unsplash.com/800x600/?travel,${dest.title}`}
                                alt={dest.title}
                                className={styles.cardImg}
                                onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2670&auto=format&fit=crop'}
                            />
                            <div className={styles.gradientOverlay}></div>

                            {/* Premium Badge */}
                            {dest.isPremium && (
                                <div className={styles.premiumBadge}>
                                    <Medal size={14} /> PREMIUM
                                </div>
                            )}

                            {/* Price Tag - Moved to top right */}
                            <div className={styles.priceTagTopRight}>
                                {dest.currency} ${dest.price.toLocaleString()}
                            </div>

                            {/* Overlay Content (Visible when NOT hovered) */}
                            <div className={styles.cardOverlayContent}>
                                <h3>{dest.title}</h3>
                                <p>{dest.category}</p>
                            </div>
                        </div>

                        {/* Card Body (Slides up on hover) */}
                        <div className={styles.cardBody}>
                            <div>
                                <h3 className={styles.cardTitle}>{dest.title}</h3>
                                <p className={styles.cardSubtitle}>
                                    {dest.subtitle}
                                </p>
                            </div>

                            <div className={styles.cardFooter}>
                                <button
                                    className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                                    data-tooltip="Ver Detalles"
                                    onClick={() => setDetailsDest(dest)}
                                >
                                    <Eye size={18} />
                                </button>
                                <button
                                    className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                                    data-tooltip="Editar"
                                    onClick={() => handleOpenEdit(dest)}
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                                    data-tooltip="Eliminar"
                                    onClick={() => deleteDestination(dest.id)}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingDest ? "Editar Destino" : "Crear Nuevo Destino"}
            >
                <DestinationForm
                    initialData={editingDest}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>

            <DestinationDetailsModal
                destination={detailsDest}
                isOpen={!!detailsDest}
                onClose={() => setDetailsDest(null)}
            />
        </DashboardLayout>
    );
}
