import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import ProductCard from '@/components/product-card';
import { Paginator, Product as ProductType, PageProps as BasePageProps } from '@/types';
import ProductController from '@/actions/App/Http/Controllers/ProductController';
//import { cn } from '@/lib/utils';
import Pagination from '@/components/pagination'

interface IndexPageProps extends BasePageProps {
    products: Paginator<ProductType & { imageUrl?: string | null; rating?: number }>;
}


/*
const Pagination = ({ links }: { links: Paginator<any>['meta']['links'] }) => {
    // 1. Filtrar solo los links que tienen URL y label válidos
    const validLinks = links?.filter(link => link && link.url !== null && typeof link.label === 'string') || [];

    // 2. Filtrar para obtener "Previous", "Next" y los números
    const relevantLinks = validLinks.filter(
        (link) => !isNaN(parseInt(link.label)) || link.label.includes('&laquo;') || link.label.includes('&raquo;')
    );

    // No mostrar si no hay suficientes links útiles
    if (relevantLinks.length <= 3) return null;

    return (
        <div className="mt-8 flex justify-center space-x-1">
            {relevantLinks.map((link, index) => (
                <Link
                    key={index}
                    // Ahora estamos seguros de que link.url no es null
                    href={link.url!}
                    preserveScroll
                    preserveState
                    className={cn(
                        'px-3 py-1.5 text-sm rounded-md border',
                        link.active ? 'bg-primary text-primary-foreground border-primary z-10' : 'bg-card text-card-foreground hover:bg-accent border-border'
                        // Ya no necesitamos la clase para 'disabled' porque filtramos los null
                    )}
                    dangerouslySetInnerHTML={{ __html: link.label }} // link.label siempre será string aquí
                />
            ))}
        </div>
    );
};
*/

export default function ProductsIndex() {
    const { products } = usePage<IndexPageProps>().props;

    // Quitamos el console.log si ya verificamos
    // console.log('Datos de paginación recibidos:', products);

    return (
        <AppLayout>
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
        </AppLayout>
    );
}