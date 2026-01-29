import Head from 'next/head';
import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/context/AppContext';
import styles from '@/styles/DashboardV2.module.css';
import { TrendingUp, DollarSign, MapPin, Users, Package, Clock, ArrowUpRight } from 'lucide-react';
import { useState, useMemo } from 'react';

export default function Dashboard() {
    const { stats, destinations, sales } = useApp();

    // Calcular estadísticas reales
    const dashboardStats = useMemo(() => {
        const totalSales = sales.length;
        const confirmedSales = sales.filter(s => s.status === 'Confirmada').length;
        const pendingSales = sales.filter(s => s.status === 'Pendiente').length;

        // Calcular ingresos totales
        const totalRevenue = sales.reduce((acc, sale) => {
            const dest = destinations.find(d => d.id === sale.destination_id);
            return acc + (dest ? dest.price : 0);
        }, 0);

        // Destino más vendido
        const destinationSales = {};
        sales.forEach(sale => {
            destinationSales[sale.destination_id] = (destinationSales[sale.destination_id] || 0) + 1;
        });
        const mostSoldDestId = Object.keys(destinationSales).reduce((a, b) =>
            destinationSales[a] > destinationSales[b] ? a : b, Object.keys(destinationSales)[0]
        );
        const mostSoldDest = destinations.find(d => d.id === parseInt(mostSoldDestId));

        // Clientes únicos
        const uniqueClients = new Set(sales.map(s => s.client_name)).size;

        return {
            totalSales,
            confirmedSales,
            pendingSales,
            totalRevenue,
            mostSoldDest,
            uniqueClients,
            totalDestinations: destinations.length,
            conversionRate: totalSales > 0 ? ((confirmedSales / totalSales) * 100).toFixed(1) : 0
        };
    }, [sales, destinations]);

    return (
        <DashboardLayout title="Dashboard">
            <Head>
                <title>Dashboard | TravelAgendy</title>
            </Head>

            {/* Page Header Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                <div>
                    <div style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '0.25rem', fontWeight: 500 }}>
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
                        <div className="kanto-card" style={{
                            background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
                            color: 'white'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.9rem' }}>
                                    <DollarSign size={18} /> Ingresos Totales
                                </div>
                                <button className="btn-icon" style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.2)', color: 'white' }}>
                                    <ArrowUpRight size={16} />
                                </button>
                            </div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                                ${dashboardStats.totalRevenue.toLocaleString()}
                            </div>
                            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                                De {dashboardStats.totalSales} ventas registradas
                            </div>
                        </div>

                        {/* Total Sales Card */}
                        <div className="kanto-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>
                                    <Package size={18} /> Ventas Totales
                                </div>
                                <span style={{ color: '#10B981', fontWeight: 700, fontSize: '0.9rem' }}>
                                    {dashboardStats.conversionRate}% conversión
                                </span>
                            </div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0F172A' }}>
                                {dashboardStats.totalSales}
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#64748B' }}>
                                <span style={{ color: '#10B981' }}>✓ {dashboardStats.confirmedSales} Confirmadas</span>
                                <span style={{ color: '#F59E0B' }}>⏳ {dashboardStats.pendingSales} Pendientes</span>
                            </div>
                        </div>

                    </div>

                    {/* Stats Row */}
                    <div className={styles.statsRow}>
                        <div className={styles.statCard}>
                            <div>
                                <div className={styles.statLabel}><Users size={16} /> Clientes</div>
                                <div className={styles.statNumber}>{dashboardStats.uniqueClients}</div>
                                <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.5rem' }}>
                                    Clientes únicos registrados
                                </div>
                            </div>
                        </div>

                        <div className={styles.statCard}>
                            <div>
                                <div className={styles.statLabel}><MapPin size={16} /> Destinos</div>
                                <div className={styles.statNumber}>{dashboardStats.totalDestinations}</div>
                                <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.5rem' }}>
                                    Destinos disponibles
                                </div>
                            </div>
                        </div>

                        <div className={styles.statCard} style={{
                            background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
                            border: '1px solid #FDE68A'
                        }}>
                            <div>
                                <div className={styles.statLabel} style={{ color: '#92400E' }}>
                                    <TrendingUp size={16} /> Más Vendido
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#92400E', marginTop: '0.5rem' }}>
                                    {dashboardStats.mostSoldDest?.title || 'N/A'}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#78350F', marginTop: '0.5rem' }}>
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#0F172A' }}>
                                <MapPin size={20} /> Top Destinos
                            </div>
                        </div>

                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {destinations.slice(0, 5).map((dest, idx) => (
                                <div key={dest.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '1rem',
                                    background: idx === 0 ? 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)' : '#F8FAFC',
                                    borderRadius: '16px',
                                    border: idx === 0 ? '1px solid #BBF7D0' : '1px solid #E2E8F0',
                                    transition: 'all 0.3s ease'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateX(4px)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateX(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <div style={{
                                        minWidth: '48px',
                                        height: '48px',
                                        borderRadius: '12px',
                                        background: idx === 0 ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : '#E2E8F0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: idx === 0 ? 'white' : '#64748B',
                                        fontWeight: 800,
                                        fontSize: '1.2rem'
                                    }}>
                                        {idx + 1}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>
                                            {dest.title}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
                                            {dest.currency} ${dest.price.toLocaleString()}
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
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>
                                No hay destinos disponibles
                            </div>
                        )}
                    </div>
                </div>

            </div>

        </DashboardLayout>
    );
}
