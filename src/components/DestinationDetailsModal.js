import { X, MapPin, Calendar, CheckCircle, Star, Hash, Globe, Clock, DollarSign, Users } from 'lucide-react';
import styles from '@/styles/DestinationModal.module.css';

export default function DestinationDetailsModal({ destination, isOpen, onClose }) {
    if (!isOpen || !destination) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                {/* Header with gradient */}
                <div className={styles.modalHeader}>
                    <div className={styles.headerContent}>
                        <div className={styles.titleSection}>
                            <h2 className={styles.title}>{destination.title}</h2>
                            <p className={styles.subtitle}>{destination.subtitle}</p>
                        </div>
                        <div className={styles.priceSection}>
                            <div className={styles.priceAmount}>
                                {destination.currency} ${destination.price.toLocaleString()}
                            </div>
                        </div>
                    </div>

                    <button onClick={onClose} className={styles.closeBtn}>
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className={styles.modalBody}>
                    <div className={styles.contentGrid}>
                        {/* Left Column */}
                        <div className={styles.mainColumn}>
                            {/* Description */}
                            <div className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <Globe size={20} />
                                    <h3>Descripción</h3>
                                </div>
                                <p className={styles.description}>
                                    {destination.description_long || "No hay descripción detallada disponible para este destino."}
                                </p>
                            </div>

                            {/* Itinerary */}
                            {destination.itinerary && destination.itinerary.length > 0 && (
                                <div className={styles.section}>
                                    <div className={styles.sectionHeader}>
                                        <Clock size={20} />
                                        <h3>Itinerario Sugerido</h3>
                                    </div>
                                    <div className={styles.timeline}>
                                        {destination.itinerary.map((item, idx) => (
                                            <div key={idx} className={styles.timelineItem}>
                                                <div className={styles.timelineDot}></div>
                                                <div className={styles.timelineContent}>
                                                    <h4>Día {item.day}: {item.title}</h4>
                                                    <p>{item.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column */}
                        <div className={styles.sideColumn}>
                            {/* Includes */}
                            {destination.includes && destination.includes.length > 0 && (
                                <div className={styles.infoCard}>
                                    <div className={styles.cardHeader}>
                                        <CheckCircle size={18} />
                                        <h4>Incluye</h4>
                                    </div>
                                    <ul className={styles.list}>
                                        {destination.includes.map((inc, i) => (
                                            <li key={i}>
                                                <span className={styles.checkmark}>✓</span>
                                                {inc}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Extras */}
                            {destination.extras && destination.extras.length > 0 && (
                                <div className={styles.infoCardPremium}>
                                    <div className={styles.cardHeader}>
                                        <Star size={18} />
                                        <h4>Extras Premium</h4>
                                    </div>
                                    <ul className={styles.list}>
                                        {destination.extras.map((ext, i) => (
                                            <li key={i}>
                                                <span className={styles.starmark}>★</span>
                                                {ext}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Target Audience */}
                            {destination.target && (
                                <div className={styles.targetCard}>
                                    <div className={styles.cardHeader}>
                                        <Users size={18} />
                                        <h4>Ideal Para</h4>
                                    </div>
                                    <div className={styles.targetContent}>
                                        <div className={styles.targetTitle}>{destination.target.title}</div>
                                        <div className={styles.targetDesc}>{destination.target.content}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
