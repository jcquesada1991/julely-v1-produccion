import Head from 'next/head';
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Modal from '@/components/Modal';
import { useApp } from '@/context/AppContext';
import styles from '@/styles/DashboardV2.module.css';
import { Plus, User, Phone, Edit, Trash2 } from 'lucide-react';

export default function Clients() {
    const { clients, addClient, updateClient, deleteClient } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentClient, setCurrentClient] = useState(null);

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

    // Helper for random color
    const getAvatarColor = (name) => {
        const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <DashboardLayout title="Gestión de Clientes">
            <Head>
                <title>Clientes | TravelAgendy</title>
            </Head>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 className={styles.pageTitle} style={{ fontSize: '2rem' }}>Clientes</h2>
                    <p style={{ color: '#64748B' }}>Administra la base de datos de clientes</p>
                </div>
                <button className="btn-primary" onClick={handleOpenCreate}>
                    <Plus size={20} /> Nuevo Cliente
                </button>
            </div>

            <div className={styles.paramountCard}>
                <div className={styles.tableResponsiveWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.tableHeader}>Cliente</th>
                                <th className={styles.tableHeader}>Teléfono</th>
                                <th className={styles.tableHeader} style={{ textAlign: 'center' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map((client) => (
                                <tr key={client.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                backgroundColor: getAvatarColor(client.name),
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 700,
                                                fontSize: '0.85rem'
                                            }}>
                                                {getInitials(client.name, client.surname)}
                                            </div>
                                            <div style={{ fontWeight: 700, color: '#1E293B' }}>
                                                {client.name} {client.surname}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748B' }}>
                                            <Phone size={16} />
                                            {client.phone}
                                        </div>
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
                                            <button
                                                className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                                                data-tooltip="Eliminar"
                                                onClick={() => handleDelete(client.id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {clients.length === 0 && (
                                <tr>
                                    <td colSpan="3" style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>
                                        No hay clientes registrados.
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
        phone: ''
    });

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
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
            <label style={labelStyle}>Nombre</label>
            <input
                required
                style={inputStyle}
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nombre"
            />

            <label style={labelStyle}>Apellidos</label>
            <input
                required
                style={inputStyle}
                value={formData.surname}
                onChange={e => setFormData({ ...formData, surname: e.target.value })}
                placeholder="Apellidos"
            />

            <label style={labelStyle}>Teléfono</label>
            <input
                required
                style={inputStyle}
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+00 000 000 000"
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
