import AppLogo from '@/components/app-logo';
//import { AppLogo } from '@/components/app-logo';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
//import { ScrollArea } from '@/components/ui/scroll-area';
import { Sidebar, SidebarContent, SidebarFooter } from '@/components/ui/sidebar';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type NavItem, type SharedData } from '@/types'; // Asegúrate que SharedData esté importada
import { usePage } from '@inertiajs/react'; // Importamos usePage
import {
    LayoutGrid,
    Settings,
    Github,
    LifeBuoy,
    LogOut,
    Plus,
    // --- Iconos para Admin ---
    FolderKanban, // Icono para Categorías
    TagsIcon,     // Icono para Tags
} from 'lucide-react';
// --- Importamos las rutas de admin ---
import AdminCategoryController from '@/actions/App/Http/Controllers/Admin/CategoryController';
import AdminTagController from '@/actions/App/Http/Controllers/Admin/TagController';

export function AppSidebar() {
    const mobileNavigation = useMobileNavigation();

    // --- LÓGICA DE ROLES ---
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    // Verificamos si el usuario es administrador
    const isAdmin = user?.roles?.some(role => role.name === 'administrador') ?? false;

    // --- Definición de navItems ---
    const navItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard', // Esta ruta redirigirá según el rol (ver web.php)
            icon: LayoutGrid,
        },
        // --- ADMIN LINKS (Condicionales) ---
        ...(isAdmin ? [ // Si es admin, añade este array de enlaces
            {
                title: 'Categories',
                href: AdminCategoryController.index.url(),
                icon: FolderKanban,
            },
            {
                title: 'Tags',
                href: AdminTagController.index.url(),
                icon: TagsIcon,
            }
        ] : []), // Si no es admin, añade un array vacío
        // --- FIN ADMIN LINKS ---
        {
            title: 'Settings',
            href: '/settings/profile',
            icon: Settings,
        },
        // ... (Puedes añadir más enlaces para Vendedor o Comprador aquí si quieres)
    ];

    // ... (resto de navItems, footerItems, etc. si los tienes) ...
    // Por ejemplo, los footerItems que ya tenías:
    const footerItems: NavItem[] = [
        {
            title: 'GitHub',
            href: 'https://github.com/im-naka/naka-admin-dashboard',
            icon: Github,
        },
        {
            title: 'Support',
            href: '#',
            icon: LifeBuoy,
        },
    ];

    return (
        <Sidebar
            //mobileNavigation={mobileNavigation.state}
            //onMobileNavigationChange={mobileNavigation.onStateChange}
        >
            <SidebarContent
                className="flex flex-col"
                //onSelect={() => mobileNavigation.onStateChange('closed')}
            >
                <AppSidebarHeader />

                <div className="flex-1 overflow-y-auto"> {/* Añadimos overflow-y-auto */}
                    <NavMain items={navItems} />
                </div>

                <NavFooter items={footerItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

/*import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}*/
