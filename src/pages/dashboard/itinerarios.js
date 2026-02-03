import Head from 'next/head';
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Modal from '@/components/Modal';
import { useApp } from '@/context/AppContext';
import styles from '@/styles/DashboardV2.module.css';
import { Plus, MapPin, Edit, Trash2 } from 'lucide-react';
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
        if (confirm('¿Estás seguro de eliminar este punto de interés?')) {
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
                    <h2 className={styles.pageTitle} style={{ fontSize: '2rem' }}>Puntos de Interés</h2>
                    <p style={{ color: '#64748B' }}>Gestiona los puntos de interés para los itinerarios</p>
                </div>
                <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} /> Nuevo Punto
                </button>
            </div>

            <div className={styles.paramountCard}>
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
                                    <div className={styles.imgThumbnail} style={{ width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden' }}>
                                        <img
                                            src={item.image || 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=2670&auto=format&fit=crop'}
                                            alt={item.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div style={{ fontWeight: 700, color: '#1E293B' }}>{item.name}</div>
                                </td>
                                <td>
                                    <div style={{ fontSize: '0.8rem', color: '#64748B', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {item.description}
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748B' }}>
                                        <MapPin size={16} />
                                        {getDestName(item.destination_id)}
                                    </div>
                                </td>
                                <td>
                                    <span style={{
                                        fontWeight: 800,
                                        color: '#059669',
                                        background: '#ECFDF5',
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
                                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>
                                    No hay puntos de interés registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleClose}
                title={currentItinerary ? "Editar Punto de Interés" : "Nuevo Punto de Interés"}
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
        border: '1px solid #E2E8F0',
        borderRadius: '8px',
        marginTop: '0.25rem',
        fontSize: '0.9rem'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '0.85rem',
        fontWeight: 600,
        color: '#475569',
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
                    <label style={labelStyle}>Nombre del Punto de Interés</label>
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
                required
                style={inputStyle}
                value={formData.image}
                onChange={e => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
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
                <button type="button" onClick={onCancel} style={{ padding: '0.75rem 1.5rem', border: '1px solid #E2E8F0', background: 'white', borderRadius: '8px', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ padding: '0.75rem 1.5rem', background: '#0EA5E9', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    {initialData ? 'Actualizar' : 'Crear'}
                </button>
            </div>
        </form>
    );
}
