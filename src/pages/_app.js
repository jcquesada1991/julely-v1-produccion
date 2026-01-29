import '@/styles/globals.css';
import Head from 'next/head';
import { NotificationProvider } from '@/context/NotificationContext';
import { AppProvider } from '@/context/AppContext';

export default function App({ Component, pageProps }) {
    return (
        <NotificationProvider>
            <AppProvider>
                <Head>
                    <title>TravelAgendy | Luxury Travel Management</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                </Head>
                <Component {...pageProps} />
            </AppProvider>
        </NotificationProvider>
    );
}
