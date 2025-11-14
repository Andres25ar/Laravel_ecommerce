import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

// --- TIPOS DE USUARIO Y AUTENTICACIÓN ---

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    roles?: Array<{ name: string }>; //para roles
    banned_at?: string | null; // suspensión
    [key: string]: unknown;
}

export interface Auth {
    user: User | null; // Corregido: User puede ser null
}

// --- TIPOS DE NAVEGACIÓN ---

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

// --- TIPOS DE DATOS (MODELOS) ---

export interface Category {
    id: number;
    name: string;
    slug: string;
}

export interface Tag {
    id: number;
    name: string;
    slug: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    inclusions: string;
    price: number;
    stock: number;
    category_id: number; //para formulario
    category?: Category;
    seller?: User;
    tags?: Tag[];
    imageUrl?: string | null;
    rating?: number; //para card
    // 'pivot' es opcional, solo existe cuando se carga a través de una orden
    pivot?: {
        quantity: number;
        price: number;
    };
}

/**
 * Define la estructura de un item del carrito
 */
export interface CartItem {
    id: number;
    user_id: number;
    product_id: number;
    quantity: number;
    product: Product;
    product_image_url: string | null;
}

/**
 * Define la estructura de un producto dentro de una orden
 */
export interface OrderProduct {
    id: number;
    name: string;
    price: number;
    pivot: {
        quantity: number;
        price: number;
    };
}

/**
 * Define la estructura de una Orden
 */
export interface Order {
    id: number;
    buyer_id: number;
    total_amount: number;
    discount: number | null;
    payment_method: string;
    status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    created_at: string;
    updated_at: string;
    products: Product[];
    products_count: number;
    
    // Relación (cargada opcionalmente)
    buyer?: User;
    
    // Dirección (llenada por el comprador)
    shipping_address_line_1: string | null;
    shipping_city: string | null;
    shipping_state: string | null;
    shipping_postal_code: string | null;
    
    // Envío (llenado por el vendedor)
    shipping_type: 'local' | 'sucursal' | 'domicilio' | null;
    shipping_tracking_code: string | null;
    estimated_delivery_date: string | null;
}


// --- TIPOS DE INERTIA Y PAGINACIÓN ---

/**
 * Paginador (Tu estructura, que funciona)
 */
export interface Paginator<T> {
    data: T[];
    links: { // Basic links (first, last, prev, next)
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number | null;
        last_page: number;
        // --> Este es el array que usa tu componente Pagination
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        path: string;
        per_page: number;
        to: number | null;
        total: number;
    };
}

/**
 * Props base que todas las páginas reciben (ACTUALIZADO)
 */
export interface PageProps {
    auth: Auth; // Corregido para usar la interfaz Auth
    cartCount?: number; // Añadido contador de carrito
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

/**
 * Props compartidas (ACTUALIZADO)
 */
export interface SharedData extends PageProps {
    name: string;
    quote: { message: string; author: string };
    sidebarOpen: boolean;
    cartCount: number;
}