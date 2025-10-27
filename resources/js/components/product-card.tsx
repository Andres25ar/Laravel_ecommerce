import React from 'react';
// Corregido: Asegurarse que la importación de Link sea correcta para el entorno.
// En un proyecto Laravel + Inertia + React estándar, esta es la importación correcta.
import { Link } from '@inertiajs/react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Definimos las propiedades que recibirá el componente ProductCard
interface ProductCardProps {
    product: {
        id: number;
        name: string;
        price: number;
        imageUrl?: string | null;
        rating?: number; // Número de estrellas (0-5)
        productUrl: string; // URL de Inertia o string
    };
    className?: string; // Para estilos adicionales
}

// Placeholder de imagen si no hay una URL
const ImagePlaceholder: React.FC = () => (
    <div className="flex aspect-square w-full items-center justify-center rounded-t-lg bg-muted text-muted-foreground">
        {/* Placeholder SVG */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    </div>
);

// Componente para mostrar las estrellas de calificación
const RatingStars: React.FC<{ rating?: number }> = ({ rating = 0 }) => {
    const totalStars = 5;
    // Asegura que el rating esté entre 0 y 5 y redondea
    const filledStars = Math.max(0, Math.min(totalStars, Math.round(rating)));

    return (
        <div className="flex items-center space-x-0.5">
            {[...Array(totalStars)].map((_, index) => (
                <Star
                    key={index}
                    // Aplica clases condicionales para rellenar estrellas
                    className={cn(
                        'h-4 w-4 stroke-1', // Tamaño y grosor del borde
                        index < filledStars
                            ? 'fill-yellow-400 text-yellow-500' // Estrella rellena
                            : 'text-muted-foreground fill-muted/50' // Estrella vacía/fondo
                    )}
                />
            ))}
        </div>
    );
};

const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
    // Formatear el precio (ajusta 'es-AR' y 'ARS' según tu locale y moneda)
    const formattedPrice = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
    }).format(product.price);

    // Función para manejar errores de carga de imagen
    const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        // Oculta la imagen rota
        event.currentTarget.style.display = 'none';
        // Podrías mostrar un placeholder aquí si la imagen falla,
        // aunque el diseño actual ya muestra uno si imageUrl es null/undefined.
        // Si quieres un fallback *específico para error*, necesitarías añadir estado.
    };


    return (
        <Card className={cn(
            "group/productcard overflow-hidden rounded-lg border shadow-sm transition-all duration-300 ease-in-out hover:shadow-md dark:hover:shadow-neutral-700/40",
            className
        )}>
            <CardHeader className="p-0">
                <Link href={product.productUrl} className="block overflow-hidden aspect-square">
                    {product.imageUrl ? (
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover/productcard:scale-105"
                            onError={handleImageError}
                            loading="lazy" // Carga diferida para imágenes
                        />
                    ) : (
                        <ImagePlaceholder />
                    )}
                </Link>
            </CardHeader>
            <CardContent className="p-3 space-y-1.5"> {/* Menos padding y espacio */}
                <Link href={product.productUrl} className="focus:outline-none">
                    <h3
                        className="font-medium text-sm leading-snug truncate text-foreground hover:text-primary dark:hover:text-primary-foreground focus:text-primary dark:focus:text-primary-foreground"
                        title={product.name}
                    >
                        {product.name}
                    </h3>
                </Link>
                <RatingStars rating={product.rating ?? 4.5} /> {/* Valor de ejemplo */}
            </CardContent>
            <CardFooter className="p-3 pt-0 flex justify-between items-center">
                <span className="font-semibold text-base text-foreground">{formattedPrice}</span>
                {/* Botón "Ver" con estilo outline */}
                <Button asChild size="sm" variant="outline" className="text-xs h-7 px-2.5">
                    <Link href={product.productUrl}>Ver</Link>
                </Button>
            </CardFooter>
        </Card>
    );
};

export default ProductCard;

