import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Importa Textarea
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Importa Select
import { Checkbox } from '@/components/ui/checkbox'; // Importa Checkbox
import InputError from '@/components/input-error';
import { Category, Tag } from '@/types'; // Importa tipos
import React, { useEffect } from 'react';

// Tipos para las props del formulario
type ProductFormData = {
    name: string;
    description: string;
    inclusions: string;
    price: number | string; // Permitir string para el input, convertir luego
    stock: number | string; // Permitir string para el input, convertir luego
    category_id: string; // ID de categoría como string para el Select
    tags: string[]; // Array de IDs de tags como strings para Checkboxes
};

interface ProductFormProps {
    submit: (data: ProductFormData) => void; // Función para enviar
    data: ProductFormData; // Datos del formulario
    setData: <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => void; // Función para actualizar datos
    errors: Partial<Record<keyof ProductFormData, string>>; // Errores
    processing: boolean; // Estado de envío
    categories: Category[]; // Lista de categorías disponibles
    tags: Tag[]; // Lista de tags disponibles
    isEditMode?: boolean; // Para cambiar texto del botón
}

export default function ProductForm({
    submit,
    data,
    setData,
    errors,
    processing,
    categories,
    tags,
    isEditMode = false,
}: ProductFormProps) {

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        submit(data); // Llama a la función submit pasada como prop
    };

    // Manejador para los checkboxes de tags
    const handleTagChange = (tagId: string) => {
        const currentTags = data.tags || [];
        const newTags = currentTags.includes(tagId)
            ? currentTags.filter((id) => id !== tagId) // Quitar si ya está
            : [...currentTags, tagId]; // Añadir si no está
        setData('tags', newTags);
    };

    return (
        <Card className="max-w-3xl mx-auto"> {/* Hacemos la tarjeta un poco más ancha */}
            <CardHeader>
                <CardTitle>{isEditMode ? 'Editar Producto' : 'Crear Nuevo Producto'}</CardTitle>
                <CardDescription>
                    {isEditMode ? 'Actualiza los detalles de tu producto.' : 'Completa la información para publicar tu producto.'}
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleFormSubmit}>
                <CardContent className="space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre del Producto</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className={errors.name ? 'border-destructive' : ''}
                            required
                        />
                        <InputError message={errors.name} />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className={`min-h-[100px] ${errors.description ? 'border-destructive' : ''}`}
                            required
                        />
                        <InputError message={errors.description} />
                    </div>

                    {/* Inclusions */}
                    <div className="space-y-2">
                        <Label htmlFor="inclusions">Inclusiones (Opcional)</Label>
                        <Input
                            id="inclusions"
                            value={data.inclusions}
                            onChange={(e) => setData('inclusions', e.target.value)}
                            className={errors.inclusions ? 'border-destructive' : ''}
                        />
                        <p className="text-sm text-muted-foreground">Ej: Incluye cargador, manual, etc.</p>
                        <InputError message={errors.inclusions} />
                    </div>

                    {/* Price & Stock (en una fila) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Precio (ARS)</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01" // Para permitir decimales
                                min="0"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)} // Guardar como string temporalmente
                                className={errors.price ? 'border-destructive' : ''}
                                required
                            />
                            <InputError message={errors.price} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stock">Stock Disponible</Label>
                            <Input
                                id="stock"
                                type="number"
                                min="0"
                                value={data.stock}
                                onChange={(e) => setData('stock', e.target.value)} // Guardar como string temporalmente
                                className={errors.stock ? 'border-destructive' : ''}
                                required
                            />
                            <InputError message={errors.stock} />
                        </div>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <Label htmlFor="category_id">Categoría</Label>
                        <Select
                            value={data.category_id}
                            onValueChange={(value) => setData('category_id', value)}
                            required
                        >
                            <SelectTrigger className={errors.category_id ? 'border-destructive' : ''}>
                                <SelectValue placeholder="Selecciona una categoría" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={String(category.id)}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.category_id} />
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <Label>Tags (Opcional)</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 rounded-md border p-4 max-h-40 overflow-y-auto">
                            {tags.map((tag) => (
                                <div key={tag.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`tag-${tag.id}`}
                                        checked={data.tags?.includes(String(tag.id))}
                                        onCheckedChange={() => handleTagChange(String(tag.id))}
                                    />
                                    <Label htmlFor={`tag-${tag.id}`} className="font-normal cursor-pointer">
                                        {tag.name}
                                    </Label>
                                </div>
                            ))}
                        </div>
                        <InputError message={errors.tags} /> {/* Error general para el array */}
                        {/* Puedes añadir errores individuales si la validación los devuelve así */}
                        {/* <InputError message={errors['tags.*']} /> */}
                    </div>

                    {/* Aquí podrías añadir campos para subir imágenes */}

                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button type="submit" disabled={processing}>
                        {processing ? (isEditMode ? 'Actualizando...' : 'Guardando...') : (isEditMode ? 'Actualizar Producto' : 'Guardar Producto')}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
