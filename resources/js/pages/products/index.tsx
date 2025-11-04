import { Head, Link, usePage } from '@inertiajs/react';
//import AppLayout from '@/layouts/app-layout';
import PublicLayout from '@/layouts/public-layout';
import ProductCard from '@/components/product-card';
import { Paginator, Product as ProductType, PageProps as BasePageProps } from '@/types';
import ProductController from '@/actions/App/Http/Controllers/ProductController';
//import { cn } from '@/lib/utils';
import Pagination from '@/components/pagination'

interface IndexPageProps extends BasePageProps {
    products: Paginator<ProductType & { imageUrl?: string | null; rating?: number }>;
}

export default function ProductsIndex() {
    const { products } = usePage<IndexPageProps>().props;

    // Quitamos el console.log si ya verificamos
    // console.log('Datos de paginación recibidos:', products);

    return (
        <PublicLayout>
            <Head title="Catálogo de Productos" />

            <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-semibold mb-6 text-center md:text-left">Nuestros Productos</h2>

                {/* ... (Grid de productos) ... */}
                {products.data.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {products.data.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={{
                                    ...product,
                                    productUrl: ProductController.show.url(product.id),
                                    imageUrl: product.imageUrl ?? null,
                                    rating: product.rating ?? Math.random() * 2 + 3,
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground col-span-full">
                        No hay productos disponibles por el momento.
                    </p>
                )}


                {/* Paginación */}
                {/* La comprobación previa ahora es menos necesaria pero la dejamos por seguridad */}
                {products && products.links && (
                    <Pagination links={products.links} />
                )}
            </div>
        </PublicLayout>
    );
}