import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Eye, EyeOff, Save } from 'lucide-react';
import styles from '@/styles/Login.module.css';
import { supabase } from '@/lib/supabase';

export default function ResetPassword() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Al montar, checamos si hay un evento de recuperación en el hash
        // Supabase maneja esto automáticamente si configuramos adecuadamente su Auth en _app.js,
        // pero validamos si hay un error en URL (ej. token_expired).
        const hash = window.location.hash;
        if (hash && hash.includes('error_description')) {
            const errorDescMatch = hash.match(/error_description=([^&]+)/);
            if (errorDescMatch) {
                setError(decodeURIComponent(errorDescMatch[1].replace(/\+/g, ' ')));
            }
        }
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== passwordConfirm) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: password
            });

            if (updateError) {
                setError(updateError.message);
                setIsLoading(false);
                return;
            }

            setMessage('Contraseña actualizada exitosamente. Redirigiendo al login...');

            // Redirect after 2 seconds
            setTimeout(() => {
                router.push('/login');
            }, 2000);

        } catch (err) {
            console.error('Update error:', err);
            setError('Error al actualizar contraseña.');
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Restablecer Contraseña | Julely</title>
            </Head>

            <div className={styles.backgroundOverlay}></div>

            <div className={styles.loginCard}>

                <div className={styles.welcomeText}>
                    Nueva Contraseña
                </div>

                <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Ingresa tu nueva contraseña para tu cuenta.
                </p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && <div className={styles.errorMessage}>{error}</div>}
                    {message && <div className={styles.successMessage} style={{ background: 'rgba(52, 211, 153, 0.2)', color: '#10B981', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid rgba(52, 211, 153, 0.4)', fontSize: '0.9rem', textAlign: 'center' }}>{message}</div>}

                    <div className={styles.inputGroup}>
                        <label>NUEVA CONTRASEÑA</label>
                        <div className={styles.passwordWrapper}>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                className={styles.eyeBtn}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>CONFIRMAR CONTRASEÑA</label>
                        <div className={styles.passwordWrapper}>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className={styles.loginBtn} disabled={isLoading || !password}>
                        {isLoading ? 'Actualizando...' : <><Save size={18} /> GUARDAR CONTRASEÑA</>}
                    </button>
                </form>
            </div>
        </div>
    );
}
