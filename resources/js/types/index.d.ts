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
    cartCount: number;
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

export interface OrderProduct {
    id: number;
    name: string;
    price: number;
    // 'pivot' contendrá la cantidad y el precio al momento de la compra
    pivot: {
        quantity: number;
        price: number;
    };
}

//Define la estructura de una Orden
export interface Order {
    id: number;
    buyer_id: number;
    total_amount: number;
    discount: number | null;
    payment_method: string;
    status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
    created_at: string; // Es un string de fecha (ISO 8601)
    updated_at: string;
    products: OrderProduct[]; // Array de productos en la orden
    products_count: number; // Propiedad custom
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

export interface CartItem {
    id: number;
    user_id: number;
    product_id: number;
    quantity: number;
    product: Product; // El producto cargado
    product_image_url: string | null; // URL que añadimos en el controlador
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

export interface PageProps {
    auth: {
        user: User | null;
    };
    cartCount?: number;
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
