import { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_DATA } from '@/data/mockData';
import { useNotification } from './NotificationContext';

const AppContext = createContext();

export function AppProvider({ children }) {
    const [destinations, setDestinations] = useState([
        ...MOCK_DATA.destinations,
        {
            id: 101,
            title: "New York",
            subtitle: "La ciudad que nunca duerme. Rascacielos, cultura y energía infinita.",
            price: 1200,
            hero_image_url: "https://images.unsplash.com/photo-1496442226666-8d4a0e62e6e9?q=80&w=2670&auto=format&fit=crop",
            description: "Explora la Gran Manzana con estilo."
        },
        {
            id: 102,
            title: "Tokyo",
            subtitle: "Neon, tradición y futuro. Una experiencia sensorial única.",
            price: 2500,
            hero_image_url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2694&auto=format&fit=crop",
            description: "Descubre la capital de Japón."
        },
        {
            id: 103,
            title: "Santorini",
            subtitle: "Vistas al mar Egeo, casas blancas y atardeceres inolvidables.",
            price: 1800,
            hero_image_url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2629&auto=format&fit=crop",
            description: "El paraíso griego te espera."
        },
        {
            id: 104,
            title: "Dubai",
            subtitle: "Lujo extremo en el desierto. Arquitectura imposible y shopping.",
            price: 3200,
            hero_image_url: "https://images.unsplash.com/photo-1512453979798-5ea904ac6605?q=80&w=2670&auto=format&fit=crop",
            description: "La joya de los Emiratos."
        },
        {
            id: 105,
            title: "Bali",
            subtitle: "Espiritualidad, arrozales y playas para el descanso perfecto.",
            price: 1500,
            hero_image_url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2638&auto=format&fit=crop",
            description: "La isla de los dioses."
        }
    ]);
    const [sales, setSales] = useState(MOCK_DATA.sales);
    const { showNotification } = useNotification();

    // DESTINOS CRUD
    const addDestination = (newDest) => {
        const id = Math.max(...destinations.map(d => d.id), 0) + 1;
        setDestinations([...destinations, { ...newDest, id }]);
        showNotification(`Destino "${newDest.title}" creado correctamente`);
    };

    const updateDestination = (id, updatedDest) => {
        setDestinations(destinations.map(d => d.id === id ? { ...updatedDest, id } : d));
        showNotification(`Destino actualizado correctamente`);
    };

    const deleteDestination = (id) => {
        setDestinations(destinations.filter(d => d.id !== id));
        showNotification('Destino eliminado', 'info');
    };

    // VENTAS CRUD
    const addSale = (newSale) => {
        const id = Math.max(...sales.map(s => s.id), 0) + 1;
        // Generar código voucher automático
        const dest = destinations.find(d => d.id === parseInt(newSale.destination_id));
        const code = `VOU-${dest ? dest.title.substring(0, 3).toUpperCase() : 'GEN'}-${String(id).padStart(3, '0')}`;

        setSales([...sales, {
            ...newSale,
            id,
            voucher_code: code,
            date: new Date().toISOString().split('T')[0],
            status: 'Confirmada'
        }]);
        showNotification('Venta registrada exitosamente');
    };

    // Helper para Voucher
    const getSaleDetails = (saleId) => {
        const sale = sales.find(s => s.id === parseInt(saleId));
        if (!sale) return null;
        const dest = destinations.find(d => d.id === parseInt(sale.destination_id));
        return { ...sale, destination: dest };
    };

    const stats = {
        totalRevenue: sales.reduce((acc, sale) => {
            const dest = destinations.find(d => d.id === parseInt(sale.destination_id));
            return acc + (dest ? dest.price : 0);
        }, 0),
        activeDestinations: destinations.length,
        totalSales: sales.length,
        uniqueClients: new Set(sales.map(s => s.client_name)).size
    };

    // USUARIOS CRUD
    const [users, setUsers] = useState(MOCK_DATA.users);

    const addUser = (newUser) => {
        const id = Math.max(...users.map(u => u.id), 0) + 1;
        setUsers([...users, { ...newUser, id }]);
        showNotification(`Usuario "${newUser.name}" creado correctamente`);
    };

    const updateUser = (id, updatedUser) => {
        setUsers(users.map(u => u.id === id ? { ...updatedUser, id } : u));
        showNotification(`Usuario actualizado correctamente`);
    };

    const deleteUser = (id) => {
        setUsers(users.filter(u => u.id !== id));
        showNotification('Usuario eliminado', 'info');
    };

    return (
        <AppContext.Provider value={{
            destinations,
            addDestination,
            updateDestination,
            deleteDestination,
            sales,
            addSale,
            getSaleDetails,
            getSaleDetails,
            stats,
            users,
            addUser,
            updateUser,
            deleteUser
        }}>
            {children}
        </AppContext.Provider>
    );
}

export const useApp = () => useContext(AppContext);
