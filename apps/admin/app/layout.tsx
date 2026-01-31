'use client';


import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import {useAdminAuth} from "@/app/hooks/useAuth";

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAdminAuth();

    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        {loading ? (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Vérification de l'authentification...</p>
                </div>
            </div>
        ) : (
            children
        )}
        </body>
        </html>
    );
}