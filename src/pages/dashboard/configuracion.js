import { useState, useEffect } from 'react';
import Head from 'next/head';
import DashboardLayout from '@/components/DashboardLayout';
import { Save } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Configuracion() {
    const { systemSettings, updateSystemSetting, isLoading: appLoading } = useApp();
    const [terms, setTerms] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState(null);

    // Update local state when app context loads
    useEffect(() => {
        if (!appLoading) {
            setTerms(systemSettings['terms_and_conditions'] || '');
        }
    }, [systemSettings, appLoading]);

    const handleSave = async () => {
        setIsSaving(true);
        setMessage(null);
        try {
            await updateSystemSetting('terms_and_conditions', terms);
            setMessage({ type: 'success', text: 'Términos y condiciones guardados con éxito.' });
        } catch (error) {
            console.error('Error guardando:', error);
            setMessage({ type: 'error', text: 'Error al guardar los cambios.' });
        } finally {
            setIsSaving(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    return (
        <DashboardLayout title="Configuración | Julely">
            <Head>
                <title>Configuración | Julely</title>
            </Head>

            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
                <h1 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
                    Configuración del Sistema
                </h1>

                {message && (
                    <div style={{
                        padding: '1rem',
                        marginBottom: '1rem',
                        borderRadius: '8px',
                        background: message.type === 'success' ? '#10B98122' : '#EF444422',
                        color: message.type === 'success' ? '#10B981' : '#EF4444',
                        border: `1px solid ${message.type === 'success' ? '#10B981' : '#EF4444'}`
                    }}>
                        {message.text}
                    </div>
                )}

                <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                        Términos y Condiciones
                    </h2>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        Este texto aparecerá en la parte inferior de todos los recibos (Vouchers) generados por el sistema.
                    </p>

                    {appLoading ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Cargando...</div>
                    ) : (
                        <>
                            <textarea
                                value={terms}
                                onChange={(e) => setTerms(e.target.value)}
                                rows={15}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border-color)',
                                    background: 'var(--bg-main)',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.9rem',
                                    resize: 'vertical',
                                    lineHeight: '1.5',
                                    fontFamily: 'inherit'
                                }}
                                placeholder="Ingrese los términos y condiciones aquí..."
                            />

                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.75rem 1.5rem',
                                        background: 'var(--primary-color)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        cursor: isSaving ? 'not-allowed' : 'pointer',
                                        opacity: isSaving ? 0.7 : 1
                                    }}
                                >
                                    <Save size={18} />
                                    {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
