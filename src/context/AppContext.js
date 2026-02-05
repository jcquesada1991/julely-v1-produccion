import { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_DATA } from '@/data/mockData';
import { useNotification } from './NotificationContext';

const AppContext = createContext();

export function AppProvider({ children }) {
    const [destinations, setDestinations] = useState([
        ...MOCK_DATA.destinations
    ]);
    const [sales, setSales] = useState(MOCK_DATA.sales);
    const { showNotification } = useNotification();

    // DESTINOS CRUD
    const addDestination = (newDest) => {
        const id = Math.max(...destinations.map(d => d.id), 0) + 1;
        // Si no viene imagen, se guarda vacío para que el componente muestre el icono
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

    const deleteSale = (id) => {
        setSales(sales.filter(s => s.id !== id));
        showNotification('Venta eliminada', 'info');
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

    // CLIENTES CRUD
    const [clients, setClients] = useState(MOCK_DATA.clients);

    const addClient = (newClient) => {
        const id = Math.max(...clients.map(c => c.id), 0) + 1;
        setClients([...clients, { ...newClient, id }]);
        showNotification(`Cliente "${newClient.name}" creado correctamente`);
    };

    const updateClient = (id, updatedClient) => {
        setClients(clients.map(c => c.id === id ? { ...updatedClient, id } : c));
        showNotification(`Cliente actualizado correctamente`);
    };

    const deleteClient = (id) => {
        setClients(clients.filter(c => c.id !== id));
        showNotification('Cliente eliminado', 'info');
    };

    // ITINERARIOS (PUNTOS DE INTERES) CRUD
    const [itineraries, setItineraries] = useState(MOCK_DATA.itineraries);

    const addItinerary = (newItinerary) => {
        const id = Math.max(...itineraries.map(i => i.id), 0) + 1;
        setItineraries([...itineraries, { ...newItinerary, id }]);
        showNotification(`Punto de interés creado correctamente`);
    };

    const updateItinerary = (id, updatedItinerary) => {
        setItineraries(itineraries.map(i => i.id === id ? { ...updatedItinerary, id } : i));
        showNotification(`Punto de interés actualizado correctamente`);
    };

    const deleteItinerary = (id) => {
        setItineraries(itineraries.filter(i => i.id !== id));
        showNotification('Punto de interés eliminado', 'info');
    };

    return (
        <AppContext.Provider value={{
            destinations,
            addDestination,
            updateDestination,
            deleteDestination,
            sales,
            addSale,
            deleteSale,
            getSaleDetails,
            stats,
            users,
            addUser,
            updateUser,
            deleteUser,
            clients,
            addClient,
            updateClient,
            deleteClient,
            itineraries,
            addItinerary,
            updateItinerary,
            deleteItinerary
        }}>
            {children}
        </AppContext.Provider>
    );
}

export const useApp = () => useContext(AppContext);
