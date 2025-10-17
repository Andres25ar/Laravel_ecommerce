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
    [key: string]: unknown; // This allows for additional properties...
}

// Define la estructura de una categoría
export interface Category {
    id: number;
    name: string;
}

// Define la estructura de una etiqueta (tag)
export interface Tag {
    id: number;
    name: string;
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
export interface Paginator<T> {
    data: T[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

// Define las props compartidas por Inertia en cada página
export interface PageProps {
    auth: {
        user: User | null;
    };
    // Aquí puedes añadir más props compartidas si las tienes
}
