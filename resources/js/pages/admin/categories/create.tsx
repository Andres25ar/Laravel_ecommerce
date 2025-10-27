//ANTES DEL CAMBIO
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import AdminCategoryController from '@/actions/App/Http/Controllers/Admin/CategoryController';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error'; // Asumo que tienes este componente

export default function CategoryCreate() {
    // Usamos el hook useForm de Inertia
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', // Solo necesitamos el nombre
    });

    // Función que se ejecuta al enviar el formulario
    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Hacemos un POST a la ruta 'store' del controlador de categorías
        post(AdminCategoryController.store.url(), {
            // onSuccess: () => reset(), // Opcional: resetear el formulario si quieres crear varias seguidas
        });
    };

    return (
        <AppLayout>
            <Head title="Crear Categoría" />

            <div className="container mx-auto px-4 py-8">
                {/* Encabezado y Link para volver */}
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Crear Nueva Categoría</h1>
                    <Button variant="outline" asChild>
                        <Link href={AdminCategoryController.index.url()}>
                            Cancelar
                        </Link>
                    </Button>
                </div>

                {/* Tarjeta del Formulario */}
                <Card className="max-w-xl mx-auto"> {/* Centramos la tarjeta */}
                    <CardHeader>
                        <CardTitle>Detalles de la Categoría</CardTitle>
                        <CardDescription>
                            Ingresa el nombre para la nueva categoría. El slug se generará automáticamente.
                        </CardDescription>
                    </CardHeader>
                    {/* Usamos el tag <form> y llamamos a submit */}
                    <form onSubmit={submit}>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        className={errors.name ? 'border-destructive' : ''} // Resaltar si hay error
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        autoFocus
                                    />
                                    {/* Mostramos el error si existe */}
                                    <InputError message={errors.name} className="mt-2" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Guardando...' : 'Guardar Categoría'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
