import Head from 'next/head';
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Modal from '@/components/Modal';
import UserForm from '@/components/UserForm';
import { useApp } from '@/context/AppContext';
import styles from '@/styles/ListCard.module.css';
import { Plus, Edit2, Trash2, Mail, Shield } from 'lucide-react';

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

            {/* Header with Create Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                        Usuarios del Sistema
                    </h2>
                    <p style={{ color: '#64748B', marginTop: '0.5rem' }}>
                        Gestiona los usuarios y sus permisos
                    </p>
                </div>
                <button className="btn-primary" onClick={handleOpenCreate}>
                    <Plus size={20} /> Nuevo Usuario
                </button>
            </div>

            {/* User Cards List */}
            <div>
                {users.map((user) => (
                    <div key={user.id} className={styles.listCard}>
                        {/* Avatar */}
                        <div className={styles.listCardAvatar} style={{ backgroundColor: getAvatarColor(user.name) }}>
                            {getInitials(user.name)}
                        </div>

                        {/* Content */}
                        <div className={styles.listCardContent}>
                            {/* Main Info */}
                            <div className={styles.listCardMain}>
                                <div className={styles.listCardName}>{user.name}</div>
                                <div className={styles.listCardRole}>
                                    <Shield size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                                    {user.role || 'Asesor'}
                                </div>
                            </div>

                            {/* User ID */}
                            <div className={styles.listCardInfo}>
                                <div className={styles.listCardLabel}>User ID</div>
                                <div className={styles.listCardValue}>#{user.id}</div>
                            </div>

                            {/* Role Badge */}
                            <div className={styles.listCardInfo}>
                                <div className={styles.listCardLabel}>Rol</div>
                                <div className={styles.listCardValue}>
                                    <span style={{
                                        padding: '0.3rem 0.75rem',
                                        borderRadius: '12px',
                                        fontSize: '0.8rem',
                                        fontWeight: 700,
                                        background: user.role === 'Administrador' ?
                                            'linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)' :
                                            'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)',
                                        color: user.role === 'Administrador' ? '#166534' : '#075985',
                                        border: user.role === 'Administrador' ? '1px solid #BBF7D0' : '1px solid #BAE6FD'
                                    }}>
                                        {user.role || 'Asesor'}
                                    </span>
                                </div>
                            </div>

                            {/* Email */}
                            <div className={styles.listCardInfo}>
                                <div className={styles.listCardLabel}>Email</div>
                                <div className={styles.listCardValue} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Mail size={14} color="#64748B" />
                                    {user.email}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className={styles.listCardActions}>
                            <button
                                className={styles.listCardActionBtn}
                                onClick={() => handleOpenEdit(user)}
                                title="Editar"
                            >
                                <Edit2 size={18} color="#0EA5E9" />
                            </button>
                            <button
                                className={styles.listCardActionBtn}
                                onClick={() => handleDelete(user.id)}
                                title="Eliminar"
                            >
                                <Trash2 size={18} color="#EF4444" />
                            </button>
                        </div>
                    </div>
                ))}

                {users.length === 0 && (
                    <div style={{
                        padding: '4rem 2rem',
                        textAlign: 'center',
                        background: 'white',
                        borderRadius: '16px',
                        border: '2px dashed #E2E8F0'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
                        <div style={{ color: '#64748B', fontSize: '1.1rem', fontWeight: 600 }}>
                            No hay usuarios registrados
                        </div>
                        <div style={{ color: '#94A3B8', marginTop: '0.5rem' }}>
                            Haz clic en "Nuevo Usuario" para agregar uno
                        </div>
                    </div>
                )}
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
