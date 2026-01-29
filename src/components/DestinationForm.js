import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import styles from '@/styles/FormModal.module.css';

export default function DestinationForm({ initialData = null, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        price: '',
        currency: 'USD',
        hero_image_url: '',
        description_long: '',
        itinerary: [{ day: 1, title: '', description: '' }],
        includes: [''],
        target: { title: '', content: '' }
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const updateItinerary = (index, field, value) => {
        const newItinerary = [...formData.itinerary];
        newItinerary[index][field] = value;
        setFormData(prev => ({ ...prev, itinerary: newItinerary }));
    };

    const addDay = () => {
        setFormData(prev => ({
            ...prev,
            itinerary: [...prev.itinerary, { day: prev.itinerary.length + 1, title: '', description: '' }]
        }));
    };

    const removeDay = (index) => {
        const newItinerary = formData.itinerary.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, itinerary: newItinerary }));
    };

    const updateInclude = (index, value) => {
        const newIncludes = [...formData.includes];
        newIncludes[index] = value;
        setFormData(prev => ({ ...prev, includes: newIncludes }));
    };

    const addInclude = () => {
        setFormData(prev => ({ ...prev, includes: [...prev.includes, ''] }));
    };

    const removeInclude = (index) => {
        const newIncludes = formData.includes.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, includes: newIncludes }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            price: Number(formData.price)
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className={styles.modalBody}>
                <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Título del Destino</label>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={styles.formInput}
                            required
                            placeholder="Ej. Escapada a París"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Precio</label>
                        <input
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleChange}
                            className={styles.formInput}
                            required
                        />
                    </div>

                    <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                        <label className={styles.formLabel}>Subtítulo (Slogan)</label>
                        <input
                            name="subtitle"
                            value={formData.subtitle}
                            onChange={handleChange}
                            className={styles.formInput}
                            placeholder="Breve descripción atractiva"
                        />
                    </div>

                    <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                        <label className={styles.formLabel}>URL Imagen Principal</label>
                        <input
                            name="hero_image_url"
                            value={formData.hero_image_url}
                            onChange={handleChange}
                            className={styles.formInput}
                            placeholder="https://..."
                        />
                        {formData.hero_image_url && (
                            <img
                                src={formData.hero_image_url}
                                alt="Preview"
                                style={{
                                    width: '100%',
                                    height: '150px',
                                    objectFit: 'cover',
                                    borderRadius: '12px',
                                    marginTop: '0.75rem',
                                    border: '2px solid #E2E8F0'
                                }}
                            />
                        )}
                    </div>

                    <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                        <label className={styles.formLabel}>Descripción Larga</label>
                        <textarea
                            name="description_long"
                            value={formData.description_long}
                            onChange={handleChange}
                            className={styles.formTextarea}
                            required
                        />
                    </div>

                    {/* Itinerario Section */}
                    <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                        <label className={styles.formLabel}>Itinerario</label>
                        <div style={{
                            background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
                            padding: '1.5rem',
                            borderRadius: '16px',
                            border: '1px solid #E2E8F0'
                        }}>
                            {formData.itinerary.map((day, idx) => (
                                <div key={idx} style={{
                                    marginBottom: '1.5rem',
                                    paddingBottom: '1.5rem',
                                    borderBottom: idx < formData.itinerary.length - 1 ? '1px solid #E2E8F0' : 'none'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                        <span style={{
                                            fontWeight: 700,
                                            fontSize: '0.9rem',
                                            color: '#6366F1',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>
                                            Día {day.day}
                                        </span>
                                        {formData.itinerary.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeDay(idx)}
                                                style={{
                                                    color: '#EF4444',
                                                    border: 'none',
                                                    background: 'transparent',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem'
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                    <input
                                        placeholder="Título del día (Ej. Llegada)"
                                        value={day.title}
                                        onChange={(e) => updateItinerary(idx, 'title', e.target.value)}
                                        className={styles.formInput}
                                        style={{ marginBottom: '0.75rem' }}
                                    />
                                    <textarea
                                        placeholder="Actividades detalladas..."
                                        value={day.description}
                                        onChange={(e) => updateItinerary(idx, 'description', e.target.value)}
                                        className={styles.formTextarea}
                                        style={{ minHeight: '80px' }}
                                    />
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addDay}
                                style={{
                                    background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
                                    color: '#1E40AF',
                                    border: 'none',
                                    padding: '0.75rem 1.25rem',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontWeight: 700,
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                            >
                                <Plus size={16} /> Agregar Día
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.modalFooter}>
                <button type="button" className={styles.btnSecondary} onClick={onCancel}>
                    Cancelar
                </button>
                <button type="submit" className={styles.btnPrimary}>
                    {initialData ? 'Actualizar Destino' : 'Guardar Destino'}
                </button>
            </div>
        </form>
    );
}
