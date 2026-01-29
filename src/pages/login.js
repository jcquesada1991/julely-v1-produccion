import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { LogIn, Eye, EyeOff, Plane } from 'lucide-react';
import styles from '@/styles/Login.module.css';
import { MOCK_DATA } from '@/data/mockData';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Mock login delay
        setTimeout(() => {
            // Validation: Allow specific admin credentials OR generic valid inputs (email present + password >= 6 chars)
            if ((email === 'admin@travelagendy.com' && password === 'admin') || (email && password.length >= 6)) {
                router.push('/dashboard');
            } else {
                setError('Credenciales inválidas');
                setIsLoading(false);
            }
        }, 1000);
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Login | TravelAgendy</title>
            </Head>

            {/* Background elements */}
            <div className={styles.backgroundOverlay}></div>

            {/* Glassmorphism Login Box */}
            <div className={styles.loginCard}>

                <div className={styles.welcomeText}>
                    Bienvenido a TravelAgency
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && <div className={styles.errorMessage}>{error}</div>}

                    <div className={styles.inputGroup}>
                        <label>EMAIL</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="nombre@ejemplo.com"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>CONTRASEÑA</label>
                        <div className={styles.passwordWrapper}>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
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

                    <button type="submit" className={styles.loginBtn} disabled={isLoading}>
                        {isLoading ? 'Ingresando...' : <><LogIn size={18} /> INGRESAR</>}
                    </button>
                </form>
            </div>
        </div>
    );
}
