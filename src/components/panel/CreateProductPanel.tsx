import { createProduct } from '@/api/product/getAllProductByCompany'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { ImageIcon, PlusCircle, ScanBarcode, XCircle } from 'lucide-react'
import { useState } from 'react'
import { Switch } from '../ui/switch'
import Product from '@/@types/Product'
import { toast } from 'sonner'
import { useAuth } from '@/context/AuthContext'

const initialProductState = (companyId: number): Product => ({
    name: '',
    description: undefined,
    price_selling: 0,
    price_cost: 0,
    barcode: undefined,
    companyId: companyId,
    avaliable: true,
    is_favorite: false,
    categoryId: undefined,
    //stock: undefined,
    //esto lo cambio hay que ponerle cuidad
    manage_stock : true,
    type: 'producto',
    stock_minimo: undefined
});

type Attribute = {
    key: string;
    value: string;
};

function CreateProductPanel() {

    const { company } = useAuth()
    const [product, setProduct] = useState<Product>(initialProductState(company?.id || 0));
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [areStock, setAreStock] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [attributes, setAttributes] = useState<Attribute[]>([{ key: '', value: '' }]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Lista de los campos que deben ser numéricos
        const numericFields = ['price_selling', 'price_cost', 'stock', 'stock_minimo'];
        if (numericFields.includes(name)) {
            // Si el valor está vacío, guardamos 'undefined'.
            // Si no, lo convertimos a número.
            const numValue = value === '' ? undefined : parseFloat(value);
            setProduct(prev => ({ ...prev, [name]: numValue }));
        } else {
            setProduct(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSelectChange = (field: keyof Product, value: string) => {
        setProduct(prev => ({ ...prev, [field]: value }));
    };

    const handleAttributeChange = (index: number, field: keyof Attribute, value: string) => {
        const newAttributes = [...attributes];
        newAttributes[index][field] = value;
        setAttributes(newAttributes);
    };

    const addAttribute = () => {
        setAttributes([...attributes, { key: '', value: '' }]);
    };

    const removeAttribute = (index: number) => {
        const newAttributes = attributes.filter((_, i) => i !== index);
        setAttributes(newAttributes);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            setPreviewUrl(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (product.price_cost > product.price_selling) {
            toast.error("El precio de costo no puede ser mayor al precio de venta.")
            return;
        }

        setIsSubmitting(true);


        const customAttributes = attributes.reduce((acc, attr) => {
            if (attr.key) { // Solo añade si la clave no está vacía
                acc[attr.key] = attr.value;
            }
            return acc;
        }, {} as { [key: string]: string });

        const cleanedProduct = {
            ...product,
            price_cost: Number(product.price_cost),
            detail: customAttributes,
            price_selling: Number(product.price_selling),
            //stock: product.stock !== undefined ? Number(product.stock) : undefined,
            stock_minimo: product.stock_minimo !== undefined ? Number(product.stock_minimo) : undefined,
            companyId: company?.id || 0,
        };

        try {
            await createProduct(cleanedProduct);
            // Resetea el formulario usando el estado inicial
            setProduct(initialProductState(company?.id || 0));

            // También reseteamos los otros estados del formulario
            setImageFile(null);
            setPreviewUrl(null);
            setAreStock(false);
            setAttributes([{ key: '', value: '' }]);

            //setListProduct(prevList => [...prevList, response])
        } catch (err) {
            //setError((err as Error).message)
        } finally {
            setIsSubmitting(false);

        }
    }

    const changeStock = () => {
        setAreStock(!areStock)
    }


    return (
        <div className=''>
            <form onSubmit={handleSubmit} className="space-y-2">
                <div className='flex w-full gap-2'>
                    <label className="relative cursor-pointer w-40 h-32 rounded-xl overflow-hidden border border-gray-300 shadow-md group hover:opacity-80 transition">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />

                        <div className="absolute h-full w-full bg-black bg-opacity-40 text-black text-center text-xs  transition">
                            {previewUrl ? (
                                <div>
                                    <img src={previewUrl as string} alt="preview" className="object-cover h-32 w-40" />
                                    <ImageIcon className="absolute top-0 p-8 text-black  w-full h-full opacity-40 hover:bg-white " size={20} />
                                </div>
                            ) : (
                                <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400 text-sm">
                                    Subir imagen
                                </div>
                            )}
                        </div>
                    </label>
                    <div className=' w-full flex flex-col gap-2'>
                        <div className='flex gap-2 h-9 items-center justify-between'>
                            <div className='flex gap-2'>
                                <label htmlFor="stock" className='text-sm font-medium'>¿Maneja Stock?</label>
                                <Switch id="airplane-mode" checked={areStock} onCheckedChange={changeStock} className='' />
                            </div>
                            <Input
                                name='stock'
                                placeholder="Cantidad"
                                value={0}
                                onChange={handleChange}
                                type="number"
                                className='w-1/2' // Opcional: puedes agregar estilos para cuando esté deshabilitado
                                disabled={!areStock} // <-- La clave está aquí
                            />
                        </div>

                        <Input
                            name="name"
                            placeholder="Nombre del producto"
                            onChange={handleChange}
                            value={product.name}
                            required
                        />

                        <div className="relative">
                            <Input
                                name="barcode"
                                placeholder="Código del producto"
                                value={product.barcode}
                                onChange={handleChange}
                                className="pr-10"
                            />
                            <ScanBarcode className="absolute right-2 top-2.5 text-gray-500 pointer-events-none r" size={20} />
                        </div>
                    </div>

                </div>

                <div className='flex w-full gap-2'>
                    <div className='w-full'>
                        <label htmlFor="price_cost" className='text-sm font-medium'>Pricio Costo</label>
                        <Input name='price_cost' placeholder="$0" value={product.price_cost} onChange={handleChange} type="number" className='' required />
                    </div>
                    <div className='w-full'>
                        <label htmlFor="price_selling" className='text-sm font-medium'>Pricio Venta</label>
                        <Input name='price_selling' placeholder="$0" value={product.price_selling} onChange={handleChange} type="number" className='' required />
                    </div>
                </div>
                <div>
                    <label htmlFor="description" className='text-sm font-medium'>Descripcion</label>
                    <Input name='description' type='' placeholder="Descripción del producto" value={product.description} onChange={handleChange} className='' />
                </div>

                <div className=' flex w-full gap-2'>
                    <div className='w-full'>
                        <label className='text-sm font-medium'>Tipo de Producto</label>
                        <select
                            name="type"
                            value={product.type}
                            onChange={(e) => handleSelectChange('type', e.target.value)}
                            className="w-full text-start p-2 text-sm bg-white border-2 rounded-md"
                        >
                            <option value="producto">Producto</option>
                            <option value="servicio">Servicio</option>
                            <option value="combo">Combo</option>
                        </select>
                    </div>
                    <div className='w-full'>
                        <label className='text-sm font-medium'>Unidad de Medida</label>
                        <select
                            name="unitOfMeasure"
                            /*value={product.unitOfMeasure}*/
                            /*onChange={(e) => handleSelectChange('unitOfMeasure', e.target.value)}*/
                            className="w-full text-start p-2 text-sm bg-white border-2 rounded-md"
                        >
                            <option value="unidad">Unidad (Un)</option>
                            <option value="kg">Kilogramo (Kg)</option>
                            <option value="g">Gramo (g)</option>
                            <option value="L">Litro (L)</option>
                            <option value="mL">Mililitro (mL)</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className='text-sm font-medium'>Atributos Personalizados</label>
                    {/* Contenedor principal con borde */}
                    <div className='rounded-md border p-3'>
                        <div className='max-h-40 space-y-2 overflow-y-auto pr-2'>
                            {attributes.map((attr, index) => (
                                <div key={index} className='flex items-center gap-2'>
                                    <Input
                                        placeholder="Atributo (ej. Color)"
                                        value={attr.key}
                                        onChange={(e) => handleAttributeChange(index, 'key', e.target.value)}
                                        className='flex-1'
                                    />
                                    <Input
                                        placeholder="Valor (ej. Rojo)"
                                        value={attr.value}
                                        onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                                        className='flex-1'
                                    />
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeAttribute(index)}>
                                        <XCircle className='h-5 w-5 text-red-500' />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        {/* Botón de añadir, ahora fuera de la zona de scroll */}
                        <Button
                            type="button"
                            variant="outline"
                            className='w-full mt-2' // Añadido margen superior
                            onClick={addAttribute}
                        >
                            <PlusCircle className='h-4 w-4 mr-2' />
                            Añadir Atributo
                        </Button>
                    </div>
                </div>


                <Button
                    variant="default"
                    type="submit"
                    className="w-full bg-green-600 text-white py-6 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Creando producto...' : 'Crear producto'}
                </Button>
            </form>

        </div>
    )
}

export default CreateProductPanel