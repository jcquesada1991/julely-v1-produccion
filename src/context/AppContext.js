import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useNotification } from './NotificationContext';

const AppContext = createContext();

export function AppProvider({ children }) {
    const { showNotification } = useNotification();

    // ─── STATE ────────────────────────────────────────────────────────
    const [destinations, setDestinations] = useState([]);
    const [sales, setSales] = useState([]);
    const [users, setUsers] = useState([]);
    const [clients, setClients] = useState([]);
    const [itineraries, setItineraries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // ─── LOAD ALL DATA (on mount) ─────────────────────────────────────
    const loadAll = useCallback(async () => {
        setIsLoading(true);
        try {
            const [
                { data: destData },
                { data: salesData },
                { data: usersData },
                { data: clientsData },
                { data: activData },
            ] = await Promise.all([
                supabase.from('destinations').select('*').order('created_at', { ascending: false }),
                supabase.from('bookings').select('*').order('created_at', { ascending: false }),
                supabase.from('profiles').select('*').order('created_at', { ascending: false }),
                supabase.from('clients').select('*').order('created_at', { ascending: false }),
                supabase.from('activities').select('*').order('created_at', { ascending: false }),
            ]);

            // Normalize destinations: map is_premium -> isPremium for UI compat
            setDestinations((destData || []).map(d => ({
                ...d,
                isPremium: d.is_premium,
                isFavorite: false,
            })));

            // Normalize bookings: map booking_date -> date, assigned_to -> created_by for UI compat
            setSales((salesData || []).map(s => ({
                ...s,
                date: s.booking_date || s.created_at,
                created_by: s.assigned_to,
                status: s.status === 'confirmada' ? 'Confirmada'
                    : s.status === 'pendiente' ? 'Pendiente'
                        : s.status === 'cancelada' ? 'Cancelada'
                            : 'Completada',
            })));

            // Normalize profiles: map full_name -> name for UI compat
            setUsers((usersData || []).map(u => ({
                ...u,
                name: u.full_name ? u.full_name.split(' ')[0] : '',
                surname: u.full_name ? u.full_name.split(' ').slice(1).join(' ') : '',
                role: {
                    admin: 'Administrador',
                    asesor: 'Asesor de Ventas',
                    supervisor: 'Supervisor',
                    contabilidad: 'Contabilidad',
                    operaciones: 'Operaciones',
                }[u.role] || u.role,
            })));

            // Normalize clients: map passport_number -> passport
            setClients((clientsData || []).map(c => ({ ...c })));

            // Normalize activities: map image_url -> image
            setItineraries((activData || []).map(a => ({
                ...a,
                image: a.image_url,
            })));
        } catch (err) {
            console.error('Error loading data:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAll();
    }, [loadAll]);

    // ════════════════════════════════════════════════════════════════
    // DESTINOS CRUD
    // ════════════════════════════════════════════════════════════════
    const addDestination = async (newDest) => {
        const { data, error } = await supabase
            .from('destinations')
            .insert([{
                title: newDest.title,
                subtitle: newDest.subtitle,
                description_long: newDest.description_long || newDest.description,
                category: newDest.category || 'Economy',
                airport_code: newDest.airport_code,
                currency: newDest.currency || 'USD',
                price_adult: parseFloat(newDest.price) || 0,
                hero_image_url: newDest.hero_image_url || newDest.imageUrl || '',
                is_premium: newDest.isPremium || false,
                is_active: true,
            }])
            .select()
            .single();

        if (error) {
            showNotification('Error al crear destino', 'error');
            console.error(error);
            return;
        }
        setDestinations(prev => [{ ...data, isPremium: data.is_premium, isFavorite: false }, ...prev]);
        showNotification(`Destino "${data.title}" creado correctamente`);
    };

    const updateDestination = async (id, updatedDest) => {
        const { data, error } = await supabase
            .from('destinations')
            .update({
                title: updatedDest.title,
                subtitle: updatedDest.subtitle,
                description_long: updatedDest.description_long || updatedDest.description,
                category: updatedDest.category || 'Economy',
                airport_code: updatedDest.airport_code,
                price_adult: parseFloat(updatedDest.price) || 0,
                hero_image_url: updatedDest.hero_image_url || updatedDest.imageUrl || '',
                is_premium: updatedDest.isPremium || false,
            })
            .eq('id', id)
            .select()
            .single();

        if (error) { showNotification('Error al actualizar destino', 'error'); return; }
        setDestinations(prev => prev.map(d => d.id === id
            ? { ...data, isPremium: data.is_premium, isFavorite: false }
            : d));
        showNotification('Destino actualizado correctamente');
    };

    const deleteDestination = async (id) => {
        const { error } = await supabase.from('destinations').delete().eq('id', id);
        if (error) { showNotification('Error al eliminar destino', 'error'); return; }
        setDestinations(prev => prev.filter(d => d.id !== id));
        showNotification('Destino eliminado', 'info');
    };

    // ════════════════════════════════════════════════════════════════
    // VENTAS / BOOKINGS CRUD
    // ════════════════════════════════════════════════════════════════
    const addSale = async (newSale) => {
        // Generar voucher code
        const dest = destinations.find(d => String(d.id) === String(newSale.destination_id));
        const prefix = dest ? dest.title.substring(0, 3).toUpperCase() : 'GEN';
        const timestamp = Date.now().toString().slice(-3);
        const voucherCode = `VOU-${prefix}-${timestamp}`;
        const today = new Date().toISOString().split('T')[0];

        const { data, error } = await supabase
            .from('bookings')
            .insert([{
                voucher_code: voucherCode,
                destination_id: newSale.destination_id || null,
                client_id: newSale.client_id || null,
                assigned_to: newSale.created_by || null,
                client_name: newSale.client_name,
                num_adults: newSale.num_adults || 1,
                num_children: newSale.num_children || 0,
                total_amount: parseFloat(newSale.total_amount) || 0,
                amount_paid: parseFloat(newSale.amount_paid) || 0,
                currency: newSale.currency || 'USD',
                travel_date: newSale.travel_date || null,
                return_date: newSale.return_date || null,
                booking_date: newSale.booking_date || today,  // NOT NULL
                emission_date: today,                          // NOT NULL
                status: 'confirmada',
                hotel_info: newSale.hotel_info || {},
                custom_itinerary: newSale.custom_itinerary || [],
                custom_includes: newSale.custom_includes || [],
                prepared_by: newSale.prepared_by || null,
            }])
            .select()
            .single();

        if (error) { showNotification('Error al registrar venta', 'error'); console.error(error); return; }
        setSales(prev => [{
            ...data,
            date: data.booking_date || data.created_at,
            created_by: data.assigned_to,
            status: 'Confirmada',
        }, ...prev]);
        showNotification('Venta registrada exitosamente');
    };

    const deleteSale = async (id) => {
        const { error } = await supabase.from('bookings').delete().eq('id', id);
        if (error) { showNotification('Error al eliminar venta', 'error'); return; }
        setSales(prev => prev.filter(s => s.id !== id));
        showNotification('Venta eliminada', 'info');
    };

    const getSaleDetails = (saleId) => {
        const sale = sales.find(s => String(s.id) === String(saleId));
        if (!sale) return null;
        const dest = destinations.find(d => String(d.id) === String(sale.destination_id));
        return { ...sale, destination: dest };
    };

    // ════════════════════════════════════════════════════════════════
    // USUARIOS / PROFILES CRUD
    // ════════════════════════════════════════════════════════════════
    const addUser = async (newUser) => {
        // Crear usuario en Supabase Auth (requiere Admin key — lo hacemos con invitación)
        // Por ahora creamos solo el registro en profiles si el auth user ya existe
        // La forma correcta es invitar al usuario desde el dashboard o usar la Admin API
        const roleKey = {
            'Administrador': 'admin',
            'Asesor de Ventas': 'asesor',
            'Supervisor': 'supervisor',
            'Contabilidad': 'contabilidad',
            'Operaciones': 'operaciones',
        }[newUser.role] || 'asesor';

        // Usar supabase.auth.admin.inviteUserByEmail (solo funciona con service_role key en server)
        // Temporalmente mostramos instrucción al usuario
        showNotification(`Para crear usuario "${newUser.name}", invítalo desde Supabase Dashboard → Authentication → Users`, 'info');
    };

    const updateUser = async (id, updatedUser) => {
        const roleKey = {
            'Administrador': 'admin',
            'Asesor de Ventas': 'asesor',
            'Supervisor': 'supervisor',
            'Contabilidad': 'contabilidad',
            'Operaciones': 'operaciones',
        }[updatedUser.role] || updatedUser.role;

        const { data, error } = await supabase
            .from('profiles')
            .update({
                full_name: `${updatedUser.name} ${updatedUser.surname || ''}`.trim(),
                role: roleKey,
                is_active: updatedUser.is_active !== false,
            })
            .eq('id', id)
            .select()
            .single();

        if (error) { showNotification('Error al actualizar usuario', 'error'); return; }
        setUsers(prev => prev.map(u => u.id === id ? {
            ...data,
            name: data.full_name ? data.full_name.split(' ')[0] : '',
            surname: data.full_name ? data.full_name.split(' ').slice(1).join(' ') : '',
            role: updatedUser.role,
        } : u));
        showNotification('Usuario actualizado correctamente');
    };

    const deleteUser = async (id) => {
        // Solo elimina el perfil — la cuenta Auth persiste (solo admin API puede eliminar auth users)
        const { error } = await supabase.from('profiles').delete().eq('id', id);
        if (error) { showNotification('Error al eliminar usuario', 'error'); return; }
        setUsers(prev => prev.filter(u => u.id !== id));
        showNotification('Usuario eliminado', 'info');
    };

    // ════════════════════════════════════════════════════════════════
    // CLIENTES CRUD
    // ════════════════════════════════════════════════════════════════
    const addClient = async (newClient) => {
        const { data, error } = await supabase
            .from('clients')
            .insert([{
                name: newClient.name,
                surname: newClient.surname,
                phone: newClient.phone,
                email: newClient.email,
                address: newClient.address,
                notes: newClient.notes,
                booking_date: newClient.booking_date || null,
            }])
            .select()
            .single();

        if (error) { showNotification('Error al crear cliente', 'error'); console.error(error); return; }

        // Si hay datos de identidad (pasaporte), los guardamos en client_identity
        if (newClient.passport || newClient.birthdate || newClient.nationality) {
            await supabase.from('client_identity').insert([{
                client_id: data.id,
                passport_number: newClient.passport || null,
                birthdate: newClient.birthdate || null,
                nationality: newClient.nationality || null,
            }]);
        }

        setClients(prev => [{ ...data, passport: newClient.passport, nationality: newClient.nationality, birthdate: newClient.birthdate }, ...prev]);
        showNotification(`Cliente "${data.name}" creado correctamente`);
    };

    const updateClient = async (id, updatedClient) => {
        const { data, error } = await supabase
            .from('clients')
            .update({
                name: updatedClient.name,
                surname: updatedClient.surname,
                phone: updatedClient.phone,
                email: updatedClient.email,
                address: updatedClient.address,
                notes: updatedClient.notes,
                booking_date: updatedClient.booking_date || null,
            })
            .eq('id', id)
            .select()
            .single();

        if (error) { showNotification('Error al actualizar cliente', 'error'); return; }

        // Upsert datos de identidad
        if (updatedClient.passport || updatedClient.birthdate || updatedClient.nationality) {
            await supabase.from('client_identity').upsert([{
                client_id: id,
                passport_number: updatedClient.passport || null,
                birthdate: updatedClient.birthdate || null,
                nationality: updatedClient.nationality || null,
            }], { onConflict: 'client_id' });
        }

        setClients(prev => prev.map(c => c.id === id ? {
            ...data,
            passport: updatedClient.passport,
            nationality: updatedClient.nationality,
            birthdate: updatedClient.birthdate,
        } : c));
        showNotification('Cliente actualizado correctamente');
    };

    const deleteClient = async (id) => {
        const { error } = await supabase.from('clients').delete().eq('id', id);
        if (error) { showNotification('Error al eliminar cliente', 'error'); return; }
        setClients(prev => prev.filter(c => c.id !== id));
        showNotification('Cliente eliminado', 'info');
    };

    // ════════════════════════════════════════════════════════════════
    // ITINERARIOS / ACTIVIDADES CRUD
    // ════════════════════════════════════════════════════════════════
    const addItinerary = async (newItinerary) => {
        const { data, error } = await supabase
            .from('activities')
            .insert([{
                destination_id: newItinerary.destination_id || null,
                name: newItinerary.name,
                description: newItinerary.description,
                price: parseFloat(newItinerary.price) || 0,
                image_url: newItinerary.image || '',
                is_active: true,
            }])
            .select()
            .single();

        if (error) { showNotification('Error al crear excursión', 'error'); console.error(error); return; }
        setItineraries(prev => [{ ...data, image: data.image_url }, ...prev]);
        showNotification('Excursión creada correctamente');
    };

    const updateItinerary = async (id, updatedItinerary) => {
        const { data, error } = await supabase
            .from('activities')
            .update({
                destination_id: updatedItinerary.destination_id || null,
                name: updatedItinerary.name,
                description: updatedItinerary.description,
                price: parseFloat(updatedItinerary.price) || 0,
                image_url: updatedItinerary.image || '',
            })
            .eq('id', id)
            .select()
            .single();

        if (error) { showNotification('Error al actualizar excursión', 'error'); return; }
        setItineraries(prev => prev.map(i => i.id === id ? { ...data, image: data.image_url } : i));
        showNotification('Excursión actualizada correctamente');
    };

    const deleteItinerary = async (id) => {
        const { error } = await supabase.from('activities').delete().eq('id', id);
        if (error) { showNotification('Error al eliminar excursión', 'error'); return; }
        setItineraries(prev => prev.filter(i => i.id !== id));
        showNotification('Excursión eliminada', 'info');
    };

    // ─── STATS (calculados del estado en memoria) ─────────────────
    const stats = {
        totalRevenue: sales.reduce((acc, s) => acc + (parseFloat(s.total_amount) || 0), 0),
        activeDestinations: destinations.filter(d => d.is_active).length,
        totalSales: sales.length,
        uniqueClients: new Set(sales.map(s => s.client_name)).size,
    };

    return (
        <AppContext.Provider value={{
            // Estado
            destinations,
            sales,
            users,
            clients,
            itineraries,
            isLoading,
            stats,
            // Destinos
            addDestination,
            updateDestination,
            deleteDestination,
            // Ventas
            addSale,
            deleteSale,
            getSaleDetails,
            // Usuarios
            addUser,
            updateUser,
            deleteUser,
            // Clientes
            addClient,
            updateClient,
            deleteClient,
            // Itinerarios/Actividades
            addItinerary,
            updateItinerary,
            deleteItinerary,
            // Utilidades
            refetch: loadAll,
        }}>
            {children}
        </AppContext.Provider>
    );
}

export const useApp = () => useContext(AppContext);
