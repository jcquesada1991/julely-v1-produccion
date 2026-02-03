import Head from 'next/head';
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Modal from '@/components/Modal';
import UserForm from '@/components/UserForm';
import { useApp } from '@/context/AppContext';
import styles from '@/styles/DashboardV2.module.css';
import { Plus, Edit2, Trash2, Mail, Shield, MapPin } from 'lucide-react';

export default function Usuarios() {
    const { users, addUser, updateUser, deleteUser } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const handleOpenCreate = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (user) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de eliminar este usuario?')) {
            deleteUser(id);
        }
    };

    const handleSubmit = (formData) => {
        if (editingUser) {
            updateUser(editingUser.id, formData);
        } else {
            addUser(formData);
        }
        setIsModalOpen(false);
    };

    // Helper to get initials
    const getInitials = (name) => {
        if (!name) return '??';
        const parts = name.split(' ');
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    // Helper for random color based on name
    const getAvatarColor = (name) => {
        const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <DashboardLayout title="Gestión de Usuarios">
            <Head>
                <title>Usuarios | TravelAgendy</title>
            </Head>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 className={styles.pageTitle} style={{ fontSize: '2rem' }}>Usuarios</h2>
                    <p style={{ color: '#64748B' }}>Gestiona los usuarios y sus permisos</p>
                </div>
                <button className="btn-primary" onClick={handleOpenCreate}>
                    <Plus size={20} /> Nuevo Usuario
                </button>
            </div>

            <div className={styles.paramountCard}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.tableHeader}>Usuario</th>
                            <th className={styles.tableHeader}>Email</th>
                            <th className={styles.tableHeader}>Rol</th>
                            <th className={styles.tableHeader} style={{ textAlign: 'center' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            backgroundColor: getAvatarColor(user.name),
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 700,
                                            fontSize: '0.85rem'
                                        }}>
                                            {getInitials(user.name)}
                                        </div>
                                        <div style={{ fontWeight: 700, color: '#1E293B' }}>{user.name}</div>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748B' }}>
                                        <MapPin size={16} />
                                        {user.email}
                                    </div>
                                </td>
                                <td>
                                    <span style={{
                                        padding: '0.3rem 0.8rem',
                                        borderRadius: '99px',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        background: user.role === 'Administrador' ? '#DCFCE7' : '#E0F2FE',
                                        color: user.role === 'Administrador' ? '#166534' : '#075985',
                                        border: `1px solid ${user.role === 'Administrador' ? '#BBF7D0' : '#BAE6FD'}`
                                    }}>
                                        {user.role || 'Asesor'}
                                    </span>
                                </td>
                                <td>
                                    <div className={styles.actions} style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                        <button
                                            className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                                            data-tooltip="Editar"
                                            onClick={() => handleOpenEdit(user)}
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                                            data-tooltip="Eliminar"
                                            onClick={() => handleDelete(user.id)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>
                                    No hay usuarios registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingUser ? "Editar Usuario" : "Crear Nuevo Usuario"}
            >
                <UserForm
                    initialData={editingUser}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </DashboardLayout>
    );
}
