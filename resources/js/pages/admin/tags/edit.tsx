import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import AdminTagController from '@/actions/App/Http/Controllers/Admin/TagController'; // Cambiado
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Tag, PageProps as BasePageProps } from '@/types'; // Cambiado a Tag

interface EditProps extends BasePageProps {
    tag: Tag; // Cambiado a tag
}

// Cambiado nombre del componente
export default function TagEdit() {
    const { tag } = usePage<EditProps>().props; // Cambiado a tag

    const { data, setData, put, processing, errors } = useForm({
        name: tag.name, // Cambiado a tag
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(AdminTagController.update.url(tag.id)); // Cambiado
    };

    return (
        <AppLayout>
            <Head title={`Editar Tag: ${tag.name}`} /> {/* Cambiado */}

            <div className="container mx-auto px-4 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Editar Tag</h1> {/* Cambiado */}
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
                            Actualiza el nombre del tag. El slug se regenerará automáticamente. {/* Cambiado */}
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
                                {processing ? 'Actualizando...' : 'Actualizar Tag'} {/* Cambiado */}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
