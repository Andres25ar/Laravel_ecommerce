import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

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

    return (
        <AppLayout>
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
                        <p className="text-3xl font-light mb-6">${product.price}</p>

                        <p className="text-gray-700 mb-6">{product.description}</p>

                        <button className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                            Añadir al Carrito
                        </button>

                        <div className="mt-4">
                            <span className="text-sm text-gray-600">Stock disponible: {product.stock}</span>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}