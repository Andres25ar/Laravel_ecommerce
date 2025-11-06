import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Product } from '@/types';
//import { toast } from 'sonner';
import { toast } from 'sonner';
//import { toast } from '@/components/ui/sonner';
import CartController from '@/actions/App/Http/Controllers/CartController';

// Placeholder de imagen si no hay una URL
const ImagePlaceholder: React.FC = () => (
    <div className="flex aspect-square w-full items-center justify-center rounded-t-lg bg-muted text-muted-foreground">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    </div>
);

// Componente para mostrar las estrellas de calificación
const RatingStars: React.FC<{ rating?: number }> = ({ rating = 0 }) => {
    const totalStars = 5;
    const filledStars = Math.max(0, Math.min(totalStars, Math.round(rating)));

    return (
        <div className="flex items-center space-x-0.5">
            {[...Array(totalStars)].map((_, index) => (
                <Star
                    key={index}
                    className={cn(
                        'h-4 w-4 stroke-1',
                        index < filledStars
                            ? 'fill-yellow-400 text-yellow-500'
                            : 'text-muted-foreground fill-muted/50'
                    )}
                />
            ))}
        </div>
    );
};

// Definimos las props (usando el tipo Product)
interface ProductCardProps {
    product: Product & {
        productUrl: string;
        imageUrl?: string | null;
        rating?: number;
    };
    className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {

    const addToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        router.post(CartController.add.url(product.id), {}, {
            preserveScroll: true,
            preserveState: false, // Para que cartCount se actualice
            onSuccess: () => {
                toast.success(`${product.name} añadido al carrito.`);
            },
            onError: (errors) => {
                const firstError = Object.values(errors)[0];
                toast.error(firstError || 'No se pudo añadir el producto.');
            }
        });
    };

    const formattedPrice = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
    }).format(product.price);

    const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        event.currentTarget.style.display = 'none';
    };

    return (
        <Card className={cn(
            "group/productcard overflow-hidden rounded-lg border shadow-sm transition-all duration-300 ease-in-out hover:shadow-md dark:hover:shadow-neutral-700/40",
            className
        )}>
            <Link href={product.productUrl} className="block overflow-hidden">
                <CardHeader className="p-0">
                    <div className="aspect-square">
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover/productcard:scale-105"
                                onError={handleImageError}
                                loading="lazy"
                            />
                        ) : (
                            <ImagePlaceholder />
                        )}
                    </div>
                </CardHeader>
                <CardContent className="p-3 space-y-1.5">
                    <h3
                        className="font-medium text-sm leading-snug truncate text-foreground hover:text-primary dark:hover:text-primary-foreground"
                        title={product.name}
                    >
                        {product.name}
                    </h3>
                    <RatingStars rating={product.rating ?? 4.5} />
                </CardContent>
            </Link>
            <CardFooter className="p-3 pt-0 flex justify-between items-center">
                <span className="font-semibold text-base text-foreground">{formattedPrice}</span>
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={addToCart}
                    disabled={product.stock <= 0}
                >
                    <ShoppingCart className="h-4 w-4" />
                    <span className="sr-only">Añadir al carrito</span>
                </Button>
            </CardFooter>
        </Card>
    );
}