import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';
import styles from '@/styles/Login.module.css';
import { supabase } from '@/lib/supabase';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (resetError) {
                setError(resetError.message);
                setIsLoading(false);
                return;
            }

            setMessage('Se ha enviado un enlace para restablecer tu contraseña a tu correo. Por favor revisa tu bandeja de entrada o spam.');
            setEmail('');
        } catch (err) {
            console.error('Reset error:', err);
            setError('Error de conexión. Intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Recuperar Contraseña | Julely</title>
            </Head>

            {/* Background elements */}
            <div className={styles.backgroundOverlay}></div>

            {/* Glassmorphism Logic Box */}
            <div className={styles.loginCard}>

                <div className={styles.welcomeText}>
                    Recuperar Contraseña
                </div>
                <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Ingresa tu correo electrónico y te enviaremos un enlace para crear una nueva contraseña.
                </p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && <div className={styles.errorMessage}>{error}</div>}
                    {message && <div className={styles.successMessage} style={{ background: 'rgba(52, 211, 153, 0.2)', color: '#10B981', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid rgba(52, 211, 153, 0.4)', fontSize: '0.9rem', textAlign: 'center' }}>{message}</div>}

                    <div className={styles.inputGroup}>
                        <label>EMAIL</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="nombre@ejemplo.com"
                            required
                        />
                    </div>

                    <button type="submit" className={styles.loginBtn} disabled={isLoading || !email}>
                        {isLoading ? 'Enviando enlace...' : <><Mail size={18} /> ENVIAR ENLACE</>}
                    </button>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <Link href="/login" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                            <ArrowLeft size={16} /> Volver al Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
