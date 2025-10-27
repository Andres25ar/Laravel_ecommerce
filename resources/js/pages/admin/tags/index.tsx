import { useState } from 'react';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Paginator, Tag, PageProps as BasePageProps } from '@/types'; // Cambiado a Tag
import AdminTagController from '@/actions/App/Http/Controllers/Admin/TagController'; // Cambiado a TagController
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, // Asegúrate que Trigger esté aquí
} from "@/components/ui/alert-dialog";
import Pagination from '@/components/pagination';

// Cambiado a tags
interface IndexProps extends BasePageProps {
    tags: Paginator<Tag>;
}

// Cambiado a tag
function DeleteTagAlert({ tag, onOpenChange }: { tag: Tag, onOpenChange: (open: boolean) => void }) {
    const { delete: destroy, processing } = useForm();

    const deleteTag = () => {
        destroy(AdminTagController.destroy.url(tag.id), { // Cambiado a TagController
            preserveScroll: true,
            onSuccess: () => onOpenChange(false),
        });
    };

    return (
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                    Esta acción no se puede deshacer. Esto eliminará permanentemente el
                    tag <span className="font-semibold">{tag.name}</span>. {/* Cambiado a tag */}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => onOpenChange(false)}>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={deleteTag} disabled={processing} className="bg-destructive hover:bg-destructive/90">
                    {processing ? 'Eliminando...' : 'Eliminar'}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    );
}

// Cambiado el nombre del componente
export default function TagsIndex() {
    const { tags } = usePage<IndexProps>().props; // Cambiado a tags
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedTag, setSelectedTag] = useState<Tag | null>(null); // Cambiado a Tag

    const openDeleteDialog = (tag: Tag) => { // Cambiado a tag
        setSelectedTag(tag);
        setDialogOpen(true);
    };

    return (
        <AppLayout>
            <Head title="Gestionar Tags" /> {/* Cambiado */}

            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">Gestionar Tags</h1> {/* Cambiado */}
                    <Button asChild>
                        <Link href={AdminTagController.create.url()}> {/* Cambiado */}
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Crear Tag {/* Cambiado */}
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Todos los Tags</CardTitle> {/* Cambiado */}
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
                                    {tags.data.length > 0 ? ( // Cambiado a tags
                                        tags.data.map((tag) => ( // Cambiado a tag
                                            <TableRow key={tag.id}>
                                                <TableCell className="font-medium">{tag.name}</TableCell>
                                                <TableCell>{tag.slug}</TableCell>
                                                <TableCell className="text-right">
                                                    <AlertDialog open={dialogOpen && selectedTag?.id === tag.id} onOpenChange={setDialogOpen}>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={AdminTagController.edit.url(tag.id)}> {/* Cambiado */}
                                                                        Editar
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                {/* Trigger para el diálogo */}
                                                                <AlertDialogTrigger asChild>
                                                                    <DropdownMenuItem
                                                                        className="text-destructive focus:text-destructive"
                                                                        onSelect={() => openDeleteDialog(tag)} // Cambiado a tag
                                                                    >
                                                                        Eliminar
                                                                    </DropdownMenuItem>
                                                                </AlertDialogTrigger>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>

                                                        {selectedTag && <DeleteTagAlert tag={selectedTag} onOpenChange={setDialogOpen} />} {/* Cambiado */}
                                                    </AlertDialog>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center h-24">
                                                No se encontraron tags. {/* Cambiado */}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <Pagination links={tags.links} className="mt-6" /> {/* Cambiado */}
            </div>
        </AppLayout>
    );
}
