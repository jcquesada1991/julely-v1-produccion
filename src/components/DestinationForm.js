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

    // Extra images for gallery
    const [galleryImages, setGalleryImages] = useState([]); // array of URL strings

    // Inline excursions
    const [excursions, setExcursions] = useState([]);
    const [showExcursionForm, setShowExcursionForm] = useState(false);
    const [newExcursion, setNewExcursion] = useState({ name: '', price_adult: '', price_child: '', description: '', image: '' });

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
            // Pre-cargar imágenes de galería existentes
            if (initialData.images && initialData.images.length > 0) {
                setGalleryImages(initialData.images.map(i => i.url));
            }
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

    // Gallery image management
    const addGalleryImage = (url) => {
        if (url && !galleryImages.includes(url)) {
            setGalleryImages(prev => [...prev, url]);
        }
    };
    const removeGalleryImage = (idx) => setGalleryImages(prev => prev.filter((_, i) => i !== idx));

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
                // Save new gallery images (only new ones that aren't in initialData.images)
                const existingUrls = (initialData.images || []).map(i => i.url);
                const newUrls = galleryImages.filter(url => !existingUrls.includes(url));
                if (newUrls.length > 0) await addDestinationImages(initialData.id, newUrls);
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
                // Save gallery images (only new ones not yet saved)
                if (galleryImages.length > 0) {
                    await addDestinationImages(savedDestId, galleryImages);
                }
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

            // Save gallery images
            if (galleryImages.length > 0) {
                await addDestinationImages(data.id, galleryImages);
            }

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

    // Add excursion button handler
    const handleAddExcursionClick = async () => {
        // Save the destination first if not saved yet
        if (!savedDestId) {
            const destId = await saveDestination();
            if (!destId) return;
            setSavedDestId(destId);
        }
        setShowExcursionForm(true);
    };

    const confirmExcursion = async () => {
        if (!newExcursion.name.trim()) { alert('El nombre de la excursión es requerido'); return; }
        await addItinerary({
            destination_id: savedDestId,
            name: newExcursion.name,
            description: newExcursion.description,
            price_adult: parseFloat(newExcursion.price_adult) || 0,
            price_child: parseFloat(newExcursion.price_child) || 0,
            image: newExcursion.image,
        });
        setExcursions(prev => [...prev, { ...newExcursion }]);
        setNewExcursion({ name: '', price_adult: '', price_child: '', description: '', image: '' });
        setShowExcursionForm(false);
    };

    const inputSm = { padding: '0.6rem', fontSize: '0.85rem', background: 'var(--bg-main)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', width: '100%', boxSizing: 'border-box' };

    return (
        <form onSubmit={handleSubmit}>
            <div className={styles.modalBody} style={{ padding: '1.5rem', maxHeight: 'calc(85vh - 120px)', overflowY: 'auto' }}>

                {/* Basic Info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Título *</label>
                        <input name="title" value={formData.title} onChange={handleChange} className={styles.formInput} required placeholder="Ej. París" style={{ padding: '0.6rem' }} />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Subtítulo</label>
                        <input name="subtitle" value={formData.subtitle} onChange={handleChange} className={styles.formInput} style={{ padding: '0.6rem' }} />
                    </div>
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

                {/* ─── Gallery Images ─── */}
                <div style={{ marginTop: '1.25rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                        Galería de Fotos Adicionales
                    </label>

                    {/* Thumbnails of added images */}
                    {galleryImages.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            {galleryImages.map((url, idx) => (
                                <div key={idx} style={{ position: 'relative', display: 'inline-block' }}>
                                    <img src={url} alt={`galería ${idx + 1}`} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                                    <button type="button" onClick={() => removeGalleryImage(idx)} style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
                                        <X size={10} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <ImageUploader
                        label=""
                        value=""
                        onChange={(urls) => {
                            if (Array.isArray(urls)) {
                                urls.forEach(url => addGalleryImage(url));
                            } else if (urls) {
                                addGalleryImage(urls);
                            }
                        }}
                        folder="destinos"
                        placeholder="https://... agregar foto adicional"
                        disableUrl={true}
                        multiple={true}
                    />
                </div>

                {/* ─── Description ─── */}
                <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                    <label className={styles.formLabel}>Descripción *</label>
                    <textarea name="description_long" value={formData.description_long} onChange={handleChange} className={styles.formTextarea} required style={{ minHeight: '80px', padding: '0.6rem' }} />
                </div>

                {/* ─── Excursiones inline ─── */}
                <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                            Excursiones del Destino
                        </label>
                        <button
                            type="button"
                            onClick={handleAddExcursionClick}
                            disabled={saving}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.9rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                        >
                            <Plus size={14} /> {saving ? 'Guardando destino...' : 'Agregar Excursión'}
                        </button>
                    </div>

                    {/* List of added excursions */}
                    {excursions.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            {excursions.map((exc, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem' }}>{exc.name}</span>
                                    <span style={{ color: 'var(--accent-color)', fontSize: '0.8rem', fontWeight: 700 }}>
                                        Adulto: ${exc.price_adult || 0} / Menor: ${exc.price_child || 0}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Inline excursion form */}
                    {showExcursionForm && (
                        <div style={{ background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--primary-color)', padding: '1rem', marginTop: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Nueva Excursión</strong>
                                <button type="button" onClick={() => setShowExcursionForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                                    <X size={16} />
                                </button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.5rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Nombre *</label>
                                    <input style={inputSm} value={newExcursion.name} onChange={e => setNewExcursion(p => ({ ...p, name: e.target.value }))} placeholder="Ej: Tour en Camello" />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>P. Adulto ($)</label>
                                    <input style={inputSm} type="number" value={newExcursion.price_adult} onChange={e => setNewExcursion(p => ({ ...p, price_adult: e.target.value }))} placeholder="0.00" />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>P. Menor ($)</label>
                                    <input style={inputSm} type="number" value={newExcursion.price_child} onChange={e => setNewExcursion(p => ({ ...p, price_child: e.target.value }))} placeholder="0.00" />
                                </div>
                            </div>
                            <div style={{ marginTop: '0.5rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Descripción</label>
                                <textarea style={{ ...inputSm, resize: 'vertical', minHeight: '60px' }} value={newExcursion.description} onChange={e => setNewExcursion(p => ({ ...p, description: e.target.value }))} placeholder="Breve descripción..." />
                            </div>
                            <ImageUploader
                                label="Imagen de la Excursión"
                                value={newExcursion.image || ''}
                                onChange={(url) => setNewExcursion(p => ({ ...p, image: url }))}
                                folder="excursiones"
                                placeholder="https://..."
                                disableUrl={true}
                            />
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                                <button type="button" onClick={() => setShowExcursionForm(false)} style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                    Cancelar
                                </button>
                                <button type="button" onClick={confirmExcursion} style={{ padding: '0.5rem 1rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
                                    Guardar Excursión
                                </button>
                            </div>
                        </div>
                    )}
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
