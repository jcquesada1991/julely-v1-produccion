import Head from 'next/head';
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Modal from '@/components/Modal';
import DestinationForm from '@/components/DestinationForm';
import { useApp } from '@/context/AppContext';
import styles from '@/styles/DashboardV2.module.css';
import { Plus, Edit2, Trash2, Medal, Heart, CameraOff } from 'lucide-react';

export default function Destinations() {
    const { destinations, addDestination, updateDestination, deleteDestination } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDest, setEditingDest] = useState(null);

    // Show all destinations, default order (newest at bottom)
    const displayedDestinations = destinations;

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
                {displayedDestinations.map((dest) => (
                    <div key={dest.id} className={`${styles.card} ${dest.isPremium ? styles.premiumCard : ''}`}>
                        {/* Image Container */}
                        <div className={styles.cardImgWrap}>
                            {dest.hero_image_url ? (
                                <img
                                    src={dest.hero_image_url}
                                    alt={dest.title}
                                    className={styles.cardImg}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        // Fallback logic could go here or rely on the container to show icon if img is hidden
                                    }}
                                />
                            ) : (
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: '#F1F5F9',
                                    color: '#94A3B8'
                                }}>
                                    <CameraOff size={48} strokeWidth={1.5} />
                                </div>
                            )}
                            <div className={styles.gradientOverlay}></div>

                            <div className={styles.badgeContainer}>
                                {/* Premium Badge */}
                                {dest.isPremium && (
                                    <div className={styles.premiumBadge}>
                                        <Medal size={14} /> PREMIUM
                                    </div>
                                )}

                                {/* Favorite Badge */}
                                {dest.isFavorite && (
                                    <div className={styles.favoriteBadge}>
                                        <Heart size={14} fill="white" /> FAVORITO
                                    </div>
                                )}
                            </div>

                            {/* Overlay Content (Visible when NOT hovered) */}
                            <div className={styles.cardOverlayContent}>
                                <h3 className={styles.cardOverlayTitle}>{dest.title}</h3>
                                <p className={styles.cardOverlaySubtitle}>{dest.subtitle || dest.category}</p>
                            </div>
                        </div>

                        {/* Card Body (Slides up on hover) */}
                        <div className={styles.cardBody}>
                            <div>
                                <h3 className={styles.cardTitle}>{dest.title}</h3>
                                <p
                                    className={styles.cardSubtitle}
                                    title={dest.description_long}
                                    style={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}
                                >
                                    {dest.description_long || dest.subtitle}
                                </p>
                            </div>

                            <div className={styles.cardFooter}>
                                <button
                                    className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                                    data-tooltip="Editar"
                                    onClick={() => handleOpenEdit(dest)}
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                                    data-tooltip="Eliminar"
                                    onClick={() => deleteDestination(dest.id)}
                                >
                                    <Trash2 size={16} />
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
        </DashboardLayout>
    );
}
