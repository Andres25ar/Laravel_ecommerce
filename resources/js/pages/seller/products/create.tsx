import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import SellerProductController from '@/actions/App/Http/Controllers/Seller/ProductController';
import ProductForm from './partials/product-form'; // Importa el formulario reutilizable
import { PageProps as BasePageProps, Category, Tag } from '@/types';
import { Button } from '@/components/ui/button';

// Props que recibe esta página (categorías y tags)
interface CreateProps extends BasePageProps {
    categories: Category[];
    tags: Tag[];
}

export default function ProductCreate() {
    const { categories, tags } = usePage<CreateProps>().props;

    // Estado inicial del formulario
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        inclusions: '',
        price: '', // Usar string vacío para inputs
        stock: '', // Usar string vacío para inputs
        category_id: '',
        tags: [] as string[], // Inicializar como array vacío de strings
    });

    // Función que se pasará al componente ProductForm
    const submit = () => {
        // Convertir precio y stock a número antes de enviar si es necesario,
        // aunque Laravel suele manejarlos bien si son numéricos.
        const submitData = {
            ...data,
            price: parseFloat(String(data.price)) || 0,
            stock: parseInt(String(data.stock), 10) || 0,
        };
        post(SellerProductController.store.url());
    };

    return (
        <AppLayout>
            <Head title="Crear Producto" />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Publicar Nuevo Producto</h1>
                    <Button variant="outline" asChild>
                        <Link href={SellerProductController.index.url()}>
                            Cancelar
                        </Link>
                    </Button>
                </div>

                {/* Renderiza el componente de formulario reutilizable */}
                <ProductForm
                    submit={submit}
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    categories={categories}
                    tags={tags}
                    isEditMode={false} // Indicar que es modo creación
                />
            </div>
        </AppLayout>
    );
}
