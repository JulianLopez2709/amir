import { createProduct } from '@/api/product/getAllProductByCompany'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { ImageIcon, PlusCircle, ScanBarcode, XCircle } from 'lucide-react'
import { isValidElement, useState } from 'react'
import { Switch } from '../ui/switch'
import Product from '@/@types/Product'
import { toast } from 'sonner'
import { useAuth } from '@/context/AuthContext'
import { ScrollArea } from '../ui/scroll-area'
import { CreateProductPayload } from '@/@types/order/api/CreateProduct'

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
    manage_stock: true,
    type: 'producto',
    stock_minimo: 1,
    unit: 'unidad', // ✅ DEFAULT
});

type Attribute = {
    key: string;
    value: string;
};

type VariantOption = {
    name: string
    extraPrice: number
}

type Variant = {
    name: string            // Ej: Color, Talla
    options: VariantOption[] // Ej: Azul, Rojo
}


function CreateProductPanel() {

    const { company } = useAuth()
    const [product, setProduct] = useState<Product>(initialProductState(company?.id || 0));
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [areStock, setAreStock] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [variants, setVariants] = useState<Variant[]>([])

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

    const handleVariantNameChange = (index: number, value: string) => {
        const copy = [...variants]
        copy[index].name = value
        setVariants(copy)
    }

    const handleOptionChange = (
        variantIndex: number,
        optionIndex: number,
        field: "name" | "extraPrice",
        value: string | number
    ) => {
        const copy = [...variants]
        // @ts-ignore
        copy[variantIndex].options[optionIndex][field] = value
        setVariants(copy)

        // 🔥 Auto crear input vacío
        if (
            field === "name" &&
            value !== "" &&
            optionIndex === copy[variantIndex].options.length - 1
        ) {
            copy[variantIndex].options.push({ name: "", extraPrice: 0 })
            setVariants([...copy])
        }
    }

    const addVariant = () => {
        setVariants([
            ...variants,
            { name: "", options: [{ name: "", extraPrice: 0 }] }
        ])
    }

    const removeVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index))
    }

    const buildVariantsPayload = () => {
        return variants
            .filter(v => v.name.trim() !== "")
            .map(v => ({
                name: v.name,
                type: "select",
                options: v.options
                    .filter(o => o.name.trim() !== "")
                    .map(o => ({
                        name: o.name,
                        extraPrice: Number(o.extraPrice) || 0
                    }))
            }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        setIsSubmitting(true)

        try {
            const formData = new FormData()

            // 📌 Campos normales
            formData.append("name", product.name)
            if (product.description) formData.append("description", product.description)
            formData.append("companyId", String(company?.id || 0))
            formData.append("type", "producto")
            formData.append("unit", product.unit ?? "unidad")
            if (product.barcode) formData.append("barcode", String(product.barcode))
            formData.append("price_cost", String(product.price_cost))
            formData.append("price_selling", String(product.price_selling))
            formData.append("stock", String(product.stock_minimo))
            formData.append("available", "true")

            // 📌 Variantes
            formData.append("variants", JSON.stringify(buildVariantsPayload()))

            // 📌 IMAGEN (CLAVE)
            if (imageFile) {
                formData.append("image", imageFile) // 🔥 ESTE NOMBRE DEBE COINCIDIR
            }
            
            await createProduct(formData)

            toast.success("Producto creado correctamente")

            // reset
            setProduct(initialProductState(company?.id || 0))
            setVariants([])
            setImageFile(null)
            setPreviewUrl(null)

        } catch (error) {
            toast.error("Error al crear el producto")
        } finally {
            setIsSubmitting(false)
        }
    }

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

    /*const handleSubmit = async (e: React.FormEvent) => {
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
    }*/

    return (
        <div className=''>
            <form onSubmit={handleSubmit} className="space-y-2">
                <div className='flex w-full gap-2'>
                    <div className="flex flex-col items-center gap-1">
                        <label className="relative cursor-pointer w-40 h-40 rounded-xl overflow-hidden border border-gray-300 shadow-md group">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />

                            {/* Imagen o placeholder */}
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400 text-sm">
                                    Subir imagen
                                </div>
                            )}

                            {/* Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
                                <ImageIcon className="text-white" size={32} />
                            </div>
                        </label>

                        <p className="text-center text-xs text-gray-500">
                            PNG, JPG · Máx 25MB
                        </p>
                    </div>


                    <div className=' w-full flex flex-col gap-2'>
                        <div className='w-full'>
                            {/*<div className='flex gap-2'>
                                <label htmlFor="stock" className='text-sm font-medium'>¿Maneja Stock?</label>
                                <Switch id="airplane-mode" checked={areStock} onCheckedChange={changeStock} className='' />
                            </div>*/}
                            <label htmlFor="stock_minimo" className="text-sm font-medium">
                                Cantidad
                            </label>
                            <Input
                                name="stock_minimo"
                                placeholder="Cantidad"
                                type="number"
                                min={1}
                                value={product.stock_minimo}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="w-full">
                            <label htmlFor="name" className="text-sm font-medium">
                                Nombre del producto
                            </label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Nombre del producto"
                                onChange={handleChange}
                                value={product.name}
                                required
                            />
                        </div>

                        <div className="w-full relative">
                            <label htmlFor="barcode" className="text-sm font-medium">
                                Código del producto
                            </label>
                            <Input
                                id="barcode"
                                name="barcode"
                                placeholder="Código del producto"
                                value={product.barcode}
                                onChange={handleChange}
                                className="pr-10"
                            />
                            <ScanBarcode className="absolute right-2 top-9 text-gray-500 pointer-events-none" size={20} />
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
                {/**
                 * Atributos personalizados variantes y sus opciones
                 */}
                <div>
                    {/* Contenedor principal con borde */}
                    <div className="rounded-md border p-3 space-y-3">
                        <h3 className="font-medium">Atributos Personalizados</h3>
                        <p className="text-sm text-gray-500">
                            Si tu producto tiene variaciones de color, tamaño, etc.
                        </p>
                        <ScrollArea className=' flex flex-col gap-2 max-h-80 mb-1'>
                            <div className='flex flex-col gap-1'>

                                {variants.map((variant, vIndex) => (
                                    <div key={vIndex} className="border rounded-md p-3 space-y-2">

                                        {/* Nombre de variante */}
                                        <Input
                                            placeholder="Nombre de la opción (ej: Color)"
                                            value={variant.name}
                                            onChange={(e) =>
                                                handleVariantNameChange(vIndex, e.target.value)
                                            }
                                        />

                                        {/* Opciones */}
                                        <div className="space-y-2">
                                            {variant.options.map((opt, oIndex) => (
                                                <div key={oIndex} className="flex gap-2">
                                                    <Input
                                                        placeholder="Valor (ej: Azul)"
                                                        value={opt.name}
                                                        onChange={(e) =>
                                                            handleOptionChange(vIndex, oIndex, "name", e.target.value)
                                                        }
                                                    />
                                                    <Input
                                                        type="number"
                                                        placeholder="$ Extra"
                                                        value={opt.extraPrice}
                                                        onChange={(e) =>
                                                            handleOptionChange(
                                                                vIndex,
                                                                oIndex,
                                                                "extraPrice",
                                                                Number(e.target.value)
                                                            )
                                                        }
                                                        className="w-32"
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Eliminar variante */}
                                        <Button
                                            variant="outline"
                                            className="text-red-600"
                                            onClick={() => removeVariant(vIndex)}
                                        >
                                            Eliminar
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        {/* Agregar variante */}
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={addVariant}
                        >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Agregar otra opción
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