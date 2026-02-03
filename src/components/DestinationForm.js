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
            <div className={styles.modalBody} style={{ padding: '1.5rem', maxHeight: 'calc(80vh - 100px)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Título</label>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={styles.formInput}
                            required
                            placeholder="Ej. París"
                            style={{ padding: '0.6rem' }}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Subtítulo</label>
                        <input
                            name="subtitle"
                            value={formData.subtitle}
                            onChange={handleChange}
                            className={styles.formInput}
                            style={{ padding: '0.6rem' }}
                        />
                    </div>
                </div>

                <div className={styles.formGroup} style={{ marginTop: '0.5rem' }}>
                    <label className={styles.formLabel}>URL Imagen</label>
                    <input
                        name="hero_image_url"
                        value={formData.hero_image_url}
                        onChange={handleChange}
                        className={styles.formInput}
                        style={{ padding: '0.6rem' }}
                    />
                </div>

                <div className={styles.formGroup} style={{ marginTop: '0.5rem' }}>
                    <label className={styles.formLabel}>Descripción</label>
                    <textarea
                        name="description_long"
                        value={formData.description_long}
                        onChange={handleChange}
                        className={styles.formTextarea}
                        required
                        style={{ minHeight: '80px', padding: '0.6rem' }}
                    />
                </div>
            </div>

            <div className={styles.modalFooter} style={{ padding: '1rem' }}>
                <button type="button" className={styles.btnSecondary} onClick={onCancel}>
                    Cancelar
                </button>
                <button type="submit" className={styles.btnPrimary}>
                    {initialData ? 'Actualizar' : 'Guardar'}
                </button>
            </div>
        </form>

    );
}
