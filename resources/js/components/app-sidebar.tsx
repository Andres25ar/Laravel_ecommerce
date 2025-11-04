import AppLogo from '@/components/app-logo';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter } from '@/components/ui/sidebar';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type NavItem, type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
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
    // --- Iconos de vendedor ---
    Package,
    Store,
    Car,
    ShoppingBag,
} from 'lucide-react';

//rutas
import AdminCategoryController from '@/actions/App/Http/Controllers/Admin/CategoryController';
import AdminTagController from '@/actions/App/Http/Controllers/Admin/TagController';
import SellerProductController from '@/actions/App/Http/Controllers/Seller/ProductController';
import ProductController from '@/actions/App/Http/Controllers/ProductController';
import OrderController from '@/actions/App/Http/Controllers/OrderController';

export function AppSidebar() {
    const mobileNavigation = useMobileNavigation();

    // --- LÓGICA DE ROLES ---
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    // Verificamos roles
    const isAdmin = user?.roles?.some(role => role.name === 'administrador') ?? false;
    const isSeller = user?.roles?.some(role => role.name === 'vendedor') ?? false;
    const isBuyer = !isAdmin && !isSeller;

    let navItems: NavItem[] = [];

    //logica del admin
    if (isAdmin) {
        navItems = [
            { title: 'Ver Tienda', href: ProductController.index.url(), icon: Store },
            { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
            { title: 'Categorías', href: AdminCategoryController.index.url(), icon: FolderKanban },
            { title: 'Tags', href: AdminTagController.index.url(), icon: TagsIcon }
        ];
    }
    //logica del vendedor seller
    else if (isSeller) {
        navItems = [
            { title: 'Ver Tienda', href: ProductController.index.url(), icon: Store },
            { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
            { title: 'Mis Productos', href: SellerProductController.index.url(), icon: Package }
        ];
    }
    // Lógica para el Comprador (isBuyer)
    else {
        navItems = [
            { title: 'Ver Tienda', href: ProductController.index.url(), icon: Store },
            { title: 'Mis Compras', href: OrderController.index.url(), icon: ShoppingBag }
        ];
    }

    // "Settings" se añade al final para TODOS los roles
    navItems.push({
        title: 'Settings',
        href: '/settings/profile',
        icon: Settings,
    });

    // ... (resto de navItems, footerItems, etc. si los tienes) ...
    // Por ejemplo, los footerItems que ya tenías:
    const footerItems: NavItem[] = [
        /*{
            title: 'GitHub',
            href: 'https://github.com/im-naka/naka-admin-dashboard',
            icon: Github,
        },*/
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
