import React from 'react';
import { useForm } from '@inertiajs/react';
import { Category, Product, Tag } from '@/types';

// --- Componentes de UI reutilizables para el formulario ---

const InputLabel = ({ htmlFor, value }: { htmlFor: string, value: string }) => (
    <label htmlFor={htmlFor} className="block font-medium text-sm text-gray-700">{value}</label>
);

const TextInput = ({ id, type = 'text', value, onChange, className = '' }: { id: string, type?: string, value: string | number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, className?: string }) => (
    <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className={`border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full ${className}`}
    />
);

const TextArea = ({ id, value, onChange }: { id: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void }) => (
    <textarea
        id={id}
        value={value}
        onChange={onChange}
        className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full"
        rows={4}
    />
);

const SelectInput = ({ id, value, onChange, children }: { id: string, value: string | number, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, children: React.ReactNode }) => (
    <select
        id={id}
        value={value}
        onChange={onChange}
        className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full"
    >
        {children}
    </select>
);

const MultiSelectInput = ({ id, value, onChange, children }: { id: string, value: (string | number)[], onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, children: React.ReactNode }) => (
    <select
        id={id}
        multiple
        value={value.map(String)} // El valor del select multiple debe ser un array de strings
        onChange={onChange}
        className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full h-32"
    >
        {children}
    </select>
);


const InputError = ({ message }: { message?: string }) => (
    message ? <p className="text-sm text-red-600 mt-2">{message}</p> : null
);

// --- Props del Formulario Principal ---

interface ProductFormProps {
    product?: Product;
    categories: Category[];
    tags: Tag[];
}

export default function ProductForm({ product, categories, tags }: ProductFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: product?.name || '',
        description: product?.description || '',
        inclusions: product?.inclusions || '',
        price: product?.price || 0,
        stock: product?.stock || 0,
        category_id: product?.category.id.toString() || '', // Aseguramos que sea string
        tags: product?.tags.map(t => t.id) || [],
    });

    const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedIds = Array.from(e.target.selectedOptions, option => parseInt(option.value, 10));
        setData('tags', selectedIds);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (product) {
            put(route('seller.products.update', product.id), {
                preserveScroll: true,
            });
        } else {
            post(route('seller.products.store'), {
                preserveScroll: true,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <InputLabel htmlFor="name" value="Nombre del Producto" />
                <TextInput
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                />
                <InputError message={errors.name} />
            </div>

            <div>
                <InputLabel htmlFor="description" value="Descripción" />
                <TextArea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                />
                <InputError message={errors.description} />
            </div>

            <div>
                <InputLabel htmlFor="inclusions" value="Inclusiones (qué incluye el producto)" />
                <TextInput
                    id="inclusions"
                    value={data.inclusions}
                    onChange={(e) => setData('inclusions', e.target.value)}
                />
                <InputError message={errors.inclusions} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <InputLabel htmlFor="price" value="Precio" />
                    <TextInput
                        id="price"
                        type="number"
                        value={data.price}
                        onChange={(e) => setData('price', parseFloat(e.target.value) || 0)}
                    />
                    <InputError message={errors.price} />
                </div>
                <div>
                    <InputLabel htmlFor="stock" value="Stock" />
                    <TextInput
                        id="stock"
                        type="number"
                        value={data.stock}
                        onChange={(e) => setData('stock', parseInt(e.target.value, 10) || 0)}
                    />
                    <InputError message={errors.stock} />
                </div>
            </div>

            <div>
                <InputLabel htmlFor="category_id" value="Categoría" />
                <SelectInput
                    id="category_id"
                    value={data.category_id}
                    onChange={e => setData('category_id', e.target.value)}
                >
                    <option value="">Selecciona una categoría</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id.toString()}>{cat.name}</option>
                    ))}
                </SelectInput>
                <InputError message={errors.category_id} />
            </div>

            <div>
                <InputLabel htmlFor="tags" value="Etiquetas (mantén presionado Ctrl o Cmd para seleccionar varias)" />
                <MultiSelectInput
                    id="tags"
                    value={data.tags}
                    onChange={handleMultiSelectChange}
                >
                    {tags.map(tag => (
                        <option key={tag.id} value={tag.id}>{tag.name}</option>
                    ))}
                </MultiSelectInput>
                <InputError message={errors.tags} />
            </div>

            <div className="flex items-center justify-end">
                <button
                    type="submit"
                    className="px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
                    disabled={processing}
                >
                    {product ? 'Actualizar Producto' : 'Guardar Producto'}
                </button>
            </div>
        </form>
    );
}

