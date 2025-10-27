import { Paginator } from '@/types';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils'; // Asumiendo que usas cn de shadcn/ui

// Definimos las props que recibirá el componente
type PaginationProps = {
    //links: Paginator<any>['meta']['links']; // Recibe el array de links de 'meta'
    links: Paginator<any>['links'];
    className?: string; // Para clases adicionales
}

export default function Pagination({ links, className }: PaginationProps) {
    // Filtramos solo los links útiles (números y símbolos de prev/next)
    const relevantLinks = links?.filter(
        (link) => (link.label && (
            !isNaN(parseInt(link.label)) ||
            link.label.includes('&laquo;') || // 'Previous'
            link.label.includes('&raquo;')    // 'Next'
        ))
    ) || [];

    // Si no hay suficientes links para mostrar (solo prev/next y una pág), no mostramos nada
    if (relevantLinks.length <= 3) return null;

    return (
        <div className={cn("mt-8 flex justify-center space-x-1", className)}>
            {relevantLinks.map((link, index) => (
                <Link
                    key={index}
                    href={link.url || '#'}
                    preserveScroll
                    preserveState
                    className={cn(
                        'px-3 py-1.5 text-sm rounded-md border',
                        // Estilo para el link activo
                        link.active ? 'bg-primary text-primary-foreground border-primary z-10' : '',
                        // Estilo para links deshabilitados (sin URL)
                        !link.url ? 'bg-muted text-muted-foreground cursor-not-allowed border-border' : 'bg-card text-card-foreground hover:bg-accent border-border'
                    )}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    disabled={!link.url}
                    as={!link.url ? 'span' : 'a'} // Renderiza como <span> si está deshabilitado
                    tabIndex={!link.url ? -1 : undefined}
                />
            ))}
        </div>
    );
}