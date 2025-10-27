import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import AdminTagController from '@/actions/App/Http/Controllers/Admin/TagController'; // Cambiado
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

// Cambiado nombre del componente
export default function TagCreate() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(AdminTagController.store.url(), { // Cambiado
            // onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout>
            <Head title="Crear Tag" /> {/* Cambiado */}

            <div className="container mx-auto px-4 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Crear Nuevo Tag</h1> {/* Cambiado */}
                    <Button variant="outline" asChild>
                        <Link href={AdminTagController.index.url()}> {/* Cambiado */}
                            Cancelar
                        </Link>
                    </Button>
                </div>

                <Card className="max-w-xl mx-auto">
                    <CardHeader>
                        <CardTitle>Detalles del Tag</CardTitle> {/* Cambiado */}
                        <CardDescription>
                            Ingresa el nombre para el nuevo tag. El slug se generará automáticamente. {/* Cambiado */}
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={submit}>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={data.name}
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
                                {processing ? 'Guardando...' : 'Guardar Tag'} {/* Cambiado */}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
