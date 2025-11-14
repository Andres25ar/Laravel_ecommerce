import { Head, Link, usePage, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Paginator, Order, PageProps as BasePageProps, Product } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge, BadgeProps } from '@/components/ui/badge';
import Pagination from '@/components/pagination';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, ChevronUp } from 'lucide-react';
import SellerOrderController from '@/actions/App/Http/Controllers/Seller/OrderController';
import InputError from '@/components/input-error';

// Props que esta página recibe
interface IndexProps extends BasePageProps {
    orders: Paginator<Order>;
}

// Mapeo de texto legible para el estado
const statusText: Record<Order['status'], string> = {
    pending: 'Pendiente',
    paid: 'Pagado (Procesando)',
    processing: 'En preparación',
    shipped: 'Despachado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
};

// Componente para el formulario de actualización de envío
function ShippingForm({ order }: { order: Order }) {

    // Inicializamos el formulario con los datos existentes de la orden
    const { data, setData, put, processing, errors } = useForm({
        status: order.status,
        shipping_type: order.shipping_type || '', // Usar string vacío si es null
        shipping_tracking_code: order.shipping_tracking_code || '',
        estimated_delivery_date: order.estimated_delivery_date || '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(SellerOrderController.update.url(order.id), {
            preserveScroll: true,
            onSuccess: () => toast.success(`Orden #${order.id} actualizada.`),
            onError: () => toast.error('Error al actualizar la orden.')
});
    };

// Sincronizar estado si las props cambian (ej. después de paginar)
useEffect(() => {
    setData({
        status: order.status,
        shipping_type: order.shipping_type || '',
        shipping_tracking_code: order.shipping_tracking_code || '',
        estimated_delivery_date: order.estimated_delivery_date ? new Date(order.estimated_delivery_date).toISOString().split('T')[0] : '',
    });
}, [order]);

// El vendedor solo puede gestionar órdenes pagadas o en procesamiento
const canManage = order.status === 'paid' || order.status === 'processing';

return (
    <form onSubmit={submit} className="p-4 bg-muted/50 rounded-b-md space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Tipo de Envío */}
            <div className="space-y-2">
                <Label htmlFor={`shipping_type_${order.id}`}>Método de Envío</Label>
                <Select
                    value={data.shipping_type}
                    onValueChange={(value) => setData('shipping_type', value)}
                    disabled={!canManage || processing}
                >
                    <SelectTrigger id={`shipping_type_${order.id}`}>
                        <SelectValue placeholder="Seleccionar método" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="local">Retiro en local</SelectItem>
                        <SelectItem value="sucursal">Correo (Retiro en sucursal)</SelectItem>
                        <SelectItem value="domicilio">Correo (A domicilio)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* 2. Código de Seguimiento */}
            <div className="space-y-2">
                <Label htmlFor={`tracking_${order.id}`}>Cód. Seguimiento</Label>
                <Input
                    id={`tracking_${order.id}`}
                    placeholder="Ej: AA123456789AR"
                    value={data.shipping_tracking_code}
                    onChange={(e) => setData('shipping_tracking_code', e.target.value)}
                    disabled={!canManage || processing}
                />
            </div>

            {/* 3. Fecha Estimada */}
            <div className="space-y-2">
                <Label htmlFor={`date_${order.id}`}>Fecha Entrega Estimada</Label>
                <Input
                    id={`date_${order.id}`}
                    type="date"
                    value={data.estimated_delivery_date}
                    onChange={(e) => setData('estimated_delivery_date', e.target.value)}
                    disabled={!canManage || processing}
                />
            </div>
        </div>

        {/* Botón de Guardar */}
        <div className="flex justify-end">
            {canManage ? (
                <Button type="submit" disabled={processing}>
                    {processing ? 'Guardando...' : 'Guardar y Notificar'}
                </Button>
            ) : (
                <p className="text-sm text-muted-foreground">Esta orden ya fue despachada o entregada.</p>
            )}
        </div>
    </form>
);
}


// Componente para la fila de la orden (colapsable)
function OrderRow({ order }: { order: Order }) {
    const [isOpen, setIsOpen] = useState(false); // Estado para expandir/colapsar

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price);
    };

    return (
        <>
            {/* Fila Principal (Clickable) */}
            <TableRow onClick={() => setIsOpen(!isOpen)} className="cursor-pointer hover:bg-muted/50">
            <TableCell className="font-medium">#{order.id}</TableCell>
            <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
            <TableCell>{order.buyer?.name || 'Comprador'}</TableCell>
            <TableCell>
                {/* Lista solo los productos del vendedor */}
                <ul className="list-disc pl-4">
                    {order.products.map(product => (
                        <li key={product.id}>{product.name} (x{product.pivot.quantity})</li>
                    ))}
                </ul>
            </TableCell>
            <TableCell>
                <Badge variant={order.status === 'shipped' ? 'default' : 'outline'}>
                    {statusText[order.status]}
                </Badge>
            </TableCell>
            <TableCell className="text-right">
                {/* Muestra el total de los productos del vendedor en esta orden */}
                {formatPrice(order.products.reduce((acc, p) => acc + (p.pivot.price * p.pivot.quantity), 0))}
            </TableCell>
            <TableCell className="text-right">
                <Button variant="ghost" size="icon">
                    {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
            </TableCell>
        </TableRow >

            {/* Contenido Colapsable (Formulario de Envío) */ }
    {
        isOpen && (
            <TableRow className="bg-muted/20 hover:bg-muted/20">
                <TableCell colSpan={7}>
                    {/* Dirección de Envío del Comprador */}
                    <div className="p-4">
                        <h4 className="font-semibold mb-2">Dirección de Envío del Comprador:</h4>
                        <address className="not-italic text-muted-foreground text-sm">
                            {order.shipping_address_line_1}<br />
                            {order.shipping_city}, {order.shipping_state}<br />
                            C.P: {order.shipping_postal_code}
                        </address>
                    </div>
                    <Separator />
                    {/* Formulario de Gestión */}
                    <ShippingForm order={order} />
                </TableCell>
            </TableRow>
        )
    }
        </>
    );
}

// Página principal
export default function SellerOrdersIndex() {
    const { orders } = usePage<IndexProps>().props;

    return (
        <AppLayout>
            <Head title="Gestionar Órdenes" />

            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Órdenes de Venta</CardTitle>
                        <CardDescription>
                            Gestiona las órdenes que contienen tus productos.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID Orden</TableHead>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Comprador</TableHead>
                                        <TableHead>Mis Productos</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead className="text-right">Mi Total</TableHead>
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
                                            <TableCell colSpan={7} className="text-center h-24">
                                                No tienes órdenes para gestionar.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {orders.data.length > 0 && (
                    <Pagination links={orders.links} className="mt-6" />
                )}
            </div>
        </AppLayout>
    );
}

//php artisan wayfinder:generate