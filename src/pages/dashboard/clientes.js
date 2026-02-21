import Head from 'next/head';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Modal from '@/components/Modal';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import styles from '@/styles/DashboardV2.module.css';
import { Plus, User, Phone, Edit, Trash2, Mail, Globe, FileText, Search } from 'lucide-react';

export default function Clients() {
    const { clients, addClient, updateClient, deleteClient } = useApp();
    const { can } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentClient, setCurrentClient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleOpenCreate = () => {
        setCurrentClient(null);
        setIsModalOpen(true);
    };

    const handleEdit = (client) => {
        setCurrentClient(client);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de eliminar este cliente?')) {
            deleteClient(id);
        }
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setCurrentClient(null);
    };

    // Helper to get initials
    const getInitials = (name, surname) => {
        if (!name) return '??';
        return (name[0] + (surname ? surname[0] : '')).toUpperCase();
    };

    // Filter clients by search term
    const filteredClients = clients.filter(client => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            (client.name || '').toLowerCase().includes(term) ||
            (client.surname || '').toLowerCase().includes(term) ||
            (client.email || '').toLowerCase().includes(term) ||
            (client.phone || '').toLowerCase().includes(term) ||
            (client.passport || '').toLowerCase().includes(term) ||
            (client.nationality || '').toLowerCase().includes(term)
        );
    });

    return (
        <DashboardLayout title="Gestión de Clientes">
            <Head>
                <title>Clientes | TravelAgendy</title>
            </Head>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 className={styles.pageTitle} style={{ fontSize: '2rem' }}>Clientes</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Administra la base de datos de viajeros</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {/* Search */}
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                padding: '0.6rem 0.75rem 0.6rem 2.25rem',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                background: 'var(--bg-card)',
                                color: 'var(--text-primary)',
                                fontSize: '0.85rem',
                                outline: 'none',
                                width: '220px'
                            }}
                        />
                    </div>
                    <button className="btn-primary" onClick={handleOpenCreate}>
                        <Plus size={20} /> Nuevo Cliente
                    </button>
                </div>
            </div>

            <div className={styles.paramountCard}>
                <div className={styles.tableResponsiveWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.tableHeader}>Cliente</th>
                                <th className={styles.tableHeader}>Contacto</th>
                                <th className={styles.tableHeader}>Nacionalidad</th>
                                <th className={styles.tableHeader}>Pasaporte</th>
                                <th className={styles.tableHeader} style={{ textAlign: 'center' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClients.map((client) => (
                                <tr key={client.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div className={styles.avatarCircle} style={{
                                                background: 'var(--bg-card-hover)',
                                                border: '1px solid var(--border-color)',
                                                color: 'var(--text-primary)'
                                            }}>
                                                {getInitials(client.name, client.surname)}
                                            </div>
                                            <div>
                                                <div className={styles.textPrimary} style={{ fontWeight: 700 }}>
                                                    {client.name} {client.surname}
                                                </div>
                                                {client.booking_date && (
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                        Reserva: {new Date(client.booking_date).toLocaleDateString('es-ES')}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            <div className={styles.textSecondary} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                                                <Phone size={14} />
                                                {client.phone}
                                            </div>
                                            {client.email && (
                                                <div className={styles.textSecondary} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                                                    <Mail size={14} />
                                                    {client.email}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        {client.nationality ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                <Globe size={14} />
                                                {client.nationality}
                                            </div>
                                        ) : (
                                            <span style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>—</span>
                                        )}
                                    </td>
                                    <td>
                                        {client.passport ? (
                                            <span style={{
                                                fontFamily: 'monospace',
                                                fontSize: '0.85rem',
                                                color: 'var(--text-primary)',
                                                background: 'var(--bg-card-hover)',
                                                padding: '0.2rem 0.5rem',
                                                borderRadius: '4px',
                                                border: '1px solid var(--border-color)'
                                            }}>
                                                {client.passport}
                                            </span>
                                        ) : (
                                            <span style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>—</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className={styles.actions} style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                            <button
                                                className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                                                data-tooltip="Editar"
                                                onClick={() => handleEdit(client)}
                                            >
                                                <Edit size={16} />
                                            </button>
                                            {can('canDeleteClients') && (
                                                <button
                                                    className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                                                    data-tooltip="Eliminar"
                                                    onClick={() => handleDelete(client.id)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredClients.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                                        {searchTerm ? 'No se encontraron clientes con ese criterio.' : 'No hay clientes registrados.'}
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
                title={currentClient ? "Editar Cliente" : "Nuevo Cliente"}
            >
                <ClientForm
                    initialData={currentClient}
                    onSubmit={(data) => {
                        if (currentClient) {
                            updateClient(currentClient.id, data);
                        } else {
                            addClient(data);
                        }
                        handleClose();
                    }}
                    onCancel={handleClose}
                />
            </Modal>
        </DashboardLayout>
    );
}

function ClientForm({ initialData, onSubmit, onCancel }) {
    const [formData, setFormData] = useState(initialData || {
        name: '',
        surname: '',
        phone: '', // Stored combined
        email: '',
        passport: '',
        birthdate: '',
        nationality: '',
        address: '',
        notes: '',
        booking_date: ''
    });

    // Helper to split initial phone if exists
    const initialCountryCode = initialData?.phone?.includes(' ')
        ? initialData.phone.split(' ')[0]
        : '+1';
    const initialPhoneNumber = initialData?.phone?.includes(' ')
        ? initialData.phone.substring(initialData.phone.indexOf(' ') + 1)
        : (initialData?.phone || '');

    const [countryCode, setCountryCode] = useState(initialCountryCode);
    const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);

    // Update formData when either part of the phone changes
    useEffect(() => {
        if (phoneNumber) {
            handleChange('phone', `${countryCode} ${phoneNumber}`);
        } else {
            handleChange('phone', '');
        }
    }, [countryCode, phoneNumber]);

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const inputStyle = {
        width: '100%',
        padding: '0.65rem 0.75rem',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        background: 'var(--bg-main)',
        color: 'var(--text-primary)',
        fontSize: '0.9rem',
        outline: 'none',
        transition: 'border-color 0.2s'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '0.8rem',
        fontWeight: 600,
        color: 'var(--text-secondary)',
        marginBottom: '0.3rem',
        textTransform: 'uppercase',
        letterSpacing: '0.03em'
    };

    const groupStyle = { marginBottom: '1rem' };

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
            {/* Grid layout 2 columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                <div style={groupStyle}>
                    <label style={labelStyle}>Nombre *</label>
                    <input
                        required
                        style={inputStyle}
                        value={formData.name}
                        onChange={e => handleChange('name', e.target.value)}
                        placeholder="Nombre"
                    />
                </div>

                <div style={groupStyle}>
                    <label style={labelStyle}>Apellidos *</label>
                    <input
                        required
                        style={inputStyle}
                        value={formData.surname}
                        onChange={e => handleChange('surname', e.target.value)}
                        placeholder="Apellidos"
                    />
                </div>

                <div style={groupStyle}>
                    <label style={labelStyle}>Teléfono *</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <select
                            style={{ ...inputStyle, width: '100px', cursor: 'pointer' }}
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                        >
                            <option value="+1">+1 (US/CA/PR)</option>
                            <option value="+34">+34 (ES)</option>
                            <option value="+51">+51 (PE)</option>
                            <option value="+52">+52 (MX)</option>
                            <option value="+54">+54 (AR)</option>
                            <option value="+56">+56 (CL)</option>
                            <option value="+57">+57 (CO)</option>
                        </select>
                        <input
                            required
                            style={{ ...inputStyle, flex: 1 }}
                            value={phoneNumber}
                            onChange={e => setPhoneNumber(e.target.value)}
                            placeholder="000 000 0000"
                        />
                    </div>
                </div>

                <div style={groupStyle}>
                    <label style={labelStyle}>Correo Electrónico *</label>
                    <input
                        required
                        type="email"
                        style={inputStyle}
                        value={formData.email}
                        onChange={e => handleChange('email', e.target.value)}
                        placeholder="correo@ejemplo.com"
                    />
                </div>

                <div style={groupStyle}>
                    <label style={labelStyle}>Nro. de Pasaporte</label>
                    <input
                        style={inputStyle}
                        value={formData.passport}
                        onChange={e => handleChange('passport', e.target.value)}
                        placeholder="PA1234567"
                    />
                </div>

                <div style={groupStyle}>
                    <label style={labelStyle}>Fecha de Nacimiento</label>
                    <input
                        type="date"
                        style={inputStyle}
                        value={formData.birthdate}
                        onChange={e => handleChange('birthdate', e.target.value)}
                    />
                </div>

                <div style={groupStyle}>
                    <label style={labelStyle}>Nacionalidad</label>
                    <input
                        style={inputStyle}
                        value={formData.nationality}
                        onChange={e => handleChange('nationality', e.target.value)}
                        placeholder="Ej. Colombiano"
                    />
                </div>

                <div style={groupStyle}>
                    <label style={labelStyle}>Fecha de Reserva</label>
                    <input
                        type="date"
                        style={inputStyle}
                        value={formData.booking_date}
                        onChange={e => handleChange('booking_date', e.target.value)}
                    />
                </div>
            </div>

            {/* Full width fields */}
            <div style={groupStyle}>
                <label style={labelStyle}>Dirección</label>
                <input
                    style={inputStyle}
                    value={formData.address}
                    onChange={e => handleChange('address', e.target.value)}
                    placeholder="Dirección completa"
                />
            </div>

            <div style={groupStyle}>
                <label style={labelStyle}>Notas Especiales / Requerimientos</label>
                <textarea
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '60px' }}
                    value={formData.notes}
                    onChange={e => handleChange('notes', e.target.value)}
                    placeholder="Alergias, preferencias dietéticas, requerimientos especiales..."
                    rows={2}
                />
            </div>

            <div className={styles.modalActions} style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <button type="button" onClick={onCancel} style={{
                    padding: '0.65rem 1.25rem',
                    border: '1px solid var(--border-color)',
                    background: 'transparent',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 500,
                    color: 'var(--text-secondary)'
                }}>Cancelar</button>
                <button type="submit" className="btn-primary">
                    {initialData ? 'Actualizar' : 'Crear Cliente'}
                </button>
            </div>
        </form>
    );
}
