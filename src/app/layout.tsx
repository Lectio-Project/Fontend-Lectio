import NextAuthSessionProvider from '@/providers/sessionProvider';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import lectio from './assets/logoLectio.svg';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Lectio',
    description:
        'Descubra a riqueza da literatura nacional no Lectio, um site dedicado à promoção de autores brasileiros. Explore análises envolventes, resenhas e descubra novos talentos que contribuem para o cenário literário do Brasil.'
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="shortcut icon" href={lectio} type="image/x-icon" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="use-credentials"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className={inter.className}>
                <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
            </body>
        </html>
    );
}
