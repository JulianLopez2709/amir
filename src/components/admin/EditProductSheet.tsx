import { useEffect, useState } from 'react'
import Product from '@/@types/Product'
import { updateProduct } from '@/api/product/getAllProductByCompany'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ImageIcon, Store, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'

type VariantOptionForm = {
  id?: number
  name: string
  extraPrice: number
}

type VariantForm = {
  id?: number
  name: string
  options: VariantOptionForm[]
  useImage: boolean
}

type ProductFormState = {
  name: string
  description: string
  barcode: string
  price_cost: number
  price_selling: number
  price_before_tax: number
  stock_minimo: number
  unit: string
  type: string
  manage_stock: boolean
}

const VARIANT_TYPE_PRESETS = [
  'Color',
  'Talla',
  'Tamaño',
  'Material',
  'Capacidad',
  'SSD Size',
  'RAM',
  'Sabor',
  'Otro',
]

type Props = {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved?: () => void
}

function mapProductToForm(product: Product): ProductFormState {
  return {
    name: product.name ?? '',
    description: product.description ?? '',
    barcode: product.barcode != null ? String(product.barcode) : '',
    price_cost: product.price_cost ?? 0,
    price_selling: product.price_selling ?? 0,
    price_before_tax: product.price_before_tax ?? 0,
    stock_minimo: product.stock_minimo ?? product.stock_records?.quantity ?? 1,
    unit: product.unit ?? 'unidad',
    type: product.type ?? 'producto',
    manage_stock: product.manage_stock ?? true,
  }
}

function mapProductVariants(product: Product): VariantForm[] {
  if (!product.variants?.length) return []
  return product.variants.map((variant) => ({
    id: variant.id,
    name: variant.name,
    useImage: false,
    options: variant.options.map((option) => ({
      id: option.id,
      name: option.name,
      extraPrice: option.extraPrice ?? 0,
    })),
  }))
}

function calculateBasePrice(finalPrice: number, iva: number, icui: number) {
  const totalTaxPercent = iva + icui
  return Number((finalPrice / (1 + totalTaxPercent / 100)).toFixed(2))
}

export default function EditProductSheet({ product, open, onOpenChange, onSaved }: Props) {
  const { company } = useAuth()
  const [form, setForm] = useState<ProductFormState | null>(null)
  const [variants, setVariants] = useState<VariantForm[]>([])
  const [ivaPercent, setIvaPercent] = useState(19)
  const [icuiPercent, setIcuiPercent] = useState(0)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [optionDrafts, setOptionDrafts] = useState<Record<number, string>>({})

  useEffect(() => {
    if (!product || !open) return
    setForm(mapProductToForm(product))
    setVariants(mapProductVariants(product))
    setIvaPercent(product.iva_percent ?? 19)
    setIcuiPercent(product.icui_percent ?? 0)
    setImageFile(null)
    setPreviewUrl(product.imgUrl ?? null)
    setOptionDrafts({})
  }, [product, open])

  useEffect(() => {
    setForm((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        price_before_tax: calculateBasePrice(
          Number(prev.price_selling || 0),
          ivaPercent,
          icuiPercent
        ),
      }
    })
  }, [ivaPercent, icuiPercent])

  const handleFormChange = (field: keyof ProductFormState, value: string | number | boolean) => {
    setForm((prev) => {
      if (!prev) return prev
      const next = { ...prev, [field]: value }
      if (field === 'price_selling') {
        next.price_before_tax = calculateBasePrice(Number(value) || 0, ivaPercent, icuiPercent)
      }
      return next
    })
  }

  const addVariant = () => {
    setVariants((prev) => [...prev, { name: '', options: [], useImage: false }])
  }

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index))
  }

  const updateVariantName = (index: number, name: string) => {
    setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, name } : v)))
  }

  const addOptionToVariant = (variantIndex: number, rawName: string) => {
    const name = rawName.trim()
    if (!name) return
    setVariants((prev) =>
      prev.map((v, i) => {
        if (i !== variantIndex) return v
        if (v.options.some((o) => o.name.toLowerCase() === name.toLowerCase())) return v
        return {
          ...v,
          options: [...v.options, { name, extraPrice: 0 }],
        }
      })
    )
    setOptionDrafts((prev) => ({ ...prev, [variantIndex]: '' }))
  }

  const removeOption = (variantIndex: number, optionIndex: number) => {
    setVariants((prev) =>
      prev.map((v, i) =>
        i === variantIndex
          ? { ...v, options: v.options.filter((_, oi) => oi !== optionIndex) }
          : v
      )
    )
  }

  const updateOptionExtraPrice = (variantIndex: number, optionIndex: number, extraPrice: number) => {
    setVariants((prev) =>
      prev.map((v, vi) =>
        vi === variantIndex
          ? {
            ...v,
            options: v.options.map((o, oi) =>
              oi === optionIndex ? { ...o, extraPrice } : o
            ),
          }
          : v
      )
    )
  }

  const buildVariantsPayload = () =>
    variants
      .filter((v) => v.name.trim())
      .map((v) => ({
        ...(v.id ? { id: v.id } : {}),
        name: v.name,
        type: 'select',
        options: v.options
          .filter((o) => o.name.trim())
          .map((o) => ({
            ...(o.id ? { id: o.id } : {}),
            name: o.name,
            extraPrice: Number(o.extraPrice) || 0,
          })),
      }))

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    if (!product?.id || !form) return
    if (!form.name.trim()) {
      toast.error('El nombre del producto es obligatorio')
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('name', form.name.trim())
      if (form.description) formData.append('description', form.description)
      formData.append('companyId', String(company?.id ?? product.companyId))
      formData.append('type', form.type)
      formData.append('unit', form.unit)
      if (form.barcode) formData.append('barcode', form.barcode)
      formData.append('price_cost', String(form.price_cost))
      formData.append('price_selling', String(form.price_selling))
      formData.append(
        'price_before_tax',
        String(calculateBasePrice(form.price_selling, ivaPercent, icuiPercent))
      )
      formData.append('iva_percent', String(ivaPercent))
      formData.append('icui_percent', String(icuiPercent))
      formData.append('stock', String(form.stock_minimo))
      formData.append('manage_stock', String(form.manage_stock))
      formData.append('available', String(product.avaliable ?? true))
      formData.append('variants', JSON.stringify(buildVariantsPayload()))
      if (imageFile) formData.append('image', imageFile)

      await updateProduct(product.id, formData)
      toast.success('Producto actualizado correctamente')
      onOpenChange(false)
      onSaved?.()
    } catch {
      toast.error('No se pudo actualizar el producto')
    } finally {
      setIsSubmitting(false)
    }
  }

  const metadataItems = form && product ? [
    { label: 'Categoría', value: form.type },
    { label: 'Canal', value: company?.name ?? '—', icon: true as const },
    { label: 'Unidad', value: form.unit },
    { label: 'Código', value: form.barcode || '—' },
    {
      label: 'Stock',
      value: form.manage_stock
        ? `${product.stock_records?.quantity ?? 0} uds`
        : 'Sin seguimiento',
    },
    { label: 'IVA', value: `${ivaPercent}%` },
  ] : []

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        hideClose
        overlayClassName="bg-black/70"
        className="flex h-full w-full max-w-full flex-col gap-0 border-l p-0 sm:max-w-[min(100vw,720px)] md:w-[720px]"
      >
        <div className="shrink-0 border-b px-4 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-3">
            <SheetHeader className="space-y-1 p-0 text-left">
              <SheetTitle className="text-lg font-semibold">Editar producto</SheetTitle>
              <SheetDescription className="sr-only">
                Modifica el detalle y las variantes del producto
              </SheetDescription>
            </SheetHeader>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {!product || !form ? (
          <div className="flex flex-1 items-center justify-center p-8 text-sm text-gray-500">
            Cargando producto...
          </div>
        ) : (
          <>
            <ScrollArea className="min-h-0 flex-1">
              <div className="space-y-6 px-4 py-5 sm:px-6">
                <section className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900">Detalle del producto</h3>

                  <div className="flex flex-col gap-4 sm:flex-row">
                    <label className="relative h-24 w-24 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      {previewUrl ? (
                        <img src={previewUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-400">
                          <ImageIcon className="h-8 w-8" />
                        </div>
                      )}
                    </label>

                    <div className="min-w-0 flex-1 space-y-3">
                      <div>
                        <label className="text-xs font-medium text-gray-600">Nombre</label>
                        <Input
                          value={form.name}
                          onChange={(e) => handleFormChange('name', e.target.value)}
                          className="mt-1 h-9"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600">Descripción</label>
                        <Input
                          value={form.description}
                          onChange={(e) => handleFormChange('description', e.target.value)}
                          className="mt-1 h-9"
                          placeholder="Descripción del producto"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <div className="grid grid-cols-2 divide-x divide-y border-gray-200 sm:grid-cols-3">
                      {metadataItems.map((item) => (
                        <div key={item.label} className="bg-gray-50/80 px-3 py-2.5">
                          <p className="text-[10px] font-medium uppercase tracking-wide text-gray-500">
                            {item.label}
                          </p>
                          <p className="mt-0.5 flex items-center gap-1 truncate text-sm font-medium text-gray-900">
                            {'icon' in item && item.icon && (
                              <Store className="h-3.5 w-3.5 shrink-0 text-gray-500" />
                            )}
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <div>
                      <label className="text-xs font-medium text-gray-600">Precio costo</label>
                      <Input
                        type="number"
                        value={form.price_cost}
                        onChange={(e) => handleFormChange('price_cost', Number(e.target.value))}
                        className="mt-1 h-9"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Precio venta</label>
                      <Input
                        type="number"
                        value={form.price_selling}
                        onChange={(e) => handleFormChange('price_selling', Number(e.target.value))}
                        className="mt-1 h-9"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Código barras</label>
                      <Input
                        value={form.barcode}
                        onChange={(e) => handleFormChange('barcode', e.target.value)}
                        className="mt-1 h-9"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">IVA (%)</label>
                      <Input
                        type="number"
                        value={ivaPercent}
                        onChange={(e) => setIvaPercent(Number(e.target.value))}
                        className="mt-1 h-9"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">ICUI (%)</label>
                      <Input
                        type="number"
                        value={icuiPercent}
                        onChange={(e) => setIcuiPercent(Number(e.target.value))}
                        className="mt-1 h-9"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Cantidad mínima</label>
                      <Input
                        type="number"
                        min={0}
                        value={form.stock_minimo}
                        onChange={(e) => handleFormChange('stock_minimo', Number(e.target.value))}
                        className="mt-1 h-9"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Precio antes de IVA</label>
                      <Input
                        type="number"
                        value={form.price_before_tax}
                        className="mt-1 h-9"
                        disabled
                      />
                    </div>
                  </div>
                </section>

                <section className="relative space-y-3 pointer-events-none">

                  <div className="absolute inset-0 z-10 flex top-20 justify-center h-44 p-2 ">
                    <div className="bg-white/90 backdrop-blur rounded-xl border shadow-lg p-8 max-w-sm text-center">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Configuración en mantenimiento
                      </h3>

                      <p className="text-sm text-gray-600 mb-4">
                        Estamos trabajando para mejorar esta sección.
                        Vuelve pronto para ver las novedades.
                      </p>

                      <div className="text-xs text-gray-400">
                        🚧 Próximamente
                      </div>
                    </div>
                  </div>
                  <div className="blur-sm pointer-events-none">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900">Variante</h3>
                      <button
                        type="button"
                        onClick={addVariant}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        + Agregar variante
                      </button>
                    </div>

                    {variants.length === 0 && (
                      <p className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
                        Sin variantes. Agrega una si el producto tiene opciones como color o talla.
                      </p>
                    )}

                    {variants.map((variant, variantIndex) => (
                      <div
                        key={variant.id ?? `new-${variantIndex}`}
                        className="relative rounded-xl border border-gray-200 bg-white p-4 shadow-sm "
                      >

                        <div className="mb-3 flex items-center justify-between">
                          <p className="text-sm font-semibold text-gray-900">
                            Variante {variantIndex + 1}
                          </p>
                          <button
                            type="button"
                            onClick={() => removeVariant(variantIndex)}
                            className="rounded-md p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
                            aria-label="Eliminar variante"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid gap-4">
                          <div>
                            <label className="text-xs font-medium text-gray-600">Tipo de variante</label>
                            <Select
                              value={
                                VARIANT_TYPE_PRESETS.includes(variant.name)
                                  ? variant.name
                                  : variant.name
                                    ? 'Otro'
                                    : undefined
                              }
                              onValueChange={(value) =>
                                updateVariantName(variantIndex, value === 'Otro' ? '' : value)
                              }
                            >
                              <SelectTrigger className="mt-1 h-9 w-full">
                                <SelectValue placeholder="Seleccionar tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                {VARIANT_TYPE_PRESETS.map((preset) => (
                                  <SelectItem key={preset} value={preset}>
                                    {preset}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {(!VARIANT_TYPE_PRESETS.includes(variant.name) || variant.name === '') && (
                              <Input
                                className="mt-2 h-9"
                                placeholder="Tipo personalizado"
                                value={variant.name}
                                onChange={(e) => updateVariantName(variantIndex, e.target.value)}
                              />
                            )}
                          </div>

                          <div>
                            <label className="text-xs font-medium text-gray-600">Valor de variante</label>
                            <div className="mt-1 flex min-h-9 flex-wrap gap-1.5 rounded-md border border-gray-200 bg-white p-2">
                              {variant.options.map((option, optionIndex) => (
                                <span
                                  key={option.id ?? `${option.name}-${optionIndex}`}
                                  className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800"
                                >
                                  {option.name}
                                  <button
                                    type="button"
                                    onClick={() => removeOption(variantIndex, optionIndex)}
                                    className="text-gray-500 hover:text-gray-800"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </span>
                              ))}
                              <input
                                className="min-w-[80px] flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-gray-400"
                                placeholder="Escribe y Enter"
                                value={optionDrafts[variantIndex] ?? ''}
                                onChange={(e) =>
                                  setOptionDrafts((prev) => ({
                                    ...prev,
                                    [variantIndex]: e.target.value,
                                  }))
                                }
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault()
                                    addOptionToVariant(variantIndex, optionDrafts[variantIndex] ?? '')
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        {variant.options.length > 0 && (
                          <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">
                            <p className="text-xs font-medium text-gray-600">Precio extra por opción</p>
                            {variant.options.map((option, optionIndex) => (
                              <div key={option.id ?? option.name} className="flex items-center gap-2">
                                <span className="w-28 truncate text-sm text-gray-700">{option.name}</span>
                                <Input
                                  type="number"
                                  className="h-8 w-28"
                                  value={option.extraPrice}
                                  onChange={(e) =>
                                    updateOptionExtraPrice(
                                      variantIndex,
                                      optionIndex,
                                      Number(e.target.value)
                                    )
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        )}

                      </div>
                    ))}
                  </div>

                </section>
              </div>
            </ScrollArea>

            <div className="flex shrink-0 flex-col gap-3 border-t bg-white px-4 py-4 safe-area-pb sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <button
                type="button"
                className="text-left text-sm text-blue-600 hover:underline"
              >
                Más información sobre variantes de producto
              </button>
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  className="w-full bg-green-600 text-white hover:bg-green-500 sm:w-auto"
                  onClick={handleSave}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
