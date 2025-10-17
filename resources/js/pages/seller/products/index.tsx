import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Paginator, Product, PageProps } from '@/types'; // Importamos nuestros tipos

// Componente para renderizar los links de paginación
const Pagination = ({ links }: { links: { url: string | null; label: string; active: boolean }[] }) => (
    <div className="mt-6 flex justify-center">
        {links.map((link, index) => (
            link.url ? (
                <Link
                    key={index}
                    href={link.url}
                    className={`mx-1 px-3 py-2 text-sm rounded-md ${link.active ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ) : (
                <span
                    key={index}
                    className="mx-1 px-3 py-2 text-sm text-gray-400"
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            )
        ))}
    </div>
);

interface IndexPageProps extends PageProps {
    products: Paginator<Product>;
    flash?: {
        success?: string;
    };
}

export default function Index({ auth, products, flash }: IndexPageProps) {

    const handleDelete = (product: Product) => {
        if (confirm(`¿Estás seguro de que quieres eliminar el producto "${product.name}"?`)) {
            router.delete(route('seller.products.destroy', product.id));
        }
    };

    return (
        <>
            <Head title="Mis Productos" />
            <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Gestión de Mis Productos</h1>
                            <p className="text-gray-600">Hola, {auth.user?.name}!</p>
                        </div>
                        <Link
                            href={route('seller.products.create')}
                            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-sm"
                        >
                            Crear Nuevo Producto
                        </Link>
                    </div>

                    {flash?.success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <span className="block sm:inline">{flash.success}</span>
                        </div>
                    )}

                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {products.data.map((product) => (
                                    <tr key={product.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">${product.price}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{product.category.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link href={route('seller.products.edit', product.id)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                                Editar
                                            </Link>
                                            <button onClick={() => handleDelete(product)} className="text-red-600 hover:text-red-900">
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination links={products.meta.links} />
                </div>
            </div>
        </>
    );
}

