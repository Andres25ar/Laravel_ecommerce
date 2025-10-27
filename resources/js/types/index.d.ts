import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    roles?: Array<{ name: string }>;
    [key: string]: unknown; // This allows for additional properties...
}

// Define la estructura de una categoría
export interface Category {
    id: number;
    name: string;
    slug: string;
}

// Define la estructura de una etiqueta (tag)
export interface Tag {
    id: number;
    name: string;
    slug: string;
}

// Define la estructura de un producto
export interface Product {
    id: number;
    name: string;
    description: string;
    inclusions: string;
    price: number;
    stock: number;
    category: Category;
    seller: User;
    tags: Tag[];
}

// Define la estructura del objeto de paginación de Laravel
// Define la estructura del objeto de paginación de Laravel
export interface Paginator<T> {
    data: T[];
    /*links: { // Basic links (first, last, prev, next)
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };*/
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    meta: {
        current_page: number;
        from: number | null;
        last_page: number;
        // --> THIS is the array the component needs <--
        /*links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;*/
        path: string;
        per_page: number;
        to: number | null;
        total: number;
    };
}

export interface PageProps { // O el nombre que le hayas dado a tu interfaz base
    auth: {
        user: User | null;
    };
    flash?: { // Añadido para el mensaje flash
        success?: string;
        error?: string; // Opcional: para mensajes de error
    };
    // Aquí puedes añadir más props compartidas si las tienes
    [key: string]: unknown; // <--- ESTA ES LA FIRMA DE ÍNDICE NECESARIA
}


/*
// Define las props compartidas por Inertia en cada página
export interface PageProps {
    auth: {
        user: User | null;
    };
    // Aquí puedes añadir más props compartidas si las tienes
}*/
