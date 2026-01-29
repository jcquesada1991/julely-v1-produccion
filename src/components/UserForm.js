import { useState, useEffect } from 'react';
import styles from '@/styles/FormModal.module.css';

export default function UserForm({ initialData, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        email: '',
        role: 'Asesor'
    });

    useEffect(() => {
        if (initialData) {
            const nameParts = initialData.name ? initialData.name.split(' ') : [''];
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            setFormData({
                name: firstName,
                lastName: lastName,
                email: initialData.email || '',
                role: initialData.role || 'Asesor'
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const submitData = {
            ...formData,
            name: `${formData.name} ${formData.lastName}`.trim()
        };
        onSubmit(submitData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className={styles.modalBody}>
                <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Nombre</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Ej. Juan"
                            className={styles.formInput}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Apellido</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            placeholder="Ej. Pérez"
                            className={styles.formInput}
                        />
                    </div>

                    <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                        <label className={styles.formLabel}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="juan@travelagendy.com"
                            className={styles.formInput}
                        />
                    </div>

                    <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                        <label className={styles.formLabel}>Rol del Usuario</label>
                        <div className={styles.radioGroup}>
                            <label className={styles.radioLabel}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="Administrador"
                                    checked={formData.role === 'Administrador'}
                                    onChange={handleChange}
                                    className={styles.radioInput}
                                />
                                <span>Administrador</span>
                            </label>
                            <label className={styles.radioLabel}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="Asesor"
                                    checked={formData.role === 'Asesor'}
                                    onChange={handleChange}
                                    className={styles.radioInput}
                                />
                                <span>Asesor</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.modalFooter}>
                <button type="button" className={styles.btnSecondary} onClick={onCancel}>
                    Cancelar
                </button>
                <button type="submit" className={styles.btnPrimary}>
                    {initialData ? 'Actualizar Usuario' : 'Crear Usuario'}
                </button>
            </div>
        </form>
    );
}
