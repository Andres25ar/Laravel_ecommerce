import React from 'react';
import { Head } from '@inertiajs/react';
import { Category, Product, Tag, PageProps } from '@/types';
import ProductForm from './partials/product-form';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; // Layout para usuarios logueados

interface EditPageProps extends PageProps {
    product: Product;
    categories: Category[];
    tags: Tag[];
}

export default function Edit({ auth, product, categories, tags }: EditPageProps) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Editando Producto: {product.name}</h2>}
        >
            <Head title={`Editar ${product.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Pasamos todos los props necesarios al formulario */}
                            <ProductForm
                                product={product}
                                categories={categories}
                                tags={tags}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

