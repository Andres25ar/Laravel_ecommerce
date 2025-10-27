import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider, // Es buena práctica incluir el Provider si no está ya en un nivel superior
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { useIsMobile } from '@/hooks/use-mobile';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react'; // Importa Link
import { ChevronsUpDown, LogIn } from 'lucide-react'; // Importa LogIn icon
import { login, register } from '@/routes'; // Importa rutas de login/register
import { Button } from '@/components/ui/button'; // Importa Button si no está ya

export function NavUser() {
    const { auth } = usePage<SharedData>().props;
    const { state } = useSidebar();
    const isMobile = useIsMobile();

    // --- NUEVA LÓGICA ---
    // Si NO hay usuario, muestra botones de Login/Register
    if (!auth.user) {
        return (
            <SidebarMenu className="mt-auto p-2 space-y-2"> {/* Añade margen superior y espacio */}
                {/* Oculta en modo icono */}
                <div className="group-data-[collapsible=icon]:hidden flex flex-col gap-2">
                    <Button asChild size="sm" variant="outline">
                        <Link href={login()}>Log In</Link>
                    </Button>
                    <Button asChild size="sm">
                        <Link href={register()}>Sign Up</Link>
                    </Button>
                </div>
                {/* Muestra solo icono en modo icono */}
                <div className="hidden group-data-[collapsible=icon]:flex justify-center">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button asChild variant="ghost" size="icon">
                                <Link href={login()}>
                                    <LogIn className="size-4" />
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">Log In</TooltipContent>
                    </Tooltip>
                </div>
            </SidebarMenu>
        );
    }
    // --- FIN NUEVA LÓGICA ---

    // Si HAY usuario, muestra el menú desplegable como antes
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="group text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent"
                            data-test="sidebar-menu-button"
                        >
                            <UserInfo user={auth.user} /> {/* Aquí user nunca será null */}
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-56 rounded-lg" // Corregido: var()
                        align="end"
                        side={
                            isMobile
                                ? 'bottom'
                                : state === 'collapsed'
                                    ? 'left'
                                    : 'bottom'
                        }
                    >
                        <UserMenuContent user={auth.user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

/*import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { useIsMobile } from '@/hooks/use-mobile';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';

export function NavUser() {
    const { auth } = usePage<SharedData>().props;
    const { state } = useSidebar();
    const isMobile = useIsMobile();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="group text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent"
                            data-test="sidebar-menu-button"
                        >
                            <UserInfo user={auth.user} />
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="end"
                        side={
                            isMobile
                                ? 'bottom'
                                : state === 'collapsed'
                                  ? 'left'
                                  : 'bottom'
                        }
                    >
                        <UserMenuContent user={auth.user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}*/
