import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Paginator, Order, PageProps as BasePageProps } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import Pagination from '@/components/pagination';
import { cn } from '@/lib/utils'; // Importa cn

// Definimos las props que esta página recibe
interface IndexProps extends BasePageProps {
    orders: Paginator<Order>;
}

// Función para obtener un estilo de Badge según el estado
const getStatusBadgeVariant = (status: Order['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case 'delivered':
            return 'default'; // Verde (o el color primario)
        case 'shipped':
            return 'secondary'; // Gris
        case 'paid':
            return 'outline'; // Borde
        case 'pending':
            return 'secondary'; // Gris claro
        case 'cancelled':
            return 'destructive'; // Rojo
        default:
            return 'secondary';
    }
};

export default function OrdersIndex() {
    const { orders } = usePage<IndexProps>().props;

    // Helper para formatear precio
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price);
    };

     // Helper para formatear fecha
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <AppLayout>
            <Head title="Mis Compras" />
            
            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Mis Compras</CardTitle>
                        <CardDescription>
                            Aquí puedes ver el historial de todas tus compras.
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
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.data.length > 0 ? (
                                        orders.data.map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell className="font-medium">
                                                    #{order.id}
                                                </TableCell>
                                                <TableCell>{formatDate(order.created_at)}</TableCell>
                                                <TableCell>
                                                    <Badge 
                                                        variant={getStatusBadgeVariant(order.status)}
                                                        // Añadimos color verde específico para 'delivered'
                                                        className={cn(
                                                            order.status === 'delivered' && 'bg-green-600 text-green-50'
                                                        )}
                                                    >
                                                        {order.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{order.products_count} {order.products_count > 1 ? 'items' : 'item'}</TableCell>
                                                <TableCell className="text-right">
                                                    {formatPrice(order.total_amount)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center h-24">
                                                Aún no has realizado ninguna compra.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Paginación */}
                {orders.data.length > 0 && (
                    <Pagination links={orders.links} className="mt-6" />
                )}
            </div>
        </AppLayout>
    );
}
