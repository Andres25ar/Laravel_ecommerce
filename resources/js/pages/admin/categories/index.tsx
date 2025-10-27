import { useState } from 'react';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Paginator, Category, PageProps as BasePageProps } from '@/types';
import AdminCategoryController from '@/actions/App/Http/Controllers/Admin/CategoryController';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"; // Usamos el componente Table de shadcn
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; // Para confirmar eliminación
import Pagination from '@/components/pagination'; // Importamos nuestro componente reutilizable

// Definimos las props que esta página recibe del controlador
interface IndexProps extends BasePageProps {
    categories: Paginator<Category>;
}

// Componente separado para el diálogo de confirmación de borrado
function DeleteCategoryAlert({ category, onOpenChange }: { category: Category, onOpenChange: (open: boolean) => void }) {
    const { delete: destroy, processing } = useForm();

    const deleteCategory = () => {
        // Hacemos la petición DELETE a la ruta destroy
        destroy(AdminCategoryController.destroy.url(category.id), {
            preserveScroll: true,
            onSuccess: () => onOpenChange(false), // Cierra el modal
        });
    };

    return (
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                    Esta acción no se puede deshacer. Esto eliminará permanentemente la
                    categoría <span className="font-semibold">{category.name}</span>.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => onOpenChange(false)}>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={deleteCategory} disabled={processing} className="bg-destructive hover:bg-destructive/90">
                    {processing ? 'Eliminando...' : 'Eliminar'}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    );
}

// Componente principal de la página
export default function CategoriesIndex() {
    // Obtenemos las categorías paginadas de las props
    const { categories } = usePage<IndexProps>().props;

    // Estado para manejar qué modal de confirmación está abierto
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    // Función para abrir el diálogo de un ítem específico
    const openDeleteDialog = (category: Category) => {
        setSelectedCategory(category);
        setDialogOpen(true);
    };

    return (
        <AppLayout>
            <Head title="Gestionar Categorías" />

            <div className="container mx-auto px-4 py-8">
                {/* Encabezado de la página */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">Gestionar Categorías</h1>
                    {/* Botón para ir a la página de creación */}
                    <Button asChild>
                        <Link href={AdminCategoryController.create.url()}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Crear Categoría
                        </Link>
                    </Button>
                </div>

                {/* Tarjeta con la tabla de categorías */}
                <Card>
                    <CardHeader>
                        <CardTitle>Todas las Categorías</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>Slug</TableHead>
                                        <TableHead className="text-right w-[100px]">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categories.data.length > 0 ? (
                                        categories.data.map((category) => (
                                            <TableRow key={category.id}>
                                                <TableCell className="font-medium">{category.name}</TableCell>
                                                <TableCell>{category.slug}</TableCell>
                                                <TableCell className="text-right">
                                                    {/* Usamos AlertDialog para la confirmación */}
                                                    <AlertDialog open={dialogOpen && selectedCategory?.id === category.id} onOpenChange={setDialogOpen}>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                {/* Enlace de Edición */}
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={AdminCategoryController.edit.url(category.id)}>
                                                                        Editar
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                {/* Botón de Borrado (abre el diálogo) */}
                                                                <AlertDialogTrigger asChild>
                                                                    <DropdownMenuItem
                                                                        className="text-destructive focus:text-destructive"
                                                                        onSelect={() => openDeleteDialog(category)}
                                                                    >
                                                                        Eliminar
                                                                    </DropdownMenuItem>
                                                                </AlertDialogTrigger>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>

                                                        {/* Contenido del Diálogo (se renderiza solo si está abierto) */}
                                                        {selectedCategory && <DeleteCategoryAlert category={selectedCategory} onOpenChange={setDialogOpen} />}
                                                    </AlertDialog>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        // Mensaje si no hay categorías
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center h-24">
                                                No se encontraron categorías.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Paginación */}
                <Pagination links={categories.links} className="mt-6" />
            </div>
        </AppLayout>
    );
}