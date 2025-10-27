import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import AdminCategoryController from '@/actions/App/Http/Controllers/Admin/CategoryController';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Category, PageProps as BasePageProps } from '@/types'; // Importamos el tipo Category

// Definimos las props que esta página recibe del controlador
interface EditProps extends BasePageProps {
    category: Category;
}

export default function CategoryEdit() {
    // 1. Obtenemos la categoría a editar desde las props
    const { category } = usePage<EditProps>().props;

    // 2. Usamos useForm, inicializando 'name' con el valor existente
    const { data, setData, put, processing, errors } = useForm({
        name: category.name, // <-- CAMBIO AQUÍ
    });

    // 3. Función submit que usa PUT
    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Hacemos un PUT a la ruta 'update' pasando el ID de la categoría
        put(AdminCategoryController.update.url(category.id)); // <-- CAMBIO AQUÍ
    };

    return (
        <AppLayout>
            <Head title={`Editar Categoría: ${category.name}`} />

            <div className="container mx-auto px-4 py-8">
                {/* Encabezado y Link para volver */}
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Editar Categoría</h1>
                    <Button variant="outline" asChild>
                        <Link href={AdminCategoryController.index.url()}>
                            Cancelar
                        </Link>
                    </Button>
                </div>

                {/* Tarjeta del Formulario */}
                <Card className="max-w-xl mx-auto">
                    <CardHeader>
                        <CardTitle>Detalles de la Categoría</CardTitle>
                        <CardDescription>
                            Actualiza el nombre de la categoría. El slug se regenerará automáticamente.
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
                                        value={data.name} // El valor viene del estado
                                        className={errors.name ? 'border-destructive' : ''}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        autoFocus
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Actualizando...' : 'Actualizar Categoría'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}