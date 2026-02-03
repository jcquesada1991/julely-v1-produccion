import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '@/styles/DashboardV2.module.css';
import { LogOut, LayoutGrid, Briefcase, Calendar, Users, Map, User, Menu, X } from 'lucide-react';

export default function DashboardLayout({ children, title }) {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isActive = (path) => router.pathname === path ? styles.navItemActive : '';

    const handleLogout = () => {
        // Limpiar cualquier dato de sesión si existe
        if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
            sessionStorage.clear();
        }
        router.push('/login');
    };

    // Función para obtener iniciales del nombre
    const getInitials = (name) => {
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return parts[0][0] + parts[1][0];
        }
        return name.substring(0, 2);
    };

    // Usuario actual (esto podría venir de un contexto o estado global)
    const currentUser = {
        name: 'Alberto Flores',
        role: 'Administrador'
    };

    const menuItems = [
        { icon: LayoutGrid, label: 'Dashboard', path: '/dashboard' },
        { icon: User, label: 'Clientes', path: '/dashboard/clientes' },
        { icon: Briefcase, label: 'Destinos', path: '/dashboard/destinos' },
        { icon: Map, label: 'Excursiones', path: '/dashboard/itinerarios' },
        { icon: Calendar, label: 'Ventas', path: '/dashboard/ventas' },
        { icon: Users, label: 'Usuarios', path: '/dashboard/usuarios' },
    ];

    return (
        <div className={styles.dashboardContainer}>
            {/* Top Navigation Bar */}
            <nav className={styles.topNav}>
                <div className={styles.navHeader}>
                    <div className={styles.brand} onClick={() => router.push('/dashboard')}>
                        <div className={styles.brandLogo}>
                            {/* Simple Logo Icon */}
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            TravelAgendy
                        </div>
                    </div>

                    <button
                        className={styles.mobileMenuBtn}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                <div className={`${styles.navLinks} ${isMenuOpen ? styles.showMenu : ''}`}>
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`${styles.navItem} ${isActive(item.path)}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <Icon size={18} />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>

                <div className={styles.actions}>
                    {/* Avatar con iniciales estilo Google */}
                    <div className={styles.userProfile}>
                        <div className={styles.avatarInitials}>
                            {getInitials(currentUser.name)}
                        </div>
                        <div className={styles.userInfo}>
                            <span className={styles.userName}>{currentUser.name}</span>
                            <span className={styles.userRole}>{currentUser.role}</span>
                        </div>
                    </div>

                    {/* Botón de Logout */}
                    <button
                        className={styles.logoutBtn}
                        onClick={handleLogout}
                        title="Cerrar Sesión"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
}
