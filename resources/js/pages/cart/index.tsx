import { Head, Link, router, usePage } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { CartItem, PageProps as BasePageProps, Product } from '@/types';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';
import CartController from '@/actions/App/Http/Controllers/CartController';
import ProductController from '@/actions/App/Http/Controllers/ProductController';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { useEffect } from 'react';

// Props que esta página recibe del controlador
interface CartIndexProps extends BasePageProps {
    cartItems: CartItem[];
}

// Componente para un solo item del carrito
function CartItemRow({ item }: { item: CartItem }) {

    // Usamos useForm para manejar la cantidad de este item
    const { data, setData, put, processing } = useForm({
        quantity: item.quantity,
    });

    // Función para actualizar (con debounce para no saturar)
    useEffect(() => {
        // No actualiza si la cantidad no ha cambiado
        if (data.quantity === item.quantity) return;

        const timer = setTimeout(() => {
            router.put(CartController.update.url(item.id), {
                quantity: data.quantity
            }, {
                preserveScroll: true,
                preserveState: false, // Recargar items y totales
                onSuccess: () => toast.success('Cantidad actualizada.'),
                    onError: (errors) => {
                        toast.error(errors.quantity || 'Error al actualizar.');
                        // Revertir al valor original si hay error
                        setData('quantity', item.quantity);
                    }
    });
}, 500); // Espera 500ms después de que el usuario deja de teclear

return () => clearTimeout(timer);
    }, [data.quantity, item.id, item.quantity]);


// Función para eliminar
const deleteItem = () => {
    router.delete(CartController.destroy.url(item.id), {
        preserveScroll: true,
        preserveState: false, // Recargar items y totales
        onSuccess: () => toast.success('Producto eliminado.'),
        });
    };

// Incrementar/Decrementar
const changeQuantity = (amount: number) => {
    const newQuantity = Math.max(0, data.quantity + amount); // No permite menos de 0
    if (newQuantity <= item.product.stock) {
        setData('quantity', newQuantity);
    } else {
        toast.error(`Stock máximo: ${item.product.stock} unidades.`);
    }
};

return (
    <div className="flex items-center gap-4 py-4">
        {/* Imagen */}
        <div className="flex-shrink-0">
            <img
                src={item.product_image_url || `https://placehold.co/80x80/e2e8f0/e2e8f0?text=...`}
                alt={item.product.name}
                className="w-20 h-20 rounded-md object-cover"
            />
        </div>

        {/* Detalles */}
        <div className="flex-grow space-y-1">
            <Link href={ProductController.show.url(item.product.id)} className="font-semibold hover:underline">
                {item.product.name}
            </Link>
            <p className="text-sm text-muted-foreground">
                {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(item.product.price)}
            </p>
        </div>

        {/* Controles */}
        <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => changeQuantity(-1)} disabled={processing}>
                <Minus className="h-4 w-4" />
            </Button>
            <Input
                type="number"
                className="w-16 h-10 text-center"
                value={data.quantity}
                onChange={(e) => setData('quantity', parseInt(e.target.value) || 0)}
                min="0"
                max={item.product.stock}
                disabled={processing}
            />
            <Button variant="outline" size="icon" onClick={() => changeQuantity(1)} disabled={processing}>
                <Plus className="h-4 w-4" />
            </Button>
        </div>

        {/* Total Item y Eliminar */}
        <div className="flex items-center gap-4 w-28 justify-end">
            <span className="font-semibold w-20 text-right">
                {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(item.product.price * data.quantity)}
            </span>
            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={deleteItem}>
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    </div>
);
}

// Página principal del Carrito
export default function CartIndex() {
    const { cartItems } = usePage<CartIndexProps>().props;

    // Calcular totales
    const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const deliveryCharge = subtotal > 0 ? 2000 : 0; // Ejemplo de costo de envío
    const total = subtotal + deliveryCharge;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price);
    };

    return (
        <PublicLayout>
            <Head title="Carrito de Compras" />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Tu Carrito</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Columna Izquierda: Items del Carrito */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Productos ({cartItems.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {cartItems.length > 0 ? (
                                <div className="divide-y">
                                    {cartItems.map((item) => (
                                        <CartItemRow key={item.id} item={item} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-center py-10">
                                    Tu carrito está vacío.
                                </p>
                            )}
                        </CardContent>
                        <CardContent>
                            <Button variant="outline" asChild>
                                <Link href={ProductController.index.url()}>
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Seguir comprando
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Columna Derecha: Resumen de Compra */}
                    <Card className="lg:col-span-1 h-fit sticky top-24">
                        <CardHeader>
                            <CardTitle>Resumen de Compra</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Envío</span>
                                <span>{formatPrice(deliveryCharge)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                        </CardContent>
                        <CardContent>
                            <Button className="w-full" size="lg" disabled={cartItems.length === 0}>
                                Proceder al Pago (Checkout)
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PublicLayout>
    );
}
