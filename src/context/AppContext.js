import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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

    // Ref para las imágenes de destinos (para que el realtime las use)
    const destImagesRef = useRef({});

    // ─── HELPERS DE NORMALIZACIÓN ─────────────────────────────────────
    const normalizeBooking = useCallback((s) => ({
        ...s,
        date: s.booking_date || s.created_at,
        created_by: s.assigned_to,
        status: s.status === 'confirmada' ? 'Confirmada'
            : s.status === 'pendiente' ? 'Pendiente'
                : s.status === 'cancelada' ? 'Cancelada'
                    : 'Completada',
    }), []);

    const normalizeProfile = useCallback((u) => ({
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
    }), []);

    const normalizeDestination = useCallback((d) => ({
        ...d,
        isPremium: d.is_premium,
        isFavorite: false,
        images: destImagesRef.current[d.id] || [],
    }), []);

    // ─── LOAD ALL DATA (on mount) ─────────────────────────────────────
    const loadAll = useCallback(async () => {
        setIsLoading(true);
        try {
            const [
                { data: destData, error: destErr },
                { data: salesData, error: salesErr },
                { data: usersData, error: usersErr },
                { data: clientsData, error: clientsErr },
                { data: activData, error: activErr },
                { data: destImgData, error: destImgErr },
            ] = await Promise.all([
                supabase.from('destinations').select('*').order('created_at', { ascending: false }),
                supabase.from('bookings').select('*').order('created_at', { ascending: false }),
                supabase.from('profiles').select('*').order('created_at', { ascending: false }),
                // JOIN con client_identity para traer pasaporte, birthdate y nationality
                supabase.from('clients').select('*, client_identity(passport_number, birthdate, nationality)').order('created_at', { ascending: false }),
                supabase.from('activities').select('*').order('created_at', { ascending: false }),
                supabase.from('destination_images').select('*').order('display_order', { ascending: true }),
            ]);

            if (destErr) console.error('Error cargando destinos:', destErr);
            if (salesErr) console.error('Error cargando ventas:', salesErr);
            if (usersErr) console.error('Error cargando usuarios:', usersErr);
            if (clientsErr) console.error('Error cargando clientes:', clientsErr);
            if (activErr) console.error('Error cargando actividades:', activErr);
            if (destImgErr) console.error('Error cargando imágenes de destinos:', destImgErr);

            // Agrupar imágenes por destination_id
            const imagesByDest = {};
            (destImgData || []).forEach(img => {
                if (!imagesByDest[img.destination_id]) imagesByDest[img.destination_id] = [];
                imagesByDest[img.destination_id].push(img);
            });
            destImagesRef.current = imagesByDest;

            // Normalize destinations (include gallery images)
            setDestinations((destData || []).map(d => ({
                ...d,
                isPremium: d.is_premium,
                isFavorite: false,
                images: imagesByDest[d.id] || [],
            })));


            // Normalize bookings
            setSales((salesData || []).map(normalizeBooking));

            // Normalize profiles
            setUsers((usersData || []).map(normalizeProfile));

            // Normalize clients — aplanar client_identity al nivel raíz
            setClients((clientsData || []).map(c => {
                const identity = Array.isArray(c.client_identity) ? c.client_identity[0] : c.client_identity;
                return {
                    ...c,
                    passport: identity?.passport_number || c.passport || '',
                    birthdate: identity?.birthdate || c.birthdate || '',
                    nationality: identity?.nationality || c.nationality || '',
                };
            }));

            // Normalize activities
            setItineraries((activData || []).map(a => ({
                ...a,
                image: a.image_url,
            })));
        } catch (err) {
            console.error('Error loading data:', err);
        } finally {
            setIsLoading(false);
        }
    }, [normalizeBooking, normalizeProfile]);

    useEffect(() => {
        loadAll();
    }, [loadAll]);

    // ─── SUPABASE REALTIME SUBSCRIPTIONS ─────────────────────────────
    useEffect(() => {
        // Suscripción a bookings (ventas)
        const bookingsChannel = supabase
            .channel('realtime-bookings')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bookings' }, (payload) => {
                setSales(prev => {
                    if (prev.find(s => s.id === payload.new.id)) return prev;
                    return [normalizeBooking(payload.new), ...prev];
                });
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'bookings' }, (payload) => {
                setSales(prev => prev.map(s => s.id === payload.new.id ? normalizeBooking(payload.new) : s));
            })
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'bookings' }, (payload) => {
                setSales(prev => prev.filter(s => s.id !== payload.old.id));
            })
            .subscribe();

        // Suscripción a destinations
        const destinationsChannel = supabase
            .channel('realtime-destinations')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'destinations' }, (payload) => {
                setDestinations(prev => {
                    if (prev.find(d => d.id === payload.new.id)) return prev;
                    return [normalizeDestination(payload.new), ...prev];
                });
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'destinations' }, (payload) => {
                setDestinations(prev => prev.map(d => d.id === payload.new.id
                    ? { ...normalizeDestination(payload.new), images: d.images || [] }
                    : d));
            })
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'destinations' }, (payload) => {
                setDestinations(prev => prev.filter(d => d.id !== payload.old.id));
            })
            .subscribe();

        // Suscripción a clients
        const clientsChannel = supabase
            .channel('realtime-clients')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'clients' }, (payload) => {
                setClients(prev => {
                    if (prev.find(c => c.id === payload.new.id)) return prev;
                    return [{ ...payload.new, passport: '', birthdate: '', nationality: '' }, ...prev];
                });
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'clients' }, (payload) => {
                setClients(prev => prev.map(c => c.id === payload.new.id
                    ? { ...payload.new, passport: c.passport || '', birthdate: c.birthdate || '', nationality: c.nationality || '' }
                    : c));
            })
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'clients' }, (payload) => {
                setClients(prev => prev.filter(c => c.id !== payload.old.id));
            })
            .subscribe();

        // Suscripción a activities (excursiones/itinerarios)
        const activitiesChannel = supabase
            .channel('realtime-activities')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activities' }, (payload) => {
                setItineraries(prev => {
                    if (prev.find(i => i.id === payload.new.id)) return prev;
                    return [{ ...payload.new, image: payload.new.image_url }, ...prev];
                });
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'activities' }, (payload) => {
                setItineraries(prev => prev.map(i => i.id === payload.new.id
                    ? { ...payload.new, image: payload.new.image_url }
                    : i));
            })
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'activities' }, (payload) => {
                setItineraries(prev => prev.filter(i => i.id !== payload.old.id));
            })
            .subscribe();

        // Suscripción a profiles (usuarios)
        const profilesChannel = supabase
            .channel('realtime-profiles')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'profiles' }, (payload) => {
                setUsers(prev => {
                    if (prev.find(u => u.id === payload.new.id)) return prev;
                    return [normalizeProfile(payload.new), ...prev];
                });
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, (payload) => {
                setUsers(prev => prev.map(u => u.id === payload.new.id ? normalizeProfile(payload.new) : u));
            })
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'profiles' }, (payload) => {
                setUsers(prev => prev.filter(u => u.id !== payload.old.id));
            })
            .subscribe();

        // Cleanup al desmontar
        return () => {
            supabase.removeChannel(bookingsChannel);
            supabase.removeChannel(destinationsChannel);
            supabase.removeChannel(clientsChannel);
            supabase.removeChannel(activitiesChannel);
            supabase.removeChannel(profilesChannel);
        };
    }, [normalizeBooking, normalizeProfile, normalizeDestination]);

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

        if (error) { showNotification('Error al crear destino', 'error'); console.error(error); return; }
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
        try {
            // 1. Eliminar excursiones (actividades) asociadas
            const { error: activError } = await supabase
                .from('activities')
                .delete()
                .eq('destination_id', id);

            if (activError) {
                console.error('Error al eliminar excursiones del destino:', activError);
            }

            // 2. Eliminar imágenes de galería asociadas
            await supabase
                .from('destination_images')
                .delete()
                .eq('destination_id', id);

            // 3. Finalmente eliminar el destino
            const { data, error } = await supabase.from('destinations').delete().eq('id', id).select();

            if (error) {
                console.error('Error al eliminar destino:', error);
                showNotification(
                    error.code === '23503'
                        ? 'No se puede eliminar: hay ventas vinculadas a este destino'
                        : 'Error al eliminar destino: ' + (error.message || 'Intenta de nuevo'),
                    'error'
                );
                return;
            }

            if (!data || data.length === 0) {
                showNotification('No se pudo eliminar el destino (Verifique permisos)', 'error');
                return;
            }

            // Actualizar estado local
            setDestinations(prev => prev.filter(d => d.id !== id));
            setItineraries(prev => prev.filter(i => String(i.destination_id) !== String(id)));

            showNotification('Destino y sus excursiones eliminados', 'info');
        } catch (err) {
            console.error('Error en el proceso de eliminación:', err);
            showNotification('Error inesperado al eliminar el destino', 'error');
        }
    };

    // ════════════════════════════════════════════════════════════════
    // VENTAS / BOOKINGS CRUD
    // ════════════════════════════════════════════════════════════════
    const addSale = async (newSale) => {
        const dest = destinations.find(d => String(d.id) === String(newSale.destination_id));
        const prefix = dest ? dest.title.substring(0, 3).toUpperCase() : 'GEN';
        const timestamp = Date.now().toString().slice(-3);
        const voucherCode = `VOU-${prefix}-${timestamp}`;
        const today = new Date().toISOString().split('T')[0];

        const { data: { user } } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from('bookings')
            .insert([{
                voucher_code: voucherCode,
                destination_id: newSale.destination_id || null,
                destination_name: dest ? dest.title : 'Desconocido',
                client_id: newSale.client_id || null,
                assigned_to: user?.id || null,
                client_name: newSale.client_name,
                num_adults: newSale.num_adults || 1,
                num_children: newSale.num_children || 0,
                total_amount: parseFloat(newSale.total_amount) || 0,
                amount_paid: parseFloat(newSale.amount_paid) || 0,
                currency: newSale.currency || 'USD',
                travel_date: newSale.travel_date || null,
                return_date: newSale.return_date || null,
                booking_date: newSale.booking_date || today,
                emission_date: today,
                status: 'confirmada',
                hotel_info: {
                    ...(newSale.hotel_info || {}),
                    show_price_on_voucher: newSale.show_price_on_voucher ?? true
                },
                custom_itinerary: newSale.custom_itinerary || [],
                custom_includes: newSale.custom_includes || [],
                prepared_by: newSale.prepared_by || null,
            }])
            .select()
            .single();

        if (error) { showNotification('Error al registrar venta', 'error'); console.error(error); return; }
        setSales(prev => [normalizeBooking(data), ...prev]);
        showNotification('Venta registrada exitosamente');
    };

    const updateSale = async (id, updatedFields) => {
        const { data, error } = await supabase
            .from('bookings')
            .update(updatedFields)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error al actualizar venta:', error);
            showNotification('Error al actualizar venta: ' + (error.message || 'Intenta de nuevo'), 'error');
            return null;
        }

        setSales(prev => prev.map(s => s.id === id ? normalizeBooking({ ...s, ...data }) : s));
        showNotification('Voucher guardado correctamente');
        return data;
    };

    const deleteSale = async (id) => {
        const { data, error } = await supabase.from('bookings').delete().eq('id', id).select();
        if (error) {
            console.error('Error al eliminar venta:', error);
            showNotification('Error al eliminar venta: ' + (error.message || 'Intenta de nuevo'), 'error');
            return;
        }
        if (!data || data.length === 0) {
            showNotification('No se pudo eliminar la venta (Verifique permisos)', 'error');
            return;
        }
        setSales(prev => prev.filter(s => s.id !== id));
        showNotification('Venta eliminada', 'info');
    };

    const getSaleDetails = (saleId) => {
        const sale = sales.find(s => String(s.id) === String(saleId));
        if (!sale) return null;

        const dest = destinations.find(d => String(d.id) === String(sale.destination_id));

        let finalDest = dest;
        if (!dest) {
            finalDest = {
                title: sale.destination_name ? `${sale.destination_name} (Eliminado)` : 'Destino Desconocido',
                hero_image_url: '', // Will fallback to the default image in the UI
                includes: []
            };
        }

        return { ...sale, destination: finalDest };
    };

    // ════════════════════════════════════════════════════════════════
    // USUARIOS / PROFILES CRUD
    // ════════════════════════════════════════════════════════════════
    const addUser = async (newUser) => {
        const roleKey = {
            'Administrador': 'admin',
            'Asesor de Ventas': 'asesor',
            'Supervisor': 'supervisor',
            'Contabilidad': 'contabilidad',
            'Operaciones': 'operaciones',
        }[newUser.role] || 'asesor';

        try {
            // Obtener el access token de la sesión actual
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.access_token) {
                throw new Error('No hay sesión activa. Por favor inicia sesión de nuevo.');
            }

            const { data, error } = await supabase.functions.invoke('create-user', {
                body: {
                    email: newUser.email,
                    password: newUser.password || 'Julely2024!',
                    full_name: `${newUser.name} ${newUser.surname || ''}`.trim(),
                    role: roleKey,
                },
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                },
            });


            if (error) throw error;
            if (data?.error) throw new Error(data.error);

            // Recargar lista de usuarios
            const { data: profilesData } = await supabase
                .from('profiles').select('*').order('created_at', { ascending: false });

            setUsers((profilesData || []).map(normalizeProfile));

            showNotification(`Usuario "${newUser.name}" creado correctamente`);
        } catch (err) {
            console.error('Error creando usuario:', err);
            showNotification(`Error al crear usuario: ${err.message || 'Intenta de nuevo'}`, 'error');
        }
    };

    const updateUser = async (id, updatedUser) => {
        const roleKey = {
            'Administrador': 'admin', 'Asesor de Ventas': 'asesor',
            'Supervisor': 'supervisor', 'Contabilidad': 'contabilidad', 'Operaciones': 'operaciones',
        }[updatedUser.role] || updatedUser.role;

        const { data, error } = await supabase
            .from('profiles')
            .update({
                full_name: `${updatedUser.name} ${updatedUser.surname || ''}`.trim(),
                role: roleKey,
                is_active: updatedUser.is_active !== false,
            })
            .eq('id', id).select().single();

        if (error) { showNotification('Error al actualizar usuario', 'error'); return; }
        setUsers(prev => prev.map(u => u.id === id ? normalizeProfile(data) : u));
        showNotification('Usuario actualizado correctamente');
    };

    const deleteUser = async (id) => {
        // Nota: Esto solo elimina el perfil, el usuario en auth.users requiere permisos de Admin API.
        const { data, error } = await supabase.from('profiles').delete().eq('id', id).select();
        if (error) {
            console.error('Error al eliminar usuario:', error);
            showNotification(
                error.code === '23503'
                    ? 'No se puede eliminar: el usuario tiene registros vinculados'
                    : 'Error al eliminar usuario: ' + (error.message || 'Intenta de nuevo'),
                'error'
            );
            return;
        }
        if (!data || data.length === 0) {
            showNotification('No se pudo eliminar el usuario (Verifique permisos)', 'error');
            return;
        }
        setUsers(prev => prev.filter(u => u.id !== id));
        showNotification('Usuario eliminado', 'info');
    };

    // ════════════════════════════════════════════════════════════════
    // CLIENTES CRUD
    // ════════════════════════════════════════════════════════════════
    const addClient = async (newClient) => {
        const { data: { user } } = await supabase.auth.getUser();

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
                created_by: user?.id || null,
            }])
            .select().single();

        if (error) { showNotification('Error al crear cliente', 'error'); console.error(error); return; }

        if (newClient.passport || newClient.birthdate || newClient.nationality) {
            await supabase.from('client_identity').insert([{
                client_id: data.id,
                passport_number: newClient.passport || null,
                birthdate: newClient.birthdate || null,
                nationality: newClient.nationality || null,
            }]);
        }

        setClients(prev => [{
            ...data,
            passport: newClient.passport || '',
            nationality: newClient.nationality || '',
            birthdate: newClient.birthdate || '',
        }, ...prev]);
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
            .eq('id', id).select().single();

        if (error) { showNotification('Error al actualizar cliente', 'error'); return; }

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
            passport: updatedClient.passport || '',
            nationality: updatedClient.nationality || '',
            birthdate: updatedClient.birthdate || '',
        } : c));
        showNotification('Cliente actualizado correctamente');
    };

    const deleteClient = async (id) => {
        const { data, error } = await supabase.from('clients').delete().eq('id', id).select();
        if (error) {
            console.error('Error al eliminar cliente:', error);
            showNotification(
                error.code === '23503'
                    ? 'No se puede eliminar: el cliente tiene ventas vinculadas'
                    : 'Error al eliminar cliente: ' + (error.message || 'Intenta de nuevo'),
                'error'
            );
            return;
        }
        if (!data || data.length === 0) {
            showNotification('No se pudo eliminar el cliente (Verifique permisos)', 'error');
            return;
        }
        setClients(prev => prev.filter(c => c.id !== id));
        showNotification('Cliente eliminado', 'info');
    };

    // ════════════════════════════════════════════════════════════════
    // ITINERARIOS / ACTIVIDADES CRUD
    // ════════════════════════════════════════════════════════════════
    const addItinerary = async (newItinerary) => {
        const dest = destinations.find(d => String(d.id) === String(newItinerary.destination_id));
        const { data, error } = await supabase
            .from('activities')
            .insert([{
                destination_id: newItinerary.destination_id || null,
                destination_name: dest ? dest.title : 'Desconocido',
                name: newItinerary.name,
                description: newItinerary.description,
                price_adult: parseFloat(newItinerary.price_adult) || 0,
                price_child: parseFloat(newItinerary.price_child) || 0,
                image_url: newItinerary.image || '',
                is_active: true,
            }])
            .select().single();

        if (error) { showNotification('Error al crear excursión', 'error'); console.error(error); return; }
        setItineraries(prev => [{ ...data, image: data.image_url }, ...prev]);
        showNotification('Excursión creada correctamente');
    };

    const updateItinerary = async (id, updatedItinerary) => {
        const dest = destinations.find(d => String(d.id) === String(updatedItinerary.destination_id));
        const { data, error } = await supabase
            .from('activities')
            .update({
                destination_id: updatedItinerary.destination_id || null,
                destination_name: dest ? dest.title : 'Desconocido',
                name: updatedItinerary.name,
                description: updatedItinerary.description,
                price_adult: parseFloat(updatedItinerary.price_adult) || 0,
                price_child: parseFloat(updatedItinerary.price_child) || 0,
                image_url: updatedItinerary.image || '',
            })
            .eq('id', id).select().single();

        if (error) { showNotification('Error al actualizar excursión', 'error'); return; }
        setItineraries(prev => prev.map(i => i.id === id ? { ...data, image: data.image_url } : i));
        showNotification('Excursión actualizada correctamente');
    };

    const deleteItinerary = async (id) => {
        const { data, error } = await supabase.from('activities').delete().eq('id', id).select();
        if (error) {
            console.error('Error al eliminar excursión:', error);
            showNotification('Error al eliminar excursión: ' + (error.message || 'Intenta de nuevo'), 'error');
            return;
        }
        if (!data || data.length === 0) {
            showNotification('No se pudo eliminar la excursión (Verifique permisos)', 'error');
            return;
        }
        setItineraries(prev => prev.filter(i => i.id !== id));
        showNotification('Excursión eliminada', 'info');
    };

    // ════════════════════════════════════════════════════════════════
    // IMÁGENES DE DESTINOS
    // ════════════════════════════════════════════════════════════════
    const addDestinationImages = async (destinationId, urls) => {
        // urls: array de strings URL
        if (!urls || urls.length === 0) return [];
        const rows = urls.map((url, idx) => ({
            destination_id: destinationId,
            url,
            display_order: idx,
        }));
        const { data, error } = await supabase
            .from('destination_images')
            .insert(rows)
            .select();
        if (error) { console.error('Error guardando imágenes:', error); return []; }
        // Actualizar estado local
        setDestinations(prev => prev.map(d =>
            String(d.id) === String(destinationId)
                ? { ...d, images: [...(d.images || []), ...data] }
                : d
        ));
        return data;
    };

    const deleteDestinationImage = async (imageId, destinationId) => {
        const { error } = await supabase.from('destination_images').delete().eq('id', imageId);
        if (error) { showNotification('Error al eliminar imagen', 'error'); return; }
        setDestinations(prev => prev.map(d =>
            String(d.id) === String(destinationId)
                ? { ...d, images: (d.images || []).filter(img => img.id !== imageId) }
                : d
        ));
    };


    // ─── STATS ─────────────────────────────────────────────────────
    const stats = {
        totalRevenue: sales.reduce((acc, s) => acc + (parseFloat(s.total_amount) || 0), 0),
        activeDestinations: destinations.filter(d => d.is_active).length,
        totalSales: sales.length,
        uniqueClients: new Set(sales.map(s => s.client_name)).size,
    };

    return (
        <AppContext.Provider value={{
            destinations, sales, users, clients, itineraries, isLoading, stats,
            addDestination, updateDestination, deleteDestination,
            addDestinationImages, deleteDestinationImage,
            addSale, updateSale, deleteSale, getSaleDetails,
            addUser, updateUser, deleteUser,
            addClient, updateClient, deleteClient,
            addItinerary, updateItinerary, deleteItinerary,
            refetch: loadAll,
        }}>
            {children}
        </AppContext.Provider>
    );

}

export const useApp = () => useContext(AppContext);
