import { Head, Link, useForm, usePage } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout'; // Usamos el layout público
import { PageProps as BasePageProps, CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CreditCard, Lock } from 'lucide-react';
import CartController from '@/actions/App/Http/Controllers/CartController';
import CheckoutController from '@/actions/App/Http/Controllers/CheckoutController';
import InputError from '@/components/input-error'; // Asumo que tienes este componente

const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price);
    };

// Props que esta página recibe del controlador
interface CheckoutIndexProps extends BasePageProps {
    cartItems: CartItem[];
    subtotal: number;
    shippingCost: number;
    total: number;
}

// Componente para el Resumen de la Orden (columna derecha)
function OrderSummary({ subtotal, shippingCost, total }: { subtotal: number, shippingCost: number, total: number }) {
    

    return (
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
                    <span>{formatPrice(shippingCost)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                </div>
            </CardContent>
        </Card>
    );
}

// Página principal de Checkout
export default function CheckoutIndex() {
    const { subtotal, shippingCost, total } = usePage<CheckoutIndexProps>().props;

    // Hook useForm con todos los campos que el backend espera
    const { data, setData, post, processing, errors } = useForm({
        // Dirección de Envío
        shipping_address_line_1: '',
        shipping_city: '',
        shipping_state: '',
        shipping_postal_code: '',
        // Simulación de Tarjeta
        card_number: '',
        expiry_date: '',
        cvv: '',
        card_name: '',
    });

    // Función para enviar el formulario
    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(CheckoutController.store.url(), {
            // onSuccess se maneja por la redirección del controlador
            onError: () => {
                // `toast.error` se mostrará automáticamente si tienes
                // un listener de 'error' en tu layout
            }
        });
    };

    return (
        <PublicLayout>
            <Head title="Finalizar Compra" />

            <div className="container mx-auto px-4 py-8">
                {/* Link para Volver al Carrito */}
                <div className="mb-6">
                    <Button variant="outline" asChild size="sm">
                        <Link href={CartController.index.url()}>
                        {/*<Link href={route('cart.index')}>*/}
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver al Carrito
                        </Link>
                    </Button>
                </div>

                {/* Grid principal (Formulario a la izq, Resumen a la der) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Columna Izquierda: Formularios */}
                    <form onSubmit={submit} className="lg:col-span-2 space-y-8">

                        {/* 1. Formulario de Dirección de Envío */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Dirección de Envío</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="address">Dirección (Calle y Número)</Label>
                                    <Input id="address" value={data.shipping_address_line_1} onChange={e => setData('shipping_address_line_1', e.target.value)} required />
                                    <InputError message={errors.shipping_address_line_1} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">Ciudad</Label>
                                        <Input id="city" value={data.shipping_city} onChange={e => setData('shipping_city', e.target.value)} required />
                                        <InputError message={errors.shipping_city} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="state">Provincia</Label>
                                        <Input id="state" value={data.shipping_state} onChange={e => setData('shipping_state', e.target.value)} required />
                                        <InputError message={errors.shipping_state} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="postal_code">Código Postal</Label>
                                        <Input id="postal_code" value={data.shipping_postal_code} onChange={e => setData('shipping_postal_code', e.target.value)} required />
                                        <InputError message={errors.shipping_postal_code} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 2. Formulario de Pago Simulado */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Información de Pago</CardTitle>
                                <CardDescription>Simulación de pasarela de pago.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="card_name">Nombre en la Tarjeta</Label>
                                    <Input id="card_name" value={data.card_name} onChange={e => setData('card_name', e.target.value)} required />
                                    <InputError message={errors.card_name} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="card_number">Número de Tarjeta</Label>
                                    <div className="relative">
                                        <Input id="card_number" type="text" placeholder="0000 0000 0000 0000" value={data.card_number} onChange={e => setData('card_number', e.target.value)} required />
                                        <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <InputError message={errors.card_number} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="expiry_date">Vencimiento (MM/YY)</Label>
                                        <Input id="expiry_date" type="text" placeholder="MM/YY" value={data.expiry_date} onChange={e => setData('expiry_date', e.target.value)} required />
                                        <InputError message={errors.expiry_date} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cvv">CVV</Label>
                                        <div className="relative">
                                            <Input id="cvv" type="text" placeholder="123" value={data.cvv} onChange={e => setData('cvv', e.target.value)} required />
                                            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <InputError message={errors.cvv} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Botón de Pagar */}
                        <div className="flex justify-end">
                            <Button type="submit" size="lg" disabled={processing}>
                                {processing ? 'Procesando Pago...' : `Pagar ${formatPrice(total)}`}
                            </Button>
                        </div>

                    </form>

                    {/* Columna Derecha: Resumen */}
                    <OrderSummary subtotal={subtotal} shippingCost={shippingCost} total={total} />
                </div>
            </div>
        </PublicLayout>
    );
}