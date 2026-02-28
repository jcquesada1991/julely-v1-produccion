import '@/styles/globals.css';
import Head from 'next/head';
import { NotificationProvider } from '@/context/NotificationContext';
import { AppProvider } from '@/context/AppContext';
import { AuthProvider } from '@/context/AuthContext';
import { ConfirmProvider } from '@/components/ConfirmModal';

export default function App({ Component, pageProps }) {
    return (
        <AuthProvider>
            <NotificationProvider>
                <AppProvider>
                    <ConfirmProvider>
                        <Head>
                            <title>Julely | Agencia de Viajes</title>
                            <meta name="viewport" content="width=device-width, initial-scale=1" />
                            <meta name="description" content="Julely - Viajando por el Mundo. Gestión profesional de viajes y turismo." />
                            <link rel="icon" type="image/png" href="/favicon.png" />
                            <link rel="apple-touch-icon" href="/favicon.png" />
                        </Head>
                        <Component {...pageProps} />
                    </ConfirmProvider>
                </AppProvider>
            </NotificationProvider>
        </AuthProvider>
    );
}
