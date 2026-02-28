import Head from 'next/head';
import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/context/AppContext';
import styles from '@/styles/DashboardV2.module.css';
import { TrendingUp, DollarSign, MapPin, Users, Package, Clock, ArrowUpRight } from 'lucide-react';
import { useState, useMemo } from 'react';

export default function Dashboard() {
    const { stats, destinations, sales, clients } = useApp();

    // Calcular estadísticas reales
    const dashboardStats = useMemo(() => {
        const totalSales = sales.length;
        const confirmedSales = sales.filter(s => s.status === 'Confirmada').length;
        const pendingSales = sales.filter(s => s.status === 'Pendiente').length;

        // Calcular ingresos totales (usando total_amount de cada venta)
        const totalRevenue = sales.reduce((acc, sale) => {
            return acc + (parseFloat(sale.total_amount) || 0);
        }, 0);

        // Destino más vendido
        const destinationSales = {};
        sales.forEach(sale => {
            destinationSales[sale.destination_id] = (destinationSales[sale.destination_id] || 0) + 1;
        });
        const mostSoldDestId = Object.keys(destinationSales).reduce((a, b) =>
            destinationSales[a] > destinationSales[b] ? a : b, Object.keys(destinationSales)[0]
        );
        const mostSoldDest = destinations.find(d => String(d.id) === String(mostSoldDestId));

        // Clientes Totales (registrados)
        const totalClients = clients.length;

        return {
            totalSales,
            confirmedSales,
            pendingSales,
            totalRevenue,
            mostSoldDest,
            totalClients, // Used for KPI
            totalDestinations: destinations.length,
            conversionRate: totalSales > 0 ? ((confirmedSales / totalSales) * 100).toFixed(1) : 0
        };
    }, [sales, destinations, clients]);

    return (
        <DashboardLayout title="Dashboard">
            <Head>
                <title>Dashboard | Julely</title>
            </Head>

            {/* Page Header Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                <div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem', fontWeight: 500 }}>
                        Panel de Control
                    </div>
                    <div className={styles.pageTitle}>
                        Estadísticas de Viajes
                    </div>
                </div>
            </div>

            <div className={styles.kantoGrid}>
                {/* LEFT COLUMN */}
                <div className={styles.mainSection}>

                    {/* Top Row: Main Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>

                        {/* Total Revenue Card */}
                        <div className={`${styles.statCard} ${styles.cardRevenue}`}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', position: 'relative', zIndex: 1 }}>
                                <div className={styles.statLabel} style={{ color: 'white', marginBottom: 0 }}>
                                    <DollarSign size={18} /> Ingresos Totales
                                </div>
                                <button className="btn-icon" style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none' }}>
                                    <ArrowUpRight size={16} />
                                </button>
                            </div>
                            <div className={styles.statNumber} style={{ marginBottom: '0.5rem', position: 'relative', zIndex: 1 }}>
                                ${dashboardStats.totalRevenue.toLocaleString()}
                            </div>
                            <div className={styles.statSub} style={{ color: 'rgba(255, 255, 255, 0.8)', position: 'relative', zIndex: 1 }}>
                                De {dashboardStats.totalSales} ventas registradas
                            </div>
                        </div>

                        {/* Total Sales Card */}
                        <div className={styles.statCard}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div className={styles.statLabel} style={{ marginBottom: 0 }}>
                                    <Package size={18} /> Ventas Totales
                                </div>
                                <span style={{ color: 'var(--accent-color)', fontWeight: 700, fontSize: '0.9rem' }}>
                                    {dashboardStats.conversionRate}% conversión
                                </span>
                            </div>
                            <div className={styles.statNumber}>
                                {dashboardStats.totalSales}
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                <span style={{ color: 'var(--accent-color)' }}>✓ {dashboardStats.confirmedSales} Confirmadas</span>
                                <span style={{ color: '#F59E0B' }}>⏳ {dashboardStats.pendingSales} Pendientes</span>
                            </div>
                        </div>

                    </div>

                    {/* Stats Row */}
                    <div className={styles.statsRow}>
                        <div className={styles.statCard}>
                            <div>
                                <div className={styles.statLabel}><Users size={16} /> Clientes</div>
                                <div className={styles.statNumber}>{dashboardStats.totalClients}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                                    Clientes registrados
                                </div>
                            </div>
                        </div>

                        <div className={styles.statCard}>
                            <div>
                                <div className={styles.statLabel}><MapPin size={16} /> Destinos</div>
                                <div className={styles.statNumber}>{dashboardStats.totalDestinations}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                                    Destinos disponibles
                                </div>
                            </div>
                        </div>

                        <div className={`${styles.statCard} ${styles.cardMostSold}`}>
                            <div>
                                <div className={styles.statLabel} style={{ color: 'var(--primary-light)', marginBottom: 0 }}>
                                    <TrendingUp size={16} /> Más Vendido
                                </div>
                                <div className={styles.statNumber} style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>
                                    {dashboardStats.mostSoldDest?.title || 'N/A'}
                                </div>
                                <div className={styles.statSub} style={{ marginTop: '0.5rem' }}>
                                    Destino más popular
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN - Top Destinations */}
                <div className={styles.sideSection}>
                    <div className="kanto-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'white' }}>
                                <MapPin size={20} /> Top Destinos
                            </div>
                        </div>

                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {destinations.slice(0, 5).map((dest, idx) => (
                                <div key={dest.id} className={`${styles.topDestItem} ${idx === 0 ? styles.highlight : ''}`}>
                                    <div className={styles.rankBadge}>
                                        {idx + 1}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, color: 'white' }}>
                                            {dest.title}
                                        </div>
                                    </div>
                                    {dest.isPremium && (
                                        <div style={{
                                            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                                            color: '#1A1C23',
                                            padding: '0.3rem 0.6rem',
                                            borderRadius: '12px',
                                            fontSize: '0.7rem',
                                            fontWeight: 800
                                        }}>
                                            PREMIUM
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {destinations.length === 0 && (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                No hay destinos disponibles
                            </div>
                        )}
                    </div>
                </div>

            </div>

        </DashboardLayout>
    );
}
