import { useState } from 'react'
import { Button } from '../ui/button'
import Product from "@/@types/Product";
import { BoxesIcon } from 'lucide-react';
import { Separator } from '../ui/separator';
import { ProductOption, ProductSnapshot, ProductToOrder, SelectedVariant } from '@/@types/Order';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Trash2, PlusSquare, Pencil } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { addedStock } from '@/api/product/StockProduct';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'


type CardProductProps = {
    product: Product;
    addClick: (product: ProductToOrder) => void;
    editClick: () => void;
}


function CardProduct({ product, addClick, editClick }: CardProductProps) {
    const [count, setCount] = useState(1)
    const [selectedOptions, setSelectedOptions] = useState<SelectedVariant[]>([])
    const [expandedVariants, setExpandedVariants] = useState<Record<string, boolean>>({})

    const generateId = (id: string) => {
        const newId = String(id).split("-")[0]
        return newId
    }


    const [openStockDialog, setOpenStockDialog] = useState(false)

    const [stockForm, setStockForm] = useState({
        quantityChange: 0,
        manage_stock: product.manage_stock ?? false,
        //allow_out_of_stock: product.allow_out_of_stock ?? false,
    })

    const handleAddStock = async () => {
        if (stockForm.quantityChange <= 0) return;

        try {
            await addedStock(
                product.id!,
                stockForm.quantityChange
            );

            // 🔥 cerrar modal
            setOpenStockDialog(false);

            // 🔄 reset del formulario
            setStockForm(prev => ({
                ...prev,
                quantityChange: 0,
            }));

            // ⚠️ aquí luego podemos refrescar el producto
        } catch (error) {
            console.error("❌ Error ajustando stock:", error);
        }
    };

    const MAX_VISIBLE_OPTIONS = 6

    const getVariantKey = (variantName: string, variantId?: number) =>
        `${variantId ?? variantName}-${variantName}`


    const toggleOption = (variant: any, option: any) => {
        setSelectedOptions(prev => {
            const variantIndex = prev.findIndex(
                v => v.variantName === variant.name
            )

            // 🟢 Variante NO existe
            if (variantIndex === -1) {
                return [
                    ...prev,
                    {
                        variantName: variant.name,
                        options: [
                            {
                                optionId: option.id,
                                name: option.name,
                                extraPrice: option.extraPrice
                            }
                        ]
                    }
                ]
            }

            const variantItem = prev[variantIndex]
            const optionExists = variantItem.options.some(
                o => o.optionId === option.id
            )

            // 🔁 Quitar opción
            if (optionExists) {
                const newOptions = variantItem.options.filter(
                    o => o.optionId !== option.id
                )

                // si se queda sin opciones → quitar variante
                if (newOptions.length === 0) {
                    return prev.filter((_, i) => i !== variantIndex)
                }

                return prev.map((v, i) =>
                    i === variantIndex
                        ? { ...v, options: newOptions }
                        : v
                )
            }

            // ➕ Agregar opción
            return prev.map((v, i) =>
                i === variantIndex
                    ? {
                        ...v,
                        options: [
                            ...v.options,
                            {
                                optionId: option.id,
                                name: option.name,
                                extraPrice: option.extraPrice
                            }
                        ]
                    }
                    : v
            )
        })
    }



    const mapSelectedVariantsToProductOptions = (
        selected: SelectedVariant[]
    ): ProductOption[] => {
        return selected.flatMap(variant =>
            variant.options.map(option => ({
                optionId: option.optionId,
                variantId: 0!, // ⚠️ si no tienes el id, luego lo ajustamos
                extraPrice: option.extraPrice,
                optionName: option.name,
                variantName: variant.variantName
            }))
        )
    }


    const mapProductToSnapshot = (product: Product): ProductSnapshot => {
        return {
            id: product.id!,
            name: product.name,
            price: product.price_selling,
            price_selling: product.price_selling,
            quantity: count,
            img: product.imgUrl,
            description: product.description,
            imgUrl: product.imgUrl,
            optionsSelected: mapSelectedVariantsToProductOptions(selectedOptions)
        }
    }



    return (
        <div className="bg-white rounded-2xl flex flex-col h-fit w-full overflow-hidden border-2 border-gray-200 shadow" >
            <div className='h-full flex flex-col'>

                <div className=" relative h-48  w-full bg-gray-100 flex items-center justify-center">
                    <div className="relative h-48 w-full bg-gray-100 overflow-hidden flex items-center justify-center">
                        {product.imgUrl ? (
                            <img
                                src={product.imgUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <BoxesIcon className="text-gray-400 size-10" />
                        )}
                    </div>

                    <div className="absolute top-2 right-2 z-10">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="w-7 h-7 flex items-center justify-center rounded-sm bg-white border hover:bg-gray-100">
                                    <MoreVertical size={16} />
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-44">

                                <DropdownMenuItem
                                    onClick={() => {
                                        setOpenStockDialog(true)
                                    }}
                                >
                                    <PlusSquare className="mr-2 h-4 w-4" />
                                    Agregar stock
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => {
                                        editClick()
                                    }}
                                >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Editar producto
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    className="text-red-600 focus:text-red-600"
                                    onClick={() => {
                                        console.log("Eliminar producto", product.id)
                                    }}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Eliminar
                                </DropdownMenuItem>

                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                </div>
                <div className='p-2'>

                    <div className="flex justify-between items-center gap-2">
                        <p className="text-sm ">card id : {generateId(product.id!)}</p>
                        <p className="text-sm opacity-70 text-gray-400">{product.barcode}</p>
                    </div>
                    <p className="font-bold">
                        {product.name}
                    </p>
                    <p className="text-sm text-gray-500 flex-1">
                        {product.description}
                    </p>
                    <div className="flex justify-between items-end esw">
                        <div className=''>
                            <p className='font-bold'>Precio</p>
                            <p className="font-bold text-xl" style={{ color: 'var(--primary-color)' }}>
                                <span className="text-sm" >$</span>{product.price_selling}
                            </p>
                        </div>
                        {
                            product.manage_stock === true && (
                                <div className='flex flex-col justify-center items-center '>
                                    <p>Disponible</p>
                                    <p className="" style={{ color: 'var(--primary-color)' }}>
                                        {product.stock_records?.quantity} Unidades
                                    </p>
                                </div>
                            )
                        }
                    </div>
                    <Separator className='mb-1' />
                    <div className="space-y-2 ">
                        {product.variants?.map((v) => {
                            const variantKey = getVariantKey(v.name, v.id)

                            const selectedVariant =
                                selectedOptions.find(
                                    sv => sv.variantName === v.name
                                )

                            return (
                                <Collapsible
                                    key={variantKey}
                                    className="border rounded-lg overflow-hidden bg-gray-50"
                                >
                                    <CollapsibleTrigger className="w-full">
                                        <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-100 transition">

                                            {/* LEFT */}
                                            <div className="text-left">
                                                <p className="font-semibold text-sm">
                                                    {v.name}
                                                </p>

                                                <p className="text-xs text-gray-500">
                                                    {selectedVariant?.options?.length
                                                        ? selectedVariant.options
                                                            .map(o => o.name)
                                                            .join(", ")
                                                        : "Seleccionar opción"}
                                                </p>
                                            </div>

                                            {/* RIGHT */}
                                            <div className="text-xs">
                                                {v.options.length} opciones
                                            </div>

                                        </div>
                                    </CollapsibleTrigger>

                                    <CollapsibleContent>
                                        <div className="p-3 border-t bg-white">

                                            <div className="flex flex-wrap gap-2">

                                                {v.options.map((opc) => {

                                                    const selected =
                                                        selectedOptions
                                                            .find(
                                                                sv => sv.variantName === v.name
                                                            )
                                                            ?.options.some(
                                                                o => o.optionId === opc.id
                                                            ) || false

                                                    return (
                                                        <button
                                                            key={opc.id}
                                                            type="button"
                                                            onClick={() =>
                                                                toggleOption(v, opc)
                                                            }
                                                            className={`
                      px-3 py-2 rounded-xl border text-sm transition-all
                      ${selected
                                                                    ? "bg-black text-white border-black shadow-sm"
                                                                    : "bg-white hover:bg-gray-100 border-gray-200"
                                                                }
                    `}
                                                        >
                                                            <div className="flex items-center gap-1">

                                                                <span>
                                                                    {opc.name}
                                                                </span>

                                                                {opc.extraPrice > 0 && (
                                                                    <span className="text-xs opacity-70">
                                                                        +${opc.extraPrice}
                                                                    </span>
                                                                )}

                                                            </div>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                            )
                        })}
                    </div>

                    {
                        product.manage_stock != undefined /*&& /*product..quantity > 0*/ ? (
                            <div className="md:flex w-full items-center justify-between gap-1">
                                <div className="mb-1 md:mb-0 flex flex-1 justify-between items-center rounded-sm gap-2 font-bold p-1 w-full" style={{ background: 'var(--primary-color)' }}>
                                    <p className=" p1 px-2 md:px-3 bg-white rounded-sm cursor-pointer" onClick={() => setCount((acount) => acount > 1 ? acount - 1 : acount)}>-</p>
                                    <p className="">{count}</p>
                                    <p className=" p1 px-2 md:px-3 bg-white rounded-sm cursor-pointer" onClick={() => setCount((acount) => acount + 1)}>+</p>
                                </div>
                                <Button className="flex-2 cursor-pointer w-full" style={{ background: 'var(--primary-color)' }} variant="default" onClick={() =>
                                    addClick({
                                        product: mapProductToSnapshot(product),
                                        quantity: count,
                                        notes: undefined,
                                        selectedOptions
                                    })
                                }
                                >
                                    <p className='text-sm'>
                                        Agregar al carrito
                                    </p>
                                </Button>
                            </div>
                        ) : (
                            <div className="flex justify-center items-center bg-red-500  p-1 rounded-sm font-bold ">
                                <p className="text-sm text-white">Sin stock</p>
                            </div>
                        )
                    }
                </div>

            </div >
            {
                /*
                                <div className='flex items-center justify-center p-3 bg-blue-950 w-full h-auto font-bold cursor-pointer gap-3 text-white' onClick={editClick}>
                                <Edit3/>
                                <p>Editar Producto</p>
                            </div>
                            */
            }

            {/**
             * Ajuste del producto
             * agregar stock
             */}
            <Dialog open={openStockDialog} onOpenChange={setOpenStockDialog}>
                <DialogContent className="sm:max-w-[420px]">
                    <DialogHeader>
                        <DialogTitle>Ajustes de stock</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">

                        {/* Cantidad disponible */}
                        {/* Stock actual */}
                        <div className="flex justify-between items-center bg-gray-100 p-2 rounded">
                            <p className="text-sm font-medium">Stock actual</p>
                            <p className="font-bold">
                                {product.stock_records?.quantity ?? 0} unidades
                            </p>
                        </div>

                        {/* Cantidad a agregar */}
                        <div className="space-y-2">
                            <p className="text-sm font-medium">
                                Cantidad a agregar
                            </p>
                            <Input
                                type="number"
                                min={1}
                                value={stockForm.quantityChange}
                                onChange={(e) =>
                                    setStockForm({
                                        ...stockForm,
                                        quantityChange: Number(e.target.value),
                                    })
                                }
                                placeholder="Ej: 10"
                            />
                            <p className="text-xs text-gray-500">
                                Esta cantidad se sumará al stock actual
                            </p>
                        </div>

                        {/* Switch: seguimiento }
                        <div className="flex items-center justify-between">
                            <p>Hacer seguimiento de cantidad</p>
                            <Switch
                                checked={stockForm.manage_stock}
                                onCheckedChange={(value) =>
                                    setStockForm({
                                        ...stockForm,
                                        manage_stock: value,
                                    })
                                }
                            />
                        </div>

                        {/* Switch: permitir sin stock }
                        <div className="flex items-center justify-between">
                            <p>Permitir compra cuando esté agotado</p>
                            <Switch
                                checked={true}
                                onCheckedChange={(value) =>
                                    setStockForm({
                                        ...stockForm,
                                        //allow_out_of_stock: value,
                                    })
                                }
                                disabled={!stockForm.manage_stock}
                            />
                        </div>
                        {   Switch: permitir sin stock */}
                    </div>

                    <DialogFooter className="mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setOpenStockDialog(false)}
                        >
                            Cancelar
                        </Button>
                        <Button onClick={handleAddStock}>
                            Guardar cambios
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    )
}



export default CardProduct