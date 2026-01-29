import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';

export default function SaleForm({ onSubmit, onCancel }) {
    const { destinations } = useApp();
    const [formData, setFormData] = useState({
        client_name: '',
        destination_id: '',
        status: 'Confirmada'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
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
            <label style={labelStyle}>Nombre del Cliente</label>
            <input
                name="client_name"
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                style={inputStyle}
                required
                placeholder="Nombre Completo"
            />

            <label style={labelStyle}>Destino</label>
            <select
                name="destination_id"
                value={formData.destination_id}
                onChange={(e) => setFormData({ ...formData, destination_id: e.target.value })}
                style={inputStyle}
                required
            >
                <option value="">Seleccione un destino...</option>
                {destinations.map(d => (
                    <option key={d.id} value={d.id}>{d.title} - ${d.price}</option>
                ))}
            </select>

            <label style={labelStyle}>Estado</label>
            <select
                name="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                style={inputStyle}
            >
                <option value="Confirmada">Confirmada</option>
                <option value="Pendiente">Pendiente</option>
            </select>

            <div style={{ marginTop: '1.5rem', background: '#F0FDF4', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', color: '#166534' }}>
                Al registrar la venta se generará automáticamente el código de voucher.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" onClick={onCancel} style={{ padding: '0.75rem 1.5rem', border: '1px solid #E2E8F0', background: 'white', borderRadius: '8px', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ padding: '0.75rem 1.5rem', background: '#0EA5E9', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Registrar Venta</button>
            </div>
        </form>
    );
}
