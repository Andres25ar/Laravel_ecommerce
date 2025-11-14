import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Paginator, Order, PageProps as BasePageProps } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge, BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Pagination from '@/components/pagination';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Package, Truck, Store } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// Props que esta página recibe
interface IndexProps extends BasePageProps {
    orders: Paginator<Order>;
}

// Mapeo de texto legible para el estado
const statusText: Record<Order['status'], string> = {
    pending: 'Pendiente',
    paid: 'Pagado',
    processing: 'En preparación',
    shipped: 'Despachado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
};

const getStatusBadgeVariant = (status: Order['status']): BadgeProps['variant'] => {
    switch (status) {
        case 'delivered':
            return 'default';
        case 'shipped':
            return 'default';
        case 'paid':
        case 'processing':
            return 'outline';
        case 'pending':
            return 'secondary';
        case 'cancelled':
            return 'destructive';
        default:
            return 'secondary';
    }
};

// Componente para la Fila de la Orden (Colapsable)
function OrderRow({ order }: { order: Order }) {
    const [isOpen, setIsOpen] = useState(false);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getShippingInfo = () => {
        if (!order.shipping_type) {
            return { icon: Package, text: 'El vendedor está preparando tu pedido.' };
        }

        switch (order.shipping_type) {
            case 'local':
                return { icon: Store, text: 'Listo para retirar en el local.' };
            case 'sucursal':
            case 'domicilio':
                return {
                    icon: Truck,
                    text: `Enviado por correo. Cód: ${order.shipping_tracking_code || 'N/A'}`
                };
            default:
                return { icon: Package, text: 'En preparación.' };
        }
    };
    const shippingInfo = getShippingInfo();

    return (
        <>
            {/* Fila Principal (Clickable) */}
            <TableRow onClick={() => setIsOpen(!isOpen)} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">#{order.id}</TableCell>
                <TableCell>{formatDate(order.created_at)}</TableCell>
                <TableCell>
                    <Badge
                        variant={getStatusBadgeVariant(order.status)}
                        className={cn(
                            order.status === 'delivered' && 'bg-green-600 hover:bg-green-600 text-green-50'
                        )}
                    >
                        {statusText[order.status]}
                    </Badge>
                </TableCell>
                <TableCell>{order.products_count} {order.products_count > 1 ? 'items' : 'item'}</TableCell>
                <TableCell className="text-right">{formatPrice(order.total_amount)}</TableCell>
                <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                </TableCell>
            </TableRow>

            {/* Contenido Colapsable */}
            {isOpen && (
                <TableRow className="bg-muted/20 hover:bg-muted/20">
                    <TableCell colSpan={6}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                            {/* Columna de Productos */}
                            <div>
                                <h4 className="font-semibold mb-2">Productos en esta orden:</h4>
                                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                                    {order.products.map(product => (
                                        <li key={product.id}>
                                            {product.name} (x{product.pivot.quantity})
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Columna de Envío */}
                            <div>
                                <h4 className="font-semibold mb-2">Información de Envío:</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center text-muted-foreground">
                                        <shippingInfo.icon className="h-4 w-4 mr-2 flex-shrink-0" />
                                        <span>{shippingInfo.text}</span>
                                    </div>
                                    <p>
                                        <span className="font-medium text-foreground">Entrega estimada: </span>
                                        <span className="text-muted-foreground">{formatDate(order.estimated_delivery_date)}</span>
                                    </p>
                                    <Separator className="my-2" />
                                    <h5 className="font-medium text-foreground">Dirección de Entrega:</h5>
                                    <address className="not-italic text-muted-foreground">
                                        {order.shipping_address_line_1}<br />
                                        {order.shipping_city}, {order.shipping_state}<br />
                                        C.P: {order.shipping_postal_code}
                                    </address>
                                </div>
                            </div>
                        </div>
                    </TableCell>
                </TableRow>
            )}
        </>
    );
}

// Página principal "Mis Compras"
export default function OrdersIndex() {
    const { orders, flash } = usePage<IndexProps>().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    return (
        <AppLayout>
            <Head title="Mis Compras" />

            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Mis Compras</CardTitle>
                        <CardDescription>
                            Aquí puedes ver el historial de todas tus compras. Haz clic en una orden para ver detalles.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Pedido ID</TableHead>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead>Items</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.data.length > 0 ? (
                                        orders.data.map((order) => (
                                            <OrderRow key={order.id} order={order} />
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center h-24">
                                                Aún no has realizado ninguna compra.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* --- CORRECCIÓN DE PAGINACIÓN AQUÍ (Línea 212 aprox) --- */}
                {/* Cambiamos 'orders.links' por 'orders.meta.links' */}
                {orders.data.length > 0 && (
                    <Pagination links={orders.links} className="mt-6" />
                )}
                {/* --- FIN DE LA CORRECCIÓN --- */}
            </div>
        </AppLayout>
    );
}