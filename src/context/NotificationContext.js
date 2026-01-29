import { createContext, useContext, useState } from 'react';
import Toast from '@/components/Toast';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [notification, setNotification] = useState(null);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
    };

    const closeNotification = () => {
        setNotification(null);
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            {notification && (
                <Toast
                    message={notification.message}
                    type={notification.type}
                    onClose={closeNotification}
                />
            )}
        </NotificationContext.Provider>
    );
}

export const useNotification = () => useContext(NotificationContext);
