// pages/products/show.tsx (CORREGIDO)

import { Head, usePage, router } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import CartController from '@/actions/App/Http/Controllers/CartController';

// Tipos más detallados para la vista de un solo producto
type ProductDetails = {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    seller: { name: string };
    category: { name: string };
    tags: { id: number; name: string }[];
};

interface PageProps {
    product: ProductDetails;
}

export default function ProductShow() {
    const { product } = usePage<PageProps>().props;
    const addToCart = () => {
        router.post(CartController.add.url(product.id), {}, {
            preserveScroll: true,
            preserveState: false, // Para que el contador del carrito se actualice
            onSuccess: () => {
                toast.success(`${product.name} añadido al carrito.`);
            },
            onError: (errors) => {
                const firstError = Object.values(errors)[0];
                toast.error(firstError || 'No se pudo añadir el producto.');
            }
        });
    };

    return (
        <PublicLayout>
            <Head title={product.name} />

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Columna de la Imagen */}
                    <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500">Imagen del Producto</span>
                    </div>

                    {/* Columna de la Información */}
                    <div>
                        <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
                        <p className="text-gray-500 mb-4">Vendido por: {product.seller.name}</p>
                        <p className="text-3xl font-light mb-6">
                            {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(product.price)}
                        </p>

                        <p className="text-gray-700 mb-6">{product.description}</p>

                        <Button
                            size="lg" // Botón más grande
                            className="w-full"
                            onClick={addToCart} // Añadir la función
                            disabled={product.stock <= 0} // Deshabilitar si no hay stock
                        >
                            {product.stock > 0 ? 'Añadir al Carrito' : 'Sin Stock'}
                        </Button>

                        <div className="mt-4">
                            <span className="text-sm text-gray-600">Stock disponible: {product.stock}</span>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
