import { useState } from 'react';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Paginator, Product, PageProps as BasePageProps } from '@/types'; // Usamos Product completo
import SellerProductController from '@/actions/App/Http/Controllers/Seller/ProductController';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import Pagination from '@/components/pagination';
import { Badge } from '@/components/ui/badge'; // Para mostrar Stock

interface IndexProps extends BasePageProps {
    products: Paginator<Product & { category?: { name: string } }>; // Incluimos nombre de categoría opcional
}

function DeleteProductAlert({ product, onOpenChange }: { product: Product, onOpenChange: (open: boolean) => void }) {
    const { delete: destroy, processing } = useForm();

    const deleteProduct = () => {
        destroy(SellerProductController.destroy.url(product.id), {
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
                    producto <span className="font-semibold">{product.name}</span>.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => onOpenChange(false)}>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={deleteProduct} disabled={processing} className="bg-destructive hover:bg-destructive/90">
                    {processing ? 'Eliminando...' : 'Eliminar'}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    );
}

export default function SellerProductsIndex() {
    const { products } = usePage<IndexProps>().props;
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const openDeleteDialog = (product: Product) => {
        setSelectedProduct(product);
        setDialogOpen(true);
    };

    // Helper para formatear precio
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price);
    };

    return (
        <AppLayout>
            <Head title="Mis Productos" />

            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">Mis Productos</h1>
                    <Button asChild>
                        <Link href={SellerProductController.create.url()}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Crear Producto
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Productos Publicados</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>Categoría</TableHead>
                                        <TableHead>Precio</TableHead>
                                        <TableHead>Stock</TableHead>
                                        <TableHead className="text-right w-[100px]">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.data.length > 0 ? (
                                        products.data.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell className="font-medium">{product.name}</TableCell>
                                                <TableCell>{product.category?.name ?? 'N/A'}</TableCell> {/* Muestra nombre de categoría */}
                                                <TableCell>{formatPrice(product.price)}</TableCell>
                                                <TableCell>
                                                    <Badge variant={product.stock > 0 ? "outline" : "destructive"}>
                                                        {product.stock}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <AlertDialog open={dialogOpen && selectedProduct?.id === product.id} onOpenChange={setDialogOpen}>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={SellerProductController.edit.url(product.id)}>
                                                                        Editar
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <AlertDialogTrigger asChild>
                                                                    <DropdownMenuItem
                                                                        className="text-destructive focus:text-destructive"
                                                                        onSelect={() => openDeleteDialog(product)}
                                                                    >
                                                                        Eliminar
                                                                    </DropdownMenuItem>
                                                                </AlertDialogTrigger>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>

                                                        {selectedProduct && <DeleteProductAlert product={selectedProduct} onOpenChange={setDialogOpen} />}
                                                    </AlertDialog>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center h-24">
                                                No has publicado ningún producto todavía.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <Pagination links={products.links} className="mt-6" />
            </div>
        </AppLayout>
    );
}
