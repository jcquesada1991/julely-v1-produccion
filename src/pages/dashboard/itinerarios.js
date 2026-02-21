import Head from 'next/head';
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Modal from '@/components/Modal';
import { useApp } from '@/context/AppContext';
import styles from '@/styles/DashboardV2.module.css';
import { Plus, MapPin, Edit, Trash2, CameraOff } from 'lucide-react';
import SearchableSelect from '@/components/SearchableSelect';

export default function Itineraries() {
    const { itineraries, destinations, addItinerary, updateItinerary, deleteItinerary } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItinerary, setCurrentItinerary] = useState(null);

    const getDestName = (id) => {
        const d = destinations.find(x => x.id === parseInt(id));
        return d ? d.title : 'Desconocido';
    };

    const handleEdit = (item) => {
        setCurrentItinerary(item);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de eliminar esta excursión?')) {
            deleteItinerary(id);
        }
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setCurrentItinerary(null);
    };

    return (
        <DashboardLayout title="Gestión de Itinerarios">
            <Head>
                <title>Itinerarios | TravelAgendy</title>
            </Head>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 className={styles.pageTitle} style={{ fontSize: '2rem' }}>Excursiones</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Gestiona las excursiones para los itinerarios</p>
                </div>
                <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} /> Nueva Excursión
                </button>
            </div>

            <div className={styles.paramountCard}>
                <div className={styles.tableResponsiveWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.tableHeader}>Imagen</th>
                                <th className={styles.tableHeader}>Nombre</th>
                                <th className={styles.tableHeader}>Descripción</th>
                                <th className={styles.tableHeader}>Destino</th>
                                <th className={styles.tableHeader}>Precio</th>
                                <th className={styles.tableHeader} style={{ textAlign: 'center' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itineraries.map(item => (
                                <tr key={item.id}>
                                    <td>
                                        <div className={styles.imgThumbnail} style={{ width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden', background: 'var(--bg-card-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.parentElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-camera-off"><line x1="1" x2="23" y1="1" y2="23"/><path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l2-2h7l2 2"/><path d="M7 13a4 4 0 0 1 4-4"/><path d="M15 13a4 4 0 0 0-4 4"/></svg>';
                                                    }}
                                                />
                                            ) : (
                                                <CameraOff size={20} color="var(--text-secondary)" />
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.name}</div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {item.description}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                                            <MapPin size={16} />
                                            {getDestName(item.destination_id)}
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{
                                            fontWeight: 800,
                                            color: 'var(--accent-color)',
                                            background: 'rgba(153, 221, 181, 0.15)',
                                            padding: '0.25rem 0.6rem',
                                            borderRadius: '6px',
                                            fontSize: '0.8rem',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '2px'
                                        }}>
                                            $ {item.price ? Number(item.price).toLocaleString() : '0'} USD
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.actions} style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                            <button
                                                className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                                                data-tooltip="Editar"
                                                onClick={() => handleEdit(item)}
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                                                data-tooltip="Eliminar"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {itineraries.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                                        No hay excursiones registradas.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleClose}
                title={currentItinerary ? "Editar Excursión" : "Nueva Excursión"}
            >
                <ItineraryForm
                    initialData={currentItinerary}
                    destinations={destinations}
                    onSubmit={(data) => {
                        if (currentItinerary) {
                            updateItinerary(currentItinerary.id, data);
                        } else {
                            addItinerary(data);
                        }
                        handleClose();
                    }}
                    onCancel={handleClose}
                />
            </Modal>
        </DashboardLayout>
    );
}

function ItineraryForm({ initialData, destinations, onSubmit, onCancel }) {
    const [formData, setFormData] = useState(initialData || {
        destination_id: '',
        name: '',
        description: '',
        price: '',
        image: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validation: Price > 0
        if (Number(formData.price) <= 0) {
            alert('El precio debe ser mayor a 0');
            return;
        }
        onSubmit(formData);
    };

    const inputStyle = {
        width: '100%',
        padding: '0.75rem',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        marginTop: '0.25rem',
        fontSize: '0.9rem',
        background: 'var(--bg-main)',
        color: 'var(--text-primary)'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '0.85rem',
        fontWeight: 600,
        color: 'var(--text-secondary)',
        marginTop: '1rem'
    };

    return (
        <form onSubmit={handleSubmit}>
            <SearchableSelect
                label="Destino Asociado"
                required
                options={destinations}
                value={formData.destination_id}
                onChange={(e) => setFormData({ ...formData, destination_id: e.target.value })}
                name="destination_id"
                placeholder="Seleccione un destino"
            />

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div>
                    <label style={labelStyle}>Nombre</label>
                    <input
                        required
                        style={inputStyle}
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ej: Museo del Louvre"
                    />
                </div>
                <div>
                    <label style={labelStyle}>Precio ($)</label>
                    <input
                        type="number"
                        required
                        style={inputStyle}
                        value={formData.price}
                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                        placeholder="0.00"
                        min="0.01" step="0.01"
                    />
                </div>
            </div>

            <label style={labelStyle}>URL de la Imagen</label>
            <input
                type="url"
                style={inputStyle}
                value={formData.image}
                onChange={e => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://... (Dejar vacío si no tiene imagen)"
            />

            <label style={labelStyle}>Descripción</label>
            <textarea
                required
                rows={4}
                style={{ ...inputStyle, resize: 'vertical' }}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Breve descripción del lugar..."
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" onClick={onCancel} style={{ padding: '0.75rem 1.5rem', border: '1px solid var(--border-color)', background: 'transparent', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-secondary)' }}>Cancelar</button>
                <button type="submit" style={{ padding: '0.75rem 1.5rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    {initialData ? 'Actualizar' : 'Crear'}
                </button>
            </div>
        </form>
    );
}
