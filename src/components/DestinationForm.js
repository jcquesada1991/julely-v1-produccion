import { useState, useEffect } from 'react';
import { Plus, Trash2, X, ChevronDown, ChevronUp } from 'lucide-react';
import styles from '@/styles/FormModal.module.css';
import ImageUploader from '@/components/ImageUploader';
import { useApp } from '@/context/AppContext';

export default function DestinationForm({ initialData = null, onSubmit, onCancel, onSavedAndAddExcursion, onDirty }) {
    const { addDestination, addDestinationImages, addItinerary } = useApp();

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


    // Saving state
    const [saving, setSaving] = useState(false);
    const [savedDestId, setSavedDestId] = useState(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                itinerary: initialData.itinerary || [{ day: 1, title: '', description: '' }],
                includes: initialData.includes || [''],
                target: initialData.target || { title: '', content: '' },
            });
            if (initialData.id) setSavedDestId(initialData.id);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        if (onDirty) onDirty(true);
    };

    const updateItinerary = (index, field, value) => {
        const newItinerary = [...formData.itinerary];
        newItinerary[index][field] = value;
        setFormData(prev => ({ ...prev, itinerary: newItinerary }));
    };
    const addDay = () => setFormData(prev => ({
        ...prev,
        itinerary: [...prev.itinerary, { day: prev.itinerary.length + 1, title: '', description: '' }]
    }));
    const removeDay = (index) => setFormData(prev => ({
        ...prev,
        itinerary: prev.itinerary.filter((_, i) => i !== index)
    }));

    const updateInclude = (index, value) => {
        const newIncludes = [...formData.includes];
        newIncludes[index] = value;
        setFormData(prev => ({ ...prev, includes: newIncludes }));
    };
    const addInclude = () => setFormData(prev => ({ ...prev, includes: [...prev.includes, ''] }));
    const removeInclude = (index) => setFormData(prev => ({
        ...prev,
        includes: prev.includes.filter((_, i) => i !== index)
    }));

    // Save destination first (needed to link excursions by ID)
    const saveDestination = async () => {
        if (!formData.title.trim()) {
            alert('El nombre del destino es requerido');
            return null;
        }
        setSaving(true);
        try {
            // If editing, just call onSubmit
            if (initialData && initialData.id) {
                await onSubmit({ ...formData, price: Number(formData.price) });
                return initialData.id;
            }

            // If already saved (e.g. user added excursions first), reuse the ID
            if (savedDestId) {
                // Update the existing destination with latest form data
                const { supabase } = await import('@/lib/supabase');
                await supabase
                    .from('destinations')
                    .update({
                        title: formData.title,
                        subtitle: formData.subtitle,
                        description_long: formData.description_long,
                        category: formData.category || 'Economy',
                        airport_code: formData.airport_code,
                        currency: formData.currency || 'USD',
                        price_adult: parseFloat(formData.price) || 0,
                        hero_image_url: formData.hero_image_url || '',
                        is_premium: formData.isPremium || false,
                    })
                    .eq('id', savedDestId);
                return savedDestId;
            }

            // New destination — save via supabase directly to capture the ID
            const { supabase } = await import('@/lib/supabase');
            const { data, error } = await supabase
                .from('destinations')
                .insert([{
                    title: formData.title,
                    subtitle: formData.subtitle,
                    description_long: formData.description_long,
                    category: formData.category || 'Economy',
                    airport_code: formData.airport_code,
                    currency: formData.currency || 'USD',
                    price_adult: parseFloat(formData.price) || 0,
                    hero_image_url: formData.hero_image_url || '',
                    is_premium: formData.isPremium || false,
                    is_active: true,
                }])
                .select()
                .single();

            if (error) throw error;

            setSavedDestId(data.id);
            return data.id;
        } catch (err) {
            alert('Error al guardar destino: ' + err.message);
            return null;
        } finally {
            setSaving(false);
        }
    };

    // Normal submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const destId = await saveDestination();
        if (!destId) return;

        // Excursions already saved by confirmExcursion() — no need to re-insert
        onSubmit({ ...formData, price: Number(formData.price), _savedId: destId });
    };


    const inputSm = { padding: '0.6rem', fontSize: '0.85rem', background: 'var(--bg-main)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', width: '100%', boxSizing: 'border-box' };

    return (
        <form onSubmit={handleSubmit}>
            <div className={styles.modalBody} style={{ padding: '1.5rem', maxHeight: 'calc(85vh - 120px)', overflowY: 'auto' }}>

                {/* Basic Info */}
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Título *</label>
                    <input name="title" value={formData.title} onChange={handleChange} className={styles.formInput} required placeholder="Ej. París" style={{ padding: '0.6rem' }} />
                </div>


                {/* ─── Hero Image ─── */}
                <ImageUploader
                    label="Imagen Principal (Hero)"
                    value={formData.hero_image_url || ''}
                    onChange={(url) => setFormData(prev => ({ ...prev, hero_image_url: url }))}
                    folder="destinos"
                    placeholder="https://..."
                    disableUrl={true}
                />

                {/* ─── Description ─── */}
                <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                    <label className={styles.formLabel}>Descripción *</label>
                    <textarea name="description_long" value={formData.description_long} onChange={handleChange} className={styles.formTextarea} required style={{ minHeight: '80px', padding: '0.6rem' }} />
                </div>


            </div>

            <div className={styles.modalFooter} style={{ padding: '1rem' }}>
                <button type="button" className={styles.btnSecondary} onClick={onCancel}>
                    Cancelar
                </button>
                <button type="submit" className={styles.btnPrimary} disabled={saving}>
                    {saving ? 'Guardando...' : (initialData ? 'Actualizar' : 'Guardar Destino')}
                </button>
            </div>
        </form>
    );
}
