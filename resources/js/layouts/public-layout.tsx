import MainNavbar from '@/components/main-navbar'; // Importa la navbar que acabamos de crear
import { Toaster } from '@/components/ui/toaster'; // Para notificaciones (opcional pero útil)
import React from 'react';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-muted/40">
            {/* Navbar Pública */}
            <MainNavbar />

            {/* Contenido de la Página */}
            <main className="flex-1 py-8">
                {children}
            </main>

            {/* <Footer /> cuando lo tenga o lo haga xd */}

            <Toaster richColors />
        </div>
    );
}