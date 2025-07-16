import { createProduct } from '@/api/product/getAllProductByCompany'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { ImageIcon, ScanBarcode } from 'lucide-react'
import { useState } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@radix-ui/react-select'
import { Switch } from '../ui/switch'
import Product from '@/@types/Product'
import { toast } from 'sonner'
import { useAuth } from '@/context/AuthContext'

const initialProductState = (companyId: number): Product => ({
    name: '',
    description: '',
    price_selling: 0,
    price_cost: 0,
    barcode: undefined,
    companyId: companyId,
    avaliable: true,
    is_favorite: false,
    categoryId: undefined,
    stock: undefined,
    stock_minimo: undefined
});

function CreateProductPanel() {

    const { company } = useAuth()
    const [product, setProduct] = useState<Product>(initialProductState(company?.id || 0));
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [areStock, setAreStock] = useState(false)

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

        const cleanedProduct = {
            ...product,
            price_cost: Number(product.price_cost),
            price_selling: Number(product.price_selling),
            stock: product.stock !== undefined ? Number(product.stock) : undefined,
            stock_minimo: product.stock_minimo !== undefined ? Number(product.stock_minimo) : undefined,
            companyId: company?.id || 0,
        };
        try {
            console.log('product new reset', cleanedProduct)
            const res = await createProduct(cleanedProduct);
            console.log('responde api ', res)
            // Resetea el formulario usando el estado inicial
            setProduct(initialProductState(company?.id || 0));

            // También reseteamos los otros estados del formulario
            setImageFile(null);
            setPreviewUrl(null);
            setAreStock(false);

            //setListProduct(prevList => [...prevList, response])
        } catch (err) {
            //setError((err as Error).message)
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
                                <label htmlFor="stock" className='text-sm'>¿Maneja Stock?</label>
                                <Switch id="airplane-mode" checked={areStock} onCheckedChange={changeStock} className='' />
                            </div>
                            {
                                areStock ? (
                                    <Input name='stock' placeholder="Cantidad" value={product.stock} onChange={handleChange} type="number" className='w-1/2' />
                                ) : (null)
                            }
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
                        <label htmlFor="price_cost" className='text-sm'>Pricio Costo</label>
                        <Input name='price_cost' placeholder="$0" value={product.price_cost} onChange={handleChange} type="number" className='' required />
                    </div>
                    <div className='w-full'>
                        <label htmlFor="price_selling" className='text-sm'>Pricio Venta</label>
                        <Input name='price_selling' placeholder="$0" value={product.price_selling} onChange={handleChange} type="number" className='' required />
                    </div>
                </div>
                <div>
                    <label htmlFor="description" className='text-sm'>Descripcion</label>
                    <Input name='description' type='' placeholder="Descripción del producto" value={product.description} onChange={handleChange} className='' required />
                </div>

                <div className='w-full '>
                    <Select>
                        <SelectTrigger className="w-full text-start p-2 text-sm bg-white border-2 rounded-md">
                            <SelectValue placeholder="tipo de Producto" />
                        </SelectTrigger>
                        <SelectContent className='bg-white p-2 border-2 rounded-md w-lg'>
                            <SelectGroup className='w-full'>
                                <SelectLabel className='w-full bg-black rounded-sm text-white text-center'>Tipos</SelectLabel>
                                <SelectItem value="combo" className="w-full block">combo</SelectItem>
                                <SelectItem value="producto" className="w-full block">producto</SelectItem>
                                <SelectItem value="servicio" className="w-full block">servicio</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>


                <Button
                    variant="default"
                    type="submit"
                    className="w-full bg-green-600 text-white py-6 rounded-md hover:bg-green-700"
                >
                    Crear producto
                </Button>
            </form>

        </div>
    )
}

export default CreateProductPanel