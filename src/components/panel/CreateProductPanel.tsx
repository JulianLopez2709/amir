import { createProduct } from '@/api/product/getAllProductByCompany'
import { Input } from '../ui/input'
import Product from '@/@types/Product'
import { Button } from '../ui/button'
import { ScanBarcode } from 'lucide-react'
import { useState } from 'react'


type TypeProduct = "Combo" | "Producto" | "Servicio"

interface ProductCreate {
    type: TypeProduct,
    name: string,
    description: string,
    price_selling: number,
    price_cost: number,
    stock?: number,
    imgUrl?: string,
    barcode?: number,
    stock_minimo?: number,
    avaliable: boolean,
    is_favorite: boolean,
    categoryId?: number,
    companyId: number

    //"detail" ?: {},
    //"createAt": "2025-04-19T01:43:38.083Z",

}


function CreateProductPanel() {
    const [product, setProduct] = useState<ProductCreate>({ type: 'Producto', name: '', description: '', price_selling: 0, price_cost: 0, avaliable: true, is_favorite: false, companyId: 1 })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setProduct(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            if (!product) return
            const response = await createProduct(product)
            console.log(response)
            //setListProduct(prevList => [...prevList, response])
        } catch (err) {
            console.log(err)
            //setError((err as Error).message)
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    name="name"
                    placeholder="Nombre del producto"
                    onChange={handleChange}
                    value={product.name}
                />

                <div className="relative">
                    <Input
                        name="code"
                        placeholder="Código del producto"
                        value={product.barcode}
                        onChange={handleChange}
                        className="pr-10"
                    />
                    <ScanBarcode className="absolute right-2 top-2.5 text-gray-500 pointer-events-none" size={20} />
                </div>

                <Input name='descripton' placeholder="Descripción del producto" value={product.description} onChange={handleChange}  className=''/>

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
                >
                    Crear producto
                </button>
            </form>

        </div>
    )
}

export default CreateProductPanel