import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '@/styles/Dashboard.module.css';
import { LayoutDashboard, Map, Ticket, LogOut } from 'lucide-react';

export default function Layout({ children, title }) {
    const router = useRouter();

    const isActive = (path) => router.pathname === path ? styles.navItemActive : '';

    return (
        <div className={styles.dashboardContainer}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.brand}>
                    <img src="/images/logo.png" alt="Julely" style={{ height: '40px', objectFit: 'contain', margin: '0 auto' }} />
                </div>

                <nav className={styles.nav}>
                    <Link href="/dashboard" className={`${styles.navItem} ${isActive('/dashboard')}`}>
                        <LayoutDashboard size={20} />
                        Dashboard
                    </Link>
                    <Link href="/dashboard/destinos" className={`${styles.navItem} ${isActive('/dashboard/destinos')}`}>
                        <Map size={20} />
                        Destinos
                    </Link>
                    <Link href="/dashboard/ventas" className={`${styles.navItem} ${isActive('/dashboard/ventas')}`}>
                        <Ticket size={20} />
                        Ventas
                    </Link>
                </nav>

                <div className={styles.userProfile}>
                    <div className={styles.avatar}>A</div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Admin</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', cursor: 'pointer' }} onClick={() => router.push('/login')}>Cerrar Sesión</div>
                    </div>
                    <LogOut size={16} color="var(--text-secondary)" style={{ cursor: 'pointer' }} onClick={() => router.push('/login')} />
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                {title && (
                    <div className={styles.header}>
                        <h1 className={styles.title}>{title}</h1>
                    </div>
                )}
                {children}
            </main>
        </div>
    );
}
