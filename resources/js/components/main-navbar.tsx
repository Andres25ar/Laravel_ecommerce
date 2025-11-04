import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'; // Para menú móvil
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CircleUserRound, Menu, Search, ShoppingCart, Store } from 'lucide-react';
import { type SharedData } from '@/types'; // Importa tus tipos
import ProductController from '@/actions/App/Http/Controllers/ProductController'; // Ruta de inicio
import { login, register } from '@/routes'; // Rutas de auth
import { useIsMobile } from '@/hooks/use-mobile'; // Hook para móvil
import AuthenticatedSessionController from '@/actions/Laravel/Fortify/Http/Controllers/AuthenticatedSessionController';

// Componente de Logo/Título
const AppTitle = () => (
    <Button variant="ghost" asChild>
        <Link href={ProductController.index.url()} className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            <span className="font-semibold text-lg hidden sm:block">Mocha Mart</span>
        </Link>
    </Button>
);

// Barra de Búsqueda (Placeholder)
const SearchBar = () => (
    <div className="relative w-full max-w-sm">
        <Input
            type="search"
            placeholder="Buscar productos..."
            className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    </div>
);

// Botones para Visitantes (No logueados)
const GuestButtons = () => (
    <div className="flex items-center gap-2">
        <Button variant="outline" asChild>
            <Link href={login()}>Log In</Link>
        </Button>
        <Button asChild>
            <Link href={register()}>Sign Up</Link>
        </Button>
    </div>
);

// Iconos para Usuarios (Logueados)
const UserIcons = () => (
    <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Carrito</span>
            {/* Opcional: Badge de contador */}
            {/* <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">3</span> */}
        </Button>

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <CircleUserRound className="h-6 w-6" />
                    <span className="sr-only">Perfil</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    {/* Asumo que la ruta de perfil está en settings.php */}
                    <Link href={'/settings/profile'}>Mi Perfil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={'/dashboard'}>Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={AuthenticatedSessionController.destroy.url()} method="post" as="button">
                        Cerrar Sesión
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
);

// Menú Móvil (para pantallas pequeñas)
const MobileMenu = ({ user }: { user: SharedData['auth']['user'] }) => (
    <Sheet>
        <SheetTrigger asChild>
            <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menú</span>
            </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full max-w-xs sm:max-w-sm">
            <div className="flex flex-col h-full p-4">
                <div className="mb-6">
                    <AppTitle />
                </div>
                <div className="mb-6">
                    <SearchBar />
                </div>
                <div className="mt-auto"> {/* Al fondo */}
                    {user ? <UserIcons /> : <GuestButtons />}
                </div>
            </div>
        </SheetContent>
    </Sheet>
);

// --- Componente Principal de la Navbar ---
export default function MainNavbar() {
    const { auth } = usePage<SharedData>().props;
    const isMobile = useIsMobile(); // Hook que ya tienes

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container h-16 flex items-center justify-between gap-4">
                {/* Lado Izquierdo: Título o Menú Móvil */}
                {isMobile ? <MobileMenu user={auth.user} /> : <AppTitle />}

                {/* Centro: Búsqueda (oculto en móvil) */}
                {!isMobile && (
                    <div className="flex-1 flex justify-center">
                        <SearchBar />
                    </div>
                )}

                {/* Derecha: Botones (oculto en móvil) */}
                {!isMobile && (
                    <div className="flex-shrink-0">
                        {auth.user ? <UserIcons /> : <GuestButtons />}
                    </div>
                )}
            </div>
        </header>
    );
}