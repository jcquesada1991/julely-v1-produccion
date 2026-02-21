import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import SearchableSelect from './SearchableSelect';
import { Plus, X, ArrowUp, ArrowDown, MapPin, Calendar, CheckCircle } from 'lucide-react';
import styles from '@/styles/DashboardV2.module.css';

export default function SaleForm({ onSubmit, onCancel }) {
    const { destinations, clients, itineraries } = useApp();
    const [formData, setFormData] = useState({
        client_name: '',
        clientId: '',
        destination_id: '',
        status: 'Confirmada',
        customItinerary: []
    });

    const [availablePOIs, setAvailablePOIs] = useState([]);
    const [selectedPOIs, setSelectedPOIs] = useState([]);

    // Update Available POIs when Destination Changes
    useEffect(() => {
        if (formData.destination_id) {
            const relevant = itineraries.filter(i => String(i.destination_id) === String(formData.destination_id));
            // Show all, filter visually if added or just allow adding multiples? Assuming unique add for now.
            setAvailablePOIs(relevant);
        } else {
            setAvailablePOIs([]);
            setSelectedPOIs([]);
        }
    }, [formData.destination_id, itineraries]);

    const handleAddPOI = (poi) => {
        // Allow adding same POI multiple times? Usually no, but maybe. Let's assume Unique for now.
        if (!selectedPOIs.find(s => s.id === poi.id)) {
            setSelectedPOIs([...selectedPOIs, poi]);
        }
    };

    const handleRemovePOI = (poiId) => {
        setSelectedPOIs(selectedPOIs.filter(p => p.id !== poiId));
    };

    const movePoi = (index, direction) => {
        const newArr = [...selectedPOIs];
        const targetIndex = index + direction;
        if (targetIndex >= 0 && targetIndex < newArr.length) {
            [newArr[index], newArr[targetIndex]] = [newArr[targetIndex], newArr[index]];
            setSelectedPOIs(newArr);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // VALIDATION: Check POIs
        if (availablePOIs.length === 0) {
            alert("No se puede crear una venta para un destino que no tiene excursiones.");
            return;
        }

        if (selectedPOIs.length === 0) {
            alert("Debes seleccionar al menos un punto de interés para crear la venta.");
            return;
        }

        let finalClientName = formData.client_name;
        if (formData.clientId) {
            const c = clients.find(cl => String(cl.id) === String(formData.clientId));
            if (c) finalClientName = `${c.name} ${c.surname}`;
        }

        // Calculate Total
        const totalAmount = selectedPOIs.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);

        const submission = {
            ...formData,
            client_name: finalClientName,
            total_amount: totalAmount,
            custom_itinerary: selectedPOIs.map((p, index) => ({
                day: index + 1,
                ...p
            }))
        };

        onSubmit(submission);
    };

    const labelStyle = {
        display: 'block',
        fontSize: '0.85rem',
        fontWeight: 600,
        color: 'var(--text-secondary)',
        marginTop: '1rem'
    };

    const selectStyle = {
        width: '100%',
        padding: '0.75rem',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        fontSize: '0.9rem',
        marginTop: '0.25rem',
        backgroundColor: 'var(--bg-main)',
        color: 'var(--text-primary)',
        outline: 'none',
        transition: 'border-color 0.2s',
        cursor: 'pointer',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 0.75rem center',
        backgroundSize: '16px'
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Section 1: Basic Info */}
            <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={18} color="var(--primary-color)" /> Información General
                </h3>

                <SearchableSelect
                    label="Cliente"
                    placeholder="Seleccione un cliente..."
                    options={clients}
                    value={formData.clientId}
                    onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                    name="clientId"
                    labelKey="name"
                    renderOption={(c) => (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 500 }}>{c.name} {c.surname}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{c.phone}</span>
                        </div>
                    )}
                    required
                />

                <SearchableSelect
                    label="Destino"
                    placeholder="Seleccione destino..."
                    options={destinations}
                    value={formData.destination_id}
                    onChange={(e) => {
                        setFormData({ ...formData, destination_id: e.target.value });
                        setSelectedPOIs([]);
                    }}
                    name="destination_id"
                    renderOption={(d) => d.title}
                    required
                />

                <label style={labelStyle}>Estado de la Venta</label>
                <div style={{ position: 'relative' }}>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        style={selectStyle}
                        onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                    >
                        <option value="Confirmada">Confirmada</option>
                        <option value="Pendiente">Pendiente</option>
                    </select>
                </div>
            </div>

            {/* Section 2: Itinerary Builder */}
            {formData.destination_id && (
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
                    <div style={{ background: 'var(--bg-main)', padding: '1rem', color: 'white' }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <MapPin size={18} /> Armar Itinerario de Viaje
                        </h3>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', opacity: 0.8 }}>
                            Selecciona las actividades. El orden definirá el día asignado.
                        </p>
                    </div>

                    <div className={styles.itineraryBuilderGrid}>

                        {/* LEFT: Available POIs */}
                        <div style={{ borderRight: '1px solid var(--border-color)', padding: '1rem', background: 'var(--bg-card)' }}>
                            <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
                                Actividades Disponibles
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {availablePOIs.length === 0 ? (
                                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        No hay actividades registradas para este destino.
                                    </div>
                                ) : (
                                    availablePOIs.map(p => {
                                        const isSelected = selectedPOIs.find(s => s.id === p.id);
                                        return (
                                            <div
                                                key={p.id}
                                                onClick={() => !isSelected && handleAddPOI(p)}
                                                style={{
                                                    background: 'var(--bg-card-hover)',
                                                    padding: '0.75rem',
                                                    borderRadius: '8px',
                                                    border: isSelected ? '1px solid var(--border-color)' : '1px solid rgba(157, 116, 200, 0.3)',
                                                    cursor: isSelected ? 'default' : 'pointer',
                                                    opacity: isSelected ? 0.5 : 1,
                                                    transition: 'all 0.2s',
                                                    boxShadow: isSelected ? 'none' : 'var(--shadow-card)',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}
                                                onMouseEnter={(e) => !isSelected && (e.currentTarget.style.transform = 'translateY(-2px)')}
                                                onMouseLeave={(e) => !isSelected && (e.currentTarget.style.transform = 'translateY(0)')}
                                            >
                                                <div>
                                                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{p.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{/* Description truncated? */ p.description?.substring(0, 50)}...</div>
                                                </div>
                                                {!isSelected && <Plus size={16} color="var(--primary-color)" />}
                                                {isSelected && <CheckCircle size={16} color="var(--accent-color)" />}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* RIGHT: Timeline */}
                        <div style={{ padding: '1rem', background: 'var(--bg-card-hover)' }}>
                            <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary-color)', textAlign: 'center' }}>
                                Itinerario Final
                            </h4>

                            {selectedPOIs.length === 0 ? (
                                <div style={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--text-secondary)',
                                    gap: '1rem',
                                    border: '2px dashed var(--border-color)',
                                    borderRadius: '12px'
                                }}>
                                    <Calendar size={48} strokeWidth={1} />
                                    <span style={{ fontSize: '0.9rem' }}>Selecciona actividades para comenzar</span>
                                </div>
                            ) : (
                                <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                                    {/* Timeline Line */}
                                    <div style={{
                                        position: 'absolute',
                                        left: '7px',
                                        top: '10px',
                                        bottom: '10px',
                                        width: '2px',
                                        background: 'var(--border-color)'
                                    }}></div>

                                    {selectedPOIs.map((p, idx) => (
                                        <div key={p.id} style={{ position: 'relative', marginBottom: '1.5rem' }}>
                                            {/* Dot */}
                                            <div style={{
                                                position: 'absolute',
                                                left: '-2.45rem',
                                                top: '4px',
                                                width: '16px',
                                                height: '16px',
                                                borderRadius: '50%',
                                                background: 'var(--primary-color)',
                                                border: '4px solid var(--bg-card)'
                                            }}></div>

                                            {/* Content Card */}
                                            <div style={{
                                                background: 'rgba(157, 116, 200, 0.15)',
                                                borderRadius: '8px',
                                                padding: '0.75rem',
                                                border: '1px solid rgba(157, 116, 200, 0.3)',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <div>
                                                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '2px' }}>DÍA {idx + 1}</div>
                                                    <div style={{ fontWeight: 600, color: 'white', fontSize: '0.95rem' }}>{p.name}</div>
                                                </div>

                                                <div style={{ display: 'flex', gap: '4px' }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => movePoi(idx, -1)}
                                                        disabled={idx === 0}
                                                        style={{
                                                            padding: '4px',
                                                            borderRadius: '4px',
                                                            border: 'none',
                                                            background: idx === 0 ? 'transparent' : 'var(--bg-card)',
                                                            color: idx === 0 ? 'var(--text-light)' : 'var(--text-secondary)',
                                                            cursor: idx === 0 ? 'default' : 'pointer'
                                                        }}
                                                    >
                                                        <ArrowUp size={14} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => movePoi(idx, 1)}
                                                        disabled={idx === selectedPOIs.length - 1}
                                                        style={{
                                                            padding: '4px',
                                                            borderRadius: '4px',
                                                            border: 'none',
                                                            background: idx === selectedPOIs.length - 1 ? 'transparent' : 'var(--bg-card)',
                                                            color: idx === selectedPOIs.length - 1 ? 'var(--text-light)' : 'var(--text-secondary)',
                                                            cursor: idx === selectedPOIs.length - 1 ? 'default' : 'pointer'
                                                        }}
                                                    >
                                                        <ArrowDown size={14} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemovePOI(p.id)}
                                                        style={{
                                                            padding: '4px',
                                                            borderRadius: '4px',
                                                            border: 'none',
                                                            background: 'rgba(239, 68, 68, 0.15)',
                                                            color: '#EF4444',
                                                            cursor: 'pointer',
                                                            marginLeft: '4px'
                                                        }}
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <button type="button" onClick={onCancel} style={{ padding: '0.75rem 1.5rem', border: '1px solid var(--border-color)', background: 'transparent', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, color: 'var(--text-secondary)' }}>Cancelar Registro</button>
                <button type="submit" style={{ padding: '0.75rem 1.5rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Completar Venta</button>
            </div>
        </form>
    );
}
