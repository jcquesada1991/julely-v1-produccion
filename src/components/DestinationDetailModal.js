import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Edit2, Trash2, MapPin, DollarSign, Tag, Calendar, Image as ImageIcon } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useConfirm } from '@/components/ConfirmModal';

/**
 * DestinationDetailModal — Vista completa de un destino
 * Props:
 *   dest       — objeto destino completo con images[]
 *   onClose    — función para cerrar
 *   onEdit     — función para abrir DestinationForm en modo edición
 *   onDelete   — función para eliminar
 */
export default function DestinationDetailModal({ dest, onClose, onEdit, onDelete }) {
    const { itineraries } = useApp();
    const confirm = useConfirm();
    const [currentImg, setCurrentImg] = useState(0);

    // Todas las imágenes: hero + galería adicional
    const allImages = [
        ...(dest.hero_image_url ? [{ url: dest.hero_image_url, caption: 'Imagen principal' }] : []),
        ...(dest.images || []).map(i => ({ url: i.url, caption: i.caption || '' })),
    ];

    // Excursiones asociadas a este destino
    const destExcursions = itineraries.filter(i => String(i.destination_id) === String(dest.id));

    const prevImg = () => setCurrentImg(i => (i === 0 ? allImages.length - 1 : i - 1));
    const nextImg = () => setCurrentImg(i => (i === allImages.length - 1 ? 0 : i + 1));

    // Cerrar con Escape
    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    const handleDelete = async () => {
        const ok = await confirm(
            'Eliminar Destino',
            `¿Eliminar el destino "${dest.title}"? Esta acción no se puede deshacer.`
        );
        if (ok) {
            onDelete(dest.id);
            onClose();
        }
    };

    return (
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 1000,
                background: 'rgba(0,0,0,0.85)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '1rem',
                backdropFilter: 'blur(4px)',
            }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '20px',
                width: '100%', maxWidth: '900px',
                maxHeight: '90vh',
                overflow: 'auto',
                position: 'relative',
            }}>
                {/* Close button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '1rem', right: '1rem', zIndex: 10,
                        background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none',
                        borderRadius: '50%', width: '36px', height: '36px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                    }}
                >
                    <X size={18} />
                </button>

                {/* Image gallery */}
                <div style={{ position: 'relative', height: '360px', background: 'var(--bg-main)', borderRadius: '20px 20px 0 0', overflow: 'hidden' }}>
                    {allImages.length > 0 ? (
                        <>
                            <img
                                src={allImages[currentImg]?.url}
                                alt={allImages[currentImg]?.caption || dest.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s' }}
                                onError={(e) => e.target.style.display = 'none'}
                            />
                            {/* Gradient overlay */}
                            <div style={{
                                position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px',
                                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                            }} />
                            {/* Nav arrows (only if > 1 image) */}
                            {allImages.length > 1 && (
                                <>
                                    <button onClick={prevImg} style={navBtnStyle('left')}>
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button onClick={nextImg} style={navBtnStyle('right')}>
                                        <ChevronRight size={20} />
                                    </button>
                                    {/* Dot indicators */}
                                    <div style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
                                        {allImages.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentImg(idx)}
                                                style={{
                                                    width: idx === currentImg ? '24px' : '8px', height: '8px',
                                                    borderRadius: '4px', border: 'none', cursor: 'pointer',
                                                    background: idx === currentImg ? 'white' : 'rgba(255,255,255,0.5)',
                                                    transition: 'all 0.3s',
                                                }}
                                            />
                                        ))}
                                    </div>
                                    {/* Image count */}
                                    <div style={{
                                        position: 'absolute', top: '1rem', left: '1rem',
                                        background: 'rgba(0,0,0,0.6)', color: 'white',
                                        padding: '0.25rem 0.75rem', borderRadius: '20px',
                                        fontSize: '0.8rem', fontWeight: 600,
                                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                                    }}>
                                        <ImageIcon size={14} /> {currentImg + 1} / {allImages.length}
                                    </div>
                                </>
                            )}
                            {/* Title overlay */}
                            <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', color: 'white' }}>
                                <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                                    {dest.title}
                                </h2>
                                {dest.subtitle && (
                                    <p style={{ margin: '0.25rem 0 0', opacity: 0.9, fontSize: '1rem' }}>
                                        {dest.subtitle}
                                    </p>
                                )}
                            </div>
                        </>
                    ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                            <ImageIcon size={64} strokeWidth={1} />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div style={{ padding: '2rem' }}>

                    {/* Meta info chips */}
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                        {dest.price_adult > 0 && (
                            <div style={chipStyle('#6C5CE7')}>
                                <DollarSign size={14} />
                                {dest.currency || 'USD'} {Number(dest.price_adult).toLocaleString()} / adulto
                            </div>
                        )}
                        {dest.category && (
                            <div style={chipStyle('#0984E3')}>
                                <Tag size={14} /> {dest.category}
                            </div>
                        )}
                        {dest.airport_code && (
                            <div style={chipStyle('#00B894')}>
                                <MapPin size={14} /> {dest.airport_code}
                            </div>
                        )}
                        {dest.isPremium && (
                            <div style={chipStyle('#F39C12')}>
                                ⭐ PREMIUM
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    {dest.description_long && (
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
                                Descripción
                            </h3>
                            <p style={{ color: 'var(--text-primary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                                {dest.description_long}
                            </p>
                        </div>
                    )}

                    {/* Thumbnail strip */}
                    {allImages.length > 1 && (
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
                                Galería ({allImages.length} fotos)
                            </h3>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {allImages.map((img, idx) => (
                                    <button key={idx} onClick={() => setCurrentImg(idx)} style={{ border: 'none', padding: 0, cursor: 'pointer' }}>
                                        <img
                                            src={img.url}
                                            alt={`foto ${idx + 1}`}
                                            style={{
                                                width: '80px', height: '60px', objectFit: 'cover',
                                                borderRadius: '8px',
                                                outline: idx === currentImg ? '2px solid var(--primary-color)' : '2px solid transparent',
                                                transition: 'outline 0.2s',
                                            }}
                                            onError={(e) => e.target.style.display = 'none'}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Excursiones */}
                    {destExcursions.length > 0 && (
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
                                Excursiones ({destExcursions.length})
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
                                {destExcursions.map(exc => (
                                    <div key={exc.id} style={{
                                        background: 'var(--bg-main)', borderRadius: '10px',
                                        border: '1px solid var(--border-color)', overflow: 'hidden',
                                    }}>
                                        {exc.image_url && (
                                            <img src={exc.image_url} alt={exc.name} style={{ width: '100%', height: '80px', objectFit: 'cover' }} />
                                        )}
                                        <div style={{ padding: '0.75rem' }}>
                                            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{exc.name}</div>
                                            <div style={{ color: 'var(--accent-color)', fontWeight: 700, fontSize: '0.85rem' }}>${Number(exc.price || 0).toLocaleString()} USD</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                        <button
                            onClick={handleDelete}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}
                        >
                            <Trash2 size={16} /> Eliminar
                        </button>
                        <button
                            onClick={() => { onClose(); onEdit(dest); }}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}
                        >
                            <Edit2 size={16} /> Editar Destino
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const navBtnStyle = (side) => ({
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    [side]: '1rem',
    background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none',
    borderRadius: '50%', width: '40px', height: '40px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', transition: 'background 0.2s',
});

const chipStyle = (color) => ({
    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
    padding: '0.4rem 0.8rem', borderRadius: '20px',
    background: `${color}22`, color, border: `1px solid ${color}44`,
    fontSize: '0.8rem', fontWeight: 700,
});
