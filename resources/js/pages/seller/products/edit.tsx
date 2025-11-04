import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import SellerProductController from '@/actions/App/Http/Controllers/Seller/ProductController';
import ProductForm from './partials/product-form'; // Reutiliza el mismo formulario
import { PageProps as BasePageProps, Category, Tag, Product } from '@/types';
import { Button } from '@/components/ui/button';

// Props que recibe esta página (producto, categorías, tags, IDs de tags actuales)
interface EditProps extends BasePageProps {
    product: Product;
    categories: Category[];
    tags: Tag[];
    currentTagIds: number[]; // IDs numéricos
}

export default function ProductEdit() {
    const { product, categories, tags, currentTagIds } = usePage<EditProps>().props;

    // Estado inicial del formulario con datos del producto
    const { data, setData, put, processing, errors } = useForm({
        name: product.name,
        description: product.description,
        inclusions: product.inclusions || '', // Asegurar que sea string
        price: String(product.price), // Convertir a string para el input
        stock: String(product.stock), // Convertir a string para el input
        category_id: String(product.category), // Convertir a string (agregar _id ssi falla ?)
        tags: currentTagIds.map(String), // Convertir IDs numéricos a strings para Checkbox
    });

    // Función que se pasará al componente ProductForm
    const submit = () => {
        const submitData = {
            ...data,
            price: parseFloat(String(data.price)) || 0,
            stock: parseInt(String(data.stock), 10) || 0,
        };
        // Usamos PUT para actualizar
        put(SellerProductController.update.url(product.id));
    };

    return (
        <AppLayout>
            <Head title={`Editar Producto: ${product.name}`} />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Editar Producto</h1>
                    <Button variant="outline" asChild>
                        <Link href={SellerProductController.index.url()}>
                            Cancelar
                        </Link>
                    </Button>
                </div>

                {/* Renderiza el mismo componente de formulario */}
                <ProductForm
                    submit={submit}
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    categories={categories}
                    tags={tags}
                    isEditMode={true} // Indicar que es modo edición
                />
            </div>
        </AppLayout>
    );
}
